import { del, get, set } from "idb-keyval";

export async function getCachePrime(
  input: number
): Promise<number | undefined> {
  return await get(`prime-${input}`);
}

export async function cachePrime(input: number, result: number): Promise<void> {
  await set(`prime-${input}`, result);
}

export async function deleteCache(input: number): Promise<void> {
  await del(`prime-${input}`);
}
