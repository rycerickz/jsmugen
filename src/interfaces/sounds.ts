export interface Sounds {
  file: File;
  selectedSound?: Sound;
  decoded: Decoded;
}

export interface Sound {
  id: string;
  index: number;
  group: number;
  length: number;
  nextOffset: number;
  wavRawData: ArrayBuffer;
  blob: Blob;
}

export interface Decoded {
  signature: string;
  version: number;
  version2: number;
  numberOfSounds: number;
  offset: number;
  sounds: Sound[];
}
