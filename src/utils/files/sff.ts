const SFF_MAGIC = "ElecbyteSpr\x00";


export interface SFFHeader {
  version: number;
  firstSpriteHeaderOffset: number;
  firstPaletteHeaderOffset?: number;
  numberOfSprites: number;
  numberOfPalettes?: number;
  ldataOffset?: number;
  tdataOffset?: number;
}

export async function processSFF(file: File): Promise<SFF> {
  const arrayBuffer = await file.arrayBuffer();
  const dataView = new DataView(arrayBuffer);

  if (!checkMagic(dataView)) {
    throw new Error(`Invalid sff file: signature ${SFF_MAGIC} not found.`);
  }

  const version = determineVersion(dataView);

  let header: SFFHeader;
  if (version === SFF_VERSION_1) {
    header = readHeaderV1(dataView);
  } else {
    header = readHeaderV2(dataView);
  }

  // 6. Si es v2, leer paletas (header.numberOfPalettes) y guardarlas
  let palettes: SFFPalette[] | undefined;

  if (
    header.version === SFF_VERSION_2 &&
    header.numberOfPalettes &&
    header.firstPaletteHeaderOffset !== undefined
  ) {
    palettes = parsePalettesV2(dataView, header);
  }

  // 7. Parsear sprites según la versión
  const sprites =
    header.version === SFF_VERSION_1
      ? parseSpritesV1(dataView, header)
      : parseSpritesV2(dataView, header);

  // 8. Construir objeto final
  const result: SFF = {
    header,
    sprites,
  };
  if (palettes && palettes.length > 0) {
    result.palettes = palettes;
  }
  return result;
}

function checkMagic(dataView: DataView): boolean {
  let signature = "";
  for (let i = 0; i < 12; i++) {
    signature += String.fromCharCode(dataView.getUint8(i));
  }
  return signature === SFF_MAGIC;
}

function determineVersion(dataView: DataView): number {
  const ver0 = dataView.getUint8(15);

  switch (ver0) {
    case SFF_VERSION_1:
      return SFF_VERSION_1;
    case SFF_VERSION_2:
      return SFF_VERSION_2;
    default:
      throw new Error(`Unsupported sff version: ${ver0}.`);
  }
}

export default processSFF;

/*****************************************************
 *                    CONSTANTES GLOBALES
 *****************************************************/

/**
 * Firma (magic) esperada al inicio de un SFF.
 */

/**
 * Versiones soportadas de SFF.
 */
const SFF_VERSION_1 = 1;
const SFF_VERSION_2 = 2;

/**
 * Tipos de formato de imagen para SFFv2 (basado en la tabla del Go original).
 */
const RAW_FORMAT = 0;
const RLE8_FORMAT = 2;
const RLE5_FORMAT = 3; // se menciona en el go original
const LZ5_FORMAT = 4; // se menciona en el go original
const PNG8_FORMAT = 10; // sffv2.1
const PNG24_FORMAT = 11; // sffv2.1
const PNG32_FORMAT = 12; // sffv2.1

/**
 * Cantidad máxima de paletas para SFF (ej. 12 para chars en M.U.G.E.N).
 * Se basa en ejemplos del código Go (MaxPalNo).
 */
const MAX_PAL_NO = 12;

/*****************************************************
 *              ESTRUCTURAS PRINCIPALES
 *****************************************************/

/**
 * Estructura de encabezado (header) para un archivo SFF,
 * tanto para v1 como para v2 (con campos opcionales).
 */
export interface SFFHeader {
  version: number; // 1 => SFFv1, 2 => SFFv2
  firstSpriteHeaderOffset: number;
  numberOfSprites: number;
  // SFFv2
  firstPaletteHeaderOffset?: number;
  numberOfPalettes?: number;
  ldataOffset?: number;
  tdataOffset?: number;
}

/**
 * Representa información de **una sola** paleta en SFFv2.
 * Se inspira en el Go original (PaletteList, etc.).
 */
