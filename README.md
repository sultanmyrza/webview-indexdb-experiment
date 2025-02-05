# webview-indexdb-experiment

This repository contains a React Native (Expo) application and a Node.js server designed to experiment with and test the functionality and limitations of IndexedDB within a WebView context. The project focuses on offline capabilities by bundling web content (HTML, CSS, JavaScript) and serving it locally, allowing the app to function even without an internet connection.

## Project Overview

The project is structured as a monorepo, containing:

- **`client/`**: The Expo/React Native mobile application. This app downloads web content (index.html, styles.css, main.js) from the server, unzips it, and serves it locally using `react-native-static-server`. A `WebView` component then loads this content, enabling interaction with IndexedDB.

- **`server/`**: The Node.js backend. This server provides the initial web content as a zipped archive (`content.zip`) and can also serve initial data from a SQLite database.

- **`content-zip/`**: A web project (containing HTML, CSS, and JavaScript files) that gets compressed into `content.zip`. The **`server`** hosts this zip file, which the **`client`** downloads and extracts locally. The extracted content is then displayed in the WebView component for offline access. This **`content-zip`** uses IndexedDB within the WebView to test storage limitations and capabilities.

## Testing IndexedDB

The `index.html` from **`content.zip`** contains the JavaScript code necessary to test IndexedDB functionality. You can modify this code to explore different aspects of IndexedDB, such as:

- Storage limits
- Data types
- Asynchronous operations
- Error handling

## Future Improvements

- Implement proper error handling for file downloads and unzipping.
- Add more comprehensive IndexedDB test cases.
- Explore different approaches for initial data synchronization between the client and server.
- Implement a more robust mechanism for updating the web content.
