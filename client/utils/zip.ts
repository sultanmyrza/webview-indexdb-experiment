import * as FileSystem from "expo-file-system";
import { unzip } from "react-native-zip-archive";

export const downloadAndUnzip = async (
  downloadUrl: string,
  destinationFolder: string
): Promise<string> => {
  try {
    // Create temp directory if it doesn't exist
    const tempZipPath = `${FileSystem.cacheDirectory}temp.zip`;

    // Download the zip file
    const { uri } = await FileSystem.downloadAsync(downloadUrl, tempZipPath);

    // Create destination directory if it doesn't exist
    await FileSystem.makeDirectoryAsync(destinationFolder, {
      intermediates: true,
    });

    // Unzip the file
    const unzippedLocation = await unzip(uri, destinationFolder);

    // Clean up the temporary zip file
    await FileSystem.deleteAsync(tempZipPath);

    return unzippedLocation;
  } catch (error) {
    console.error("Error in downloadAndUnzip:", error);
    throw error;
  }
};
