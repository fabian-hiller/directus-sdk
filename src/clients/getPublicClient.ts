/* eslint-disable @typescript-eslint/ban-types */
import type { Client, ClientOptions, Collections } from '../types';

/**
 * Creates and returns a public client.
 *
 * @param options The client options.
 *
 * @returns A public client.
 */
export function getPublicClient<TCollections extends Collections = {}>({
  url,
}: ClientOptions): Client<TCollections> {
  return {
    url,
    getToken: () => null,
  };
}
