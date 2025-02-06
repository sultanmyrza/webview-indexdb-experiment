import { StyleSheet } from "react-native";

import Constants from "expo-constants";
import WebView from "react-native-webview";

export default function HomeScreen() {
  return (
    <WebView style={styles.webView} source={{ uri: "https://expo.dev" }} />
  );
}

const styles = StyleSheet.create({
  webView: {
    flex: 1,
    marginTop: Constants.statusBarHeight,
  },
});
