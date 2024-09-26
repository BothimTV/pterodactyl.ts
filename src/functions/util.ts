export function smartConvert(
  bytes: number,
  comma: number = 3,
): {
  value: number;
  unit: string;
  string: string;
} {
  if (bytesToGigabytes(bytes, 0) == 0) {
    // > 1GB
    if (bytesToMegabytes(bytes, 0) == 0) {
      // > 1MB
      if (bytesToKilobytes(bytes, 0) == 0) {
        // > 1KB
        return { value: bytes, unit: 'Bytes', string: `${bytes} Bytes` };
      }
      return {
        value: bytesToKilobytes(bytes, comma),
        unit: 'KiB',
        string: `${bytesToKilobytes(bytes, comma)} KiB`,
      };
    }
    return {
      value: bytesToMegabytes(bytes, comma),
      unit: 'MiB',
      string: `${bytesToMegabytes(bytes, comma)} MiB`,
    };
  }
  return {
    value: bytesToGigabytes(bytes, comma),
    unit: 'GiB',
    string: `${bytesToGigabytes(bytes, comma)} GiB`,
  };
}

function bytesToGigabytes(bytes: number, comma: number = 3): number {
  return parseFloat((bytes / 1073741824).toFixed(comma));
}

function bytesToMegabytes(bytes: number, comma: number = 3): number {
  return parseFloat((bytes / 1048576).toFixed(comma));
}

function bytesToKilobytes(bytes: number, comma: number = 3): number {
  return parseFloat((bytes / 1024).toFixed(comma));
}
