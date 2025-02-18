/**
 * Convert a string to a Uint8Array
 * @param str - The input string
 * @returns The resulting Uint8Array
 */
export function stringToUint8Array(str: string): Uint8Array {
  const encoder = new TextEncoder();
  return encoder.encode(str);
}

/**
 * Convert a Uint8Array to a string
 * @param uint8Array - The input Uint8Array
 * @returns The resulting string
 */
export function uint8ArrayToString(uint8Array: Uint8Array): string {
  const decoder = new TextDecoder();
  return decoder.decode(uint8Array);
}
