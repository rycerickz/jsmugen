import { SOUNDS_EXTENSION } from "@/constants/extensions";

import { Sound, Sounds } from "@/interfaces/sounds";

const SIGNATURE = "ElecbyteSnd\x00";

export async function processSnd(file: File): Promise<Sounds | undefined> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const dataView = new DataView(arrayBuffer);

    const bytes = new Uint8Array(arrayBuffer, 0, 12);
    const signature = new TextDecoder().decode(bytes);
    if (signature !== SIGNATURE) {
      throw new Error(`The provided file is not a ${SOUNDS_EXTENSION} file.`);
    }

    const version = dataView.getUint16(12, true);
    const version2 = dataView.getUint16(14, true);

    const numberOfSounds = dataView.getUint32(16, true);
    const offset = dataView.getUint32(20, true);

    const sounds: Sound[] = [];

    let position = offset;

    for (let i = 0; i < numberOfSounds; i++) {
      const id = `${file.name}-${i}`;

      if (position < 0 || position + 16 > arrayBuffer.byteLength) {
        console.warn(`Offset out of range: ${position}; stopping reading.`);
        break;
      }

      const nextOffset = dataView.getUint32(position, true);
      const length = dataView.getUint32(position + 4, true);
      const group = dataView.getInt32(position + 8, true);
      const index = dataView.getInt32(position + 12, true);

      const start = position + 16;
      const end = start + length;

      if (end > arrayBuffer.byteLength) {
        console.warn(
          `WAV data out of range (start=${start}, end=${end}); skipping sound.`
        );
        position = nextOffset;
        continue;
      }

      const wavRawData = arrayBuffer.slice(start, end);
      const blob = new Blob([wavRawData], { type: "audio/wav" });

      sounds.push({
        id,
        index,
        group,
        length,
        nextOffset,
        wavRawData,
        blob,
      });

      position = nextOffset;

      if (nextOffset === 0) break;
    }

    return {
      file,
      selectedSound: sounds[0],
      decoded: {
        signature,
        version,
        version2,
        numberOfSounds,
        offset,
        sounds,
      },
    };
  } catch (e) {
    console.error(`Error processing the ${SOUNDS_EXTENSION} file:`, e);
    return;
  }
}
