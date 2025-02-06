import { downloadAndUnzip } from "@/utils/zip";
import Server, { STATES } from "@dr.pogodin/react-native-static-server";
import * as FileSystem from "expo-file-system";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

type StaticServerContextType = {
  loading: boolean;
  error: string | null;
  serverUrl: string | null;
  restartServer: () => Promise<void>;
};

const StaticServerContext = createContext<StaticServerContextType | null>(null);

export function useStaticServer() {
  const context = useContext(StaticServerContext);
  if (!context) {
    throw new Error(
      "useStaticServer must be used within aStaticServerProvider"
    );
  }
  return context;
}

export function StaticServerProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [serverUrl, setServerUrl] = useState<string | null>(null);
  const [server, setServer] = useState<Server | null>(null);
  const ZIP_URL = "http://10.186.242.51:3000/content.zip";

  const startServer = async () => {
    try {
      setLoading(true);
      setError(null);
      await stopServer();

      // Download and unzip content
      const dest = `${FileSystem.documentDirectory}content/`;
      const unzippedLocation = await downloadAndUnzip(`${ZIP_URL}`, dest);

      // Create server
      const staticServer = new Server({
        fileDir: unzippedLocation,
        port: 0, // Let the server pick an available port
        hostname: "127.0.0.1", // Local loopback address
      });

      // Add state listener for debugging
      staticServer.addStateListener((state, details, error) => {
        console.log(
          `[server.addStateListener] Origin: ${server?.origin}`,
          `[server.addStateListener] New state: "${STATES[state]}".\n`,
          `[server.addStateListener] Details: "${details}".`
        );
        if (error) console.error("Server error:", error);
      });

      // Start the server
      const origin = await staticServer.start();
      setServer(staticServer);
      setServerUrl(origin);
    } catch (e: unknown) {
      console.error("Error starting the server:", e);
      setError(e instanceof Error ? e.message : "Failed to start the server.");
    } finally {
      setLoading(false);
    }
  };

  const stopServer = async () => {
    if (server) {
      await server.stop();
      server.removeAllStateListeners();
      setServer(null);
      setServerUrl(null);
    }
  };

  const restartServer = async () => {
    startServer();
  };

  useEffect(() => {
    startServer();

    return () => {
      stopServer();
    };
  }, []);

  return (
    <StaticServerContext.Provider
      value={{ loading, error, serverUrl, restartServer }}
    >
      {children}
    </StaticServerContext.Provider>
  );
}
