import RemoteServerWebView from "@/components/RemoteServerWebView";
import { StaticServerProvider } from "@/contexts/StaticServerContext";

export default function HomeScreen() {
  return (
    <StaticServerProvider>
      <RemoteServerWebView />
    </StaticServerProvider>
  );
}
