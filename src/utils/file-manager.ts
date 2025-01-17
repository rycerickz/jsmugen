export async function selectFiles(
  extensions: string[]
): Promise<File[] | undefined> {
  try {
    if (!window.showDirectoryPicker) {
      console.error("Your browser does not support directory selection.");
      return;
    }

    const directoryHandle = await window.showDirectoryPicker();
    const files: File[] = [];

    async function processDirectory(
      directoryHandle: FileSystemDirectoryHandle
    ) {
      for await (const [name, handle] of directoryHandle.entries()) {
        if (handle.kind === "file") {
          if (
            extensions.some((extension: string) => name.endsWith(extension))
          ) {
            const file = await handle.getFile();
            files.push(file);
          }
        } else if (handle.kind === "directory") {
          await processDirectory(handle as FileSystemDirectoryHandle);
        }
      }
    }

    await processDirectory(directoryHandle);

    return files;
  } catch (e) {
    console.error("Error selecting files:", e);
    return;
  }
}

export function filterFiles(files: File[], extensions: string[]): File[] {
  return files.filter((file: File) =>
    extensions.some((extension: string) => file.name.endsWith(extension))
  );
}
