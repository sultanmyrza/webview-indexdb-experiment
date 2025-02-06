import React from "react";
import { View, Text, ActivityIndicator, Button } from "react-native";
import { WebView } from "react-native-webview";
import { useStaticServer } from "@/contexts/StaticServerContext";

export default function StaticServerWebView() {
  const { loading, error, serverUrl, restartServer } = useStaticServer();

  const handleRestart = () => {
    restartServer();
  };

  const serverUrlUnavailable = !serverUrl && !loading && !error;

  return (
    <View style={{ flex: 1 }}>
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

      {serverUrl && <WebView source={{ uri: serverUrl }} style={{ flex: 1 }} />}

      <View style={{ padding: 10 }}>
        <Button title="Restart Server" onPress={handleRestart} />
      </View>
    </View>
  );
}