export interface SFFPalette {
  group: number; // Group del .act en SFFv2
  number: number; // Number del .act
  colors: Uint32Array; // RGBA (u otro formato) para cada índice
  linkedIndex?: number; // Indica si está linkeada
}

/**
 * Representa un sprite (subarchivo) dentro del SFF.
 * Puede tener referencia a paleta o datos en 8/24/32 bits, etc.
 */
export interface Sprite {
  group: number; // M.U.G.E.N "Group"
  number: number; // M.U.G.E.N "Image"
  offset: [number, number]; // Eje [x, y] para alinear
  size?: [number, number]; // (w, h) para SFFv2
  colorDepth?: number; // Bits de color (8, 24, 32, etc.)
  rawData?: Uint8Array; // Datos (ya sea 8bit, 24bit, 32bit, RGBA, etc.)
  linkedIndex?: number; // Sprites linkeados (si data length=0 en subheader)
  palIndex?: number; // Indica qué paleta (SFFv2) se usó (opcional)
  imageFormat?: number; // RAW, RLE8, RLE5, LZ5, PNG*, etc. (SFFv2)
}

/**
 * Estructura principal que agrupa todo el contenido de un SFF.
 * Incluimos la lista de paletas (SFFv2) y la lista de sprites.
 */
export interface SFF {
  header: SFFHeader;
  palettes?: SFFPalette[]; // paletas (sobre todo SFFv2)
  sprites: Sprite[];
}

/*****************************************************
 *      LECTURA DE HEADER: SFFv1 y SFFv2
 *****************************************************/

/** Lee header SFFv1 tras saltar 16 bytes (firma + versión). */
function readHeaderV1(dv: DataView): SFFHeader {
  const baseOffset = 16;
  const numberOfSprites = dv.getUint32(baseOffset + 4, true);
  const firstSpriteHeaderOffset = dv.getUint32(baseOffset + 8, true);

  return {
    version: SFF_VERSION_1,
    numberOfSprites,
    firstSpriteHeaderOffset,
  };
}

/** Lee header SFFv2 tras saltar 16 bytes. */
function readHeaderV2(dv: DataView): SFFHeader {
  const baseOffset = 16;
  const firstSpriteHeaderOffset = dv.getUint32(baseOffset + 20, true);
  const numberOfSprites = dv.getUint32(baseOffset + 24, true);
  const firstPaletteHeaderOffset = dv.getUint32(baseOffset + 28, true);
  const numberOfPalettes = dv.getUint32(baseOffset + 32, true);
  const ldataOffset = dv.getUint32(baseOffset + 36, true);
  const tdataOffset = dv.getUint32(baseOffset + 44, true);

  return {
    version: SFF_VERSION_2,
    firstSpriteHeaderOffset,
    numberOfSprites,
    firstPaletteHeaderOffset,
    numberOfPalettes,
    ldataOffset,
    tdataOffset,
  };
}

/*****************************************************
 *        PARSE PALLETAS (SFFv2) - parsePalettesV2
 *****************************************************/
/**
 * Lee la tabla de paletas en SFFv2: cada registro son 16 bytes
 * (group, number, ncol, link, offset, length).
 * Luego lee las paletas (RGBA) del archivo, según offset + ldataOffset.
 * Basado en la lógica del Go original.
 */
