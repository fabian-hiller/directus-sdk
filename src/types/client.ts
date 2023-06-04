import type { Collections } from './item';
import type { TokenActions } from './token';
import type { MaybePromise } from './utils';

/**
 * Value type of the client options.
 */
export type ClientOptions = {
  url: string;
};

/**
 * Value type of the client.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export type Client<TCollections extends Collections> = {
  url: string;
  getToken: () => MaybePromise<string | null>;
};

/**
 * Value type of the user client.
 */
export type UserClient<TCollections extends Collections> =
  Client<TCollections> & TokenActions;
