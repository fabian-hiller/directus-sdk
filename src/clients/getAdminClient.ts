/* eslint-disable @typescript-eslint/ban-types */
import type { Client, ClientOptions, Collections } from '../types';

/**
 * Value type of the admin client options.
 */
export type AdminClientOptions = ClientOptions & {
  staticToken: string;
};

/**
 * Creates and returns a admin client.
 *
 * @param options The client options.
 *
 * @returns A admin client.
 */
export function getAdminClient<TCollections extends Collections = {}>({
  url,
  staticToken,
}: AdminClientOptions): Client<TCollections> {
  return {
    url,
    getToken: () => staticToken,
  };
}
