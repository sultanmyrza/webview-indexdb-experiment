import Constants from "expo-constants";
import React from "react";
import { View } from "react-native";
import { WebView } from "react-native-webview";

export default function RemoteServerWebView() {
  return (
    <View style={{ flex: 1, marginTop: Constants.statusBarHeight }}>
      <WebView
        source={{ uri: 'http://10.186.242.48:5173/' }}
        originWhitelist={["*"]}
        allowUniversalAccessFromFileURLs={true} // Required for local IndexedDB
        allowingReadAccessToURL={"file://"} // Required for iOS
        style={{ flex: 1 }}
      />
    </View>
  );
}