function parsePalettesV2(dv: DataView, header: SFFHeader): SFFPalette[] {
  if (!header.firstPaletteHeaderOffset || !header.numberOfPalettes) {
    return [];
  }

  const palettes: SFFPalette[] = [];
  const base = header.firstPaletteHeaderOffset;
  const count = header.numberOfPalettes;
  const lofs = header.ldataOffset || 0; // offset local
  // tdataOffset no suele usarse para paletas, pero se deja por si acaso

  for (let i = 0; i < count; i++) {
    const offsetRec = base + i * 16;
    if (offsetRec + 16 > dv.byteLength) break;

    const group = dv.getUint16(offsetRec, true);
    const number = dv.getUint16(offsetRec + 2, true);
    const ncol = dv.getUint16(offsetRec + 4, true); // num de colores
    const linkIndex = dv.getUint16(offsetRec + 6, true);
    const fileOff = dv.getUint32(offsetRec + 8, true);
    const fileLen = dv.getUint32(offsetRec + 12, true);

    // Verificar si está linkeada (fileLen=0 => link)
    if (fileLen === 0) {
      // Paleta linkeada a linkIndex
      palettes.push({
        group,
        number,
        colors: new Uint32Array(0),
        linkedIndex: linkIndex,
      });
      continue;
    }

    // Offset real para leer datos de paleta
    const palDataOffset = fileOff + lofs;
    const endPal = palDataOffset + fileLen;
    if (endPal > dv.byteLength) {
      // Fuera de rango => se ignora
      continue;
    }

    // Leer la paleta en RGBA: SFFv2 la guarda en RGBA8888
    const palBytes = new Uint8Array(dv.buffer, palDataOffset, fileLen);
    const colors = parsePaletteData(palBytes, ncol);
    palettes.push({
      group,
      number,
      colors,
    });
  }

  // Resolver link de paletas linkeadas
  for (let i = 0; i < palettes.length; i++) {
    const p = palettes[i];
    if (p.linkedIndex !== undefined && p.linkedIndex < palettes.length) {
      // Toma las coles de la paleta link destino
      const dest = palettes[p.linkedIndex];
      p.colors = dest.colors;
    }
  }

  return palettes;
}

/**
 * parsePaletteData: dado un Uint8Array que contiene RGBA8888,
 * y la cantidad de colores ncol, retornamos un Uint32Array con
 * cada color en ARGB o RGBA (dependiendo de tu preferencia).
 */
function parsePaletteData(palBytes: Uint8Array, ncol: number): Uint32Array {
  // Cada color se compone de 4 bytes: RGBA
  const colors = new Uint32Array(ncol);
  for (let i = 0; i < ncol; i++) {
    const r = palBytes[i * 4 + 0];
    const g = palBytes[i * 4 + 1];
    const b = palBytes[i * 4 + 2];
    const a = palBytes[i * 4 + 3];
    // Convertimos a RGBA en 32 bits => (r << 24) | (g << 16) | ...
    // o ARGB => (a << 24) ...
    // Aquí, tomamos RGBA
    const rgba = (r << 24) | (g << 16) | (b << 8) | a;
    colors[i] = rgba;
  }
  return colors;
}

/*****************************************************
 *      PARSE DE SPRITES: SFFv1 y SFFv2
 *****************************************************/

/**
 * SFFv1: lee subheaders de 19 bytes cada uno.
 *   - offset 0 => nextSubFileOffset
 *   - offset 4 => lengthOfImageData
 *   - offset 8 => xAxis
 *   - offset 10 => yAxis
 *   - offset 12 => group
 *   - offset 14 => number
 *   - offset 16 => linkIndex
 *   - offset 18 => paletteFlag
 *   - PCX data en offset + 32
 */
