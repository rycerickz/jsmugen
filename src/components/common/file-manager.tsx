"use client";

interface FileManagerProps {
  onLoaded: (files: File[]) => void;
}

export default function FileManager(props: FileManagerProps) {
  const { onLoaded } = props;

  const onSelect = async () => {
    try {
      if (!window.showDirectoryPicker) {
        console.error("Your browser does not support directory selection.");
        return;
      }

      const directoryHandle = await window.showDirectoryPicker();

      const files: File[] = [];

      for await (const entry of directoryHandle.values()) {
        if (entry.kind === "file") {
          const file = await entry.getFile();
          files.push(file);
        }
      }

      onLoaded(files);
    } catch (error) {
      console.error("Error selecting folder", error);
    }
  };

  return (
    <button onClick={onSelect}>
      Select folder
    </button>
  );
}
