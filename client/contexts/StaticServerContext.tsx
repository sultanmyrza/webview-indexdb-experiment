import { getStaticFilesDir } from "@/utils/staticFiles";
import Server, { STATES } from "@dr.pogodin/react-native-static-server";
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
  serverLogs: string[];
  clearServerLogs: () => void;
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
  const [serverLogs, setServerLogs] = useState<string[]>([]);

  const startServer = async () => {
    try {
      setLoading(true);
      setError(null);
      await stopServer();

      const staticFilesDir = await getStaticFilesDir();

      // Create server
      const staticServer = new Server({
        fileDir: staticFilesDir,
        stopInBackground: true,
        port: 8188,
      });

      staticServer.addStateListener((state, details, error) => {
        const newLogs = [
          `FileDir: ${staticFilesDir}`,
          `Origin: ${server?.origin}`,
          `New state: "${STATES[state]}".`,
          `Details: "${details}".`,
          `Error: "${JSON.stringify(error)}".`,
        ];
        setServerLogs([...serverLogs, ...newLogs]);

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

  const clearServerLogs = () => {
    setServerLogs([]);
  };

  useEffect(() => {
    startServer();

    return () => {
      stopServer();
    };
  }, []);

  return (
    <StaticServerContext.Provider
      value={{
        loading,
        error,
        serverUrl,
        restartServer,
        serverLogs,
        clearServerLogs,
      }}
    >
      {children}
    </StaticServerContext.Provider>
  );
}