function parseSpritesV1(dv: DataView, header: SFFHeader): Sprite[] {
  const sprites: Sprite[] = [];
  let currentOffset = header.firstSpriteHeaderOffset;

  for (let i = 0; i < header.numberOfSprites; i++) {
    if (currentOffset + 19 > dv.byteLength) break;

    const nextSubFileOffset = dv.getUint32(currentOffset, true);
    const lengthOfImageData = dv.getUint32(currentOffset + 4, true);
    const xAxis = dv.getInt16(currentOffset + 8, true);
    const yAxis = dv.getInt16(currentOffset + 10, true);
    const group = dv.getUint16(currentOffset + 12, true);
    const number = dv.getUint16(currentOffset + 14, true);
    const linkedIndex = dv.getUint16(currentOffset + 16, true);
    // paletteFlag => dv.getUint8(currentOffset+18) (omitir)

    let spriteData: Uint8Array | undefined;
    if (lengthOfImageData > 0) {
      const pcxDataOffset = currentOffset + 32;
      const endOffset = pcxDataOffset + lengthOfImageData;
      if (endOffset <= dv.byteLength) {
        // Leemos la porción del PCX
        const pcxBytes = new Uint8Array(
          dv.buffer,
          pcxDataOffset,
          lengthOfImageData
        );
        // Decodificamos PCX => 8 bits + posible paleta.
        spriteData = decodePCX(pcxBytes);
      }
    }

    sprites.push({
      group,
      number,
      offset: [xAxis, yAxis],
      rawData: spriteData,
      linkedIndex,
    });

    if (nextSubFileOffset === 0 || nextSubFileOffset >= dv.byteLength) {
      // fin
      break;
    }
    currentOffset = nextSubFileOffset;
  }

  return sprites;
}

/**
 * SFFv2: cada entrada en la tabla son 28 bytes.
 *    - offset 0 => group
 *    - offset 2 => number
 *    - offset 4 => w
 *    - offset 6 => h
 *    - offset 8 => xAxis
 *    - offset 10 => yAxis
 *    - offset 12 => linkIndex
 *    - offset 14 => imageFormat
 *    - offset 15 => colorDepth
 *    - offset 16 => fileOff
 *    - offset 20 => fileLen
 *    - offset 24 => palIndex
 *    - offset 26 => flags
 */
function parseSpritesV2(dv: DataView, header: SFFHeader): Sprite[] {
  const sprites: Sprite[] = [];
  let offset = header.firstSpriteHeaderOffset;

  for (let i = 0; i < header.numberOfSprites; i++) {
    if (offset + 28 > dv.byteLength) break;

    const group = dv.getUint16(offset, true);
    const number = dv.getUint16(offset + 2, true);
    const w = dv.getUint16(offset + 4, true);
    const h = dv.getUint16(offset + 6, true);
    const xAxis = dv.getInt16(offset + 8, true);
    const yAxis = dv.getInt16(offset + 10, true);
    const linkIndex = dv.getUint16(offset + 12, true);
    const imageFormat = dv.getUint8(offset + 14);
    const colorDepth = dv.getUint8(offset + 15);
    const fileOff = dv.getUint32(offset + 16, true);
    const fileLen = dv.getUint32(offset + 20, true);
    const palIndex = dv.getUint16(offset + 24, true);
    const flags = dv.getUint16(offset + 26, true);

    let spriteData: Uint8Array | undefined;
    if (fileLen > 0) {
      const actualOffset =
        flags === 0
          ? fileOff + (header.ldataOffset || 0)
          : fileOff + (header.tdataOffset || 0);

      const endPos = actualOffset + fileLen;
      if (endPos <= dv.byteLength) {
        const rawSpriteBytes = new Uint8Array(dv.buffer, actualOffset, fileLen);
        // decodificar (RAW, RLE, LZ, PNG, etc.)
        spriteData = decodeSffv2Image(
          rawSpriteBytes,
          w,
          h,
          colorDepth,
          imageFormat
        );
      }
    }

    sprites.push({
      group,
      number,
      offset: [xAxis, yAxis],
      size: [w, h],
      colorDepth,
      rawData: spriteData,
      linkedIndex: fileLen === 0 ? linkIndex : undefined,
      palIndex, // si tuviéramos que referir a una paleta
      imageFormat, // para debug o uso posterior
    });

    offset += 28;
  }

  return sprites;
}

/*****************************************************
 *         DECODIFICACIÓN DE IMÁGENES
 *****************************************************/

/**
 * Decodifica un PCX. En el Go original se hacía RLE, etc.
 * Aquí podrías implementar la lógica o usar una librería si lo prefieres.
 * Para no perder detalle, se asume que es un PCX de 8 bits.
 */
