import StaticServerWebView from "@/components/StaticServerWebView";
import { StaticServerProvider } from "@/contexts/StaticServerContext";

export default function HomeScreen() {
  return (
    <StaticServerProvider>
      <StaticServerWebView />
    </StaticServerProvider>
  );
}
