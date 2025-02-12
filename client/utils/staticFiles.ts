import { downloadAndUnzip } from "@/utils/zip";
import * as FileSystem from "expo-file-system";
import * as Network from "expo-network";

/**
 * Retrieves the directory for static files.
 *
 * This function checks the network state to determine if it can download
 * and unzip the static files from a specified URL. If there is no internet
 * connection, it returns the path to the previously downloaded static files.
 *
 * @returns {Promise<string>} A promise that resolves to the path
 * of the static files directory containing the unzipped content from content.zip.
 */
export const getStaticFilesDir = async (): Promise<string> => {
  const ZIP_URL = "http://10.186.242.46:3000/content.zip"; // TODO: extract to env var
  const STATIC_FILES_DIR = `${FileSystem.documentDirectory}content/`;

  const network = await Network.getNetworkStateAsync();
  if (network.isConnected) {
    return await downloadAndUnzip(ZIP_URL, STATIC_FILES_DIR);
  } else {
    // TODO: @sultanmyrza Edge Cases to Consider:
    // - STATIC_FILES_DIR may not exist if it was never created or deleted.
    // - Previous unzipping may have failed, leaving incomplete or corrupted files.
    // - Essential files (e.g., JS or CSS) may be missing, causing functionality issues.
    // - Content may be outdated if the app relies on the latest content.zip while offline.
    return STATIC_FILES_DIR;
  }
};
