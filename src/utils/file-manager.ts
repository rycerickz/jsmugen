export async function selectFiles(supportedExtensions: string[]): Promise<File[] | undefined> {
  try {
    if (!window.showDirectoryPicker) {
      console.error("Your browser does not support directory selection.");
      return;
    }

    const directoryHandle = await window.showDirectoryPicker();
 

    const files: File[] = [];

    for await (const [name, handle] of directoryHandle.entries()) {
      if (
        handle.kind === "file" &&
        supportedExtensions.some((extension: string) => name.endsWith(extension))
      ) {
        const file = await handle.getFile();
        files.push(file);
      }
    }

    return files;
  } catch (e) {
    console.error("Error selecting files:", e);
    return;
  }
}

export function filterFiles(files: File[], supportedExtensions: string[]): File[] {
  return files.filter((file: File) =>
    supportedExtensions.some((extension: string) => file.name.endsWith(extension))
  );
}
