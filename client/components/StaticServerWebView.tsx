import { useStaticServer } from "@/contexts/StaticServerContext";
import Constants from "expo-constants";
import React from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { WebView } from "react-native-webview";
import StaticServerDebugger from "./StaticServerDebugger";

export default function StaticServerWebView() {
  const { loading, error, serverUrl } = useStaticServer();

  const serverUrlUnavailable = !serverUrl && !loading && !error;

  return (
    <View style={{ flex: 1, marginTop: Constants.statusBarHeight }}>
      <StaticServerDebugger />

      {loading && (
        <View style={{ justifyContent: "center", alignItems: "center" }}>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text>Loading...</Text>
        </View>
      )}

      {error && (
        <View style={{ justifyContent: "center", alignItems: "center" }}>
          <Text style={{ color: "red" }}>Error: {error}</Text>
        </View>
      )}

      {serverUrlUnavailable && (
        <View style={{ justifyContent: "center", alignItems: "center" }}>
          <Text>No server URL available.</Text>
        </View>
      )}

      {serverUrl && (
        <WebView
          source={{ uri: serverUrl }}
          originWhitelist={["*"]}
          allowUniversalAccessFromFileURLs={true} // Required for local IndexedDB
          allowingReadAccessToURL={"file://"} // Required for iOS
          style={{ flex: 1 }}
        />
      )}
    </View>
  );
}