function decodePCX(pcxBytes: Uint8Array): Uint8Array {
  console.log("Decoding PCX, size=", pcxBytes.length);
  // Ejemplo: parseHeaderPCX, parseRLE, extraer paleta si la hay al final (768 bytes).
  // Retornamos crudo en este demo, adaptarlo a tus necesidades.
  return pcxBytes;
}

/**
 * Decide qué rutina de decodificación usar según imageFormat (SFFv2).
 */
function decodeSffv2Image(
  data: Uint8Array,
  width: number,
  height: number,
  colorDepth: number,
  imageFormat: number
): Uint8Array {
  switch (imageFormat) {
    case RAW_FORMAT:
      return decodeRaw(data, width, height, colorDepth);

    case RLE8_FORMAT:
      return decodeRLE8(data, width, height);

    case RLE5_FORMAT:
      return decodeRLE5(data, width, height);

    case LZ5_FORMAT:
      return decodeLZ5(data, width, height);

    case PNG8_FORMAT:
    case PNG24_FORMAT:
    case PNG32_FORMAT:
      return decodePNG(data);

    default:
      console.warn("Formato de imagen desconocido:", imageFormat);
      return data;
  }
}

/**
 * Decodifica datos RAW (8/24/32 bits).
 * Podrías convertir a RGBA real si quisieras.
 */
function decodeRaw(
  rawData: Uint8Array,
  width: number,
  height: number,
  depth: number
): Uint8Array {
  console.log("Decoding RAW:", { width, height, depth });
  // En un caso real, haríamos:
  //  - si depth=8 => indices
  //  - si depth=24 => [R,G,B]
  //  - si depth=32 => [R,G,B,A]
  // Por ahora, retornamos tal cual
  return rawData;
}

/**
 * Decodifica RLE8 (ejemplo simplificado).
 * En el Go original hay una lógica para expandir runs con 0x40...
 */
function decodeRLE8(
  rleData: Uint8Array,
  width: number,
  height: number
): Uint8Array {
  console.log(
    "Decoding RLE8, size=",
    rleData.length,
    " w=",
    width,
    " h=",
    height
  );
  // Debes expandir la codificación run-length
  // Ejemplo (simplificado):
  let i = 0;
  const output: number[] = [];
  while (i < rleData.length) {
    const c = rleData[i++];
    if ((c & 0xc0) === 0x40 && i < rleData.length) {
      // run
      const runLength = c & 0x3f;
      const colorByte = rleData[i++];
      for (let r = 0; r < runLength; r++) {
        output.push(colorByte);
      }
    } else {
      // literal
      output.push(c);
    }
  }
  // Convertimos a Uint8Array
  return new Uint8Array(output);
}

/**
 * Decodifica RLE5. En el Go original (sffv2).
 * Es un formato raro. Se ejemplifica, pero puede requerir más detalles.
 */
function decodeRLE5(
  rleData: Uint8Array,
  width: number,
  height: number
): Uint8Array {
  console.log(
    "Decoding RLE5, size=",
    rleData.length,
    " w=",
    width,
    " h=",
    height
  );
  // Lógica parecida a RLE8, pero con 5 bits
  // Por brevedad, dejamos un stub:
  return rleData;
}

/**
 * Decodifica LZ5 (sffv2).
 * Nuevamente, stub simplificado.
 */
function decodeLZ5(
  lzData: Uint8Array,
  width: number,
  height: number
): Uint8Array {
  console.log(
    "Decoding LZ5, size=",
    lzData.length,
    " w=",
    width,
    " h=",
    height
  );
  // Implementar LZ5. Stub:
  return lzData;
}

/**
 * Decodificar PNG (PNG8, PNG24, PNG32).
 * Se podría usar una librería como 'pngjs' en Node, o `createImageBitmap` en navegador.
 */
function decodePNG(pngData: Uint8Array): Uint8Array {
  console.log("Decoding PNG, size=", pngData.length);
  // Stub => retornamos crudo
  return pngData;
}
