import type { MaybePromise, MaybeValue } from './utils';

/**
 * Value type of the token data.
 */
export type TokenData = {
  refresh_token: string;
  access_token: string;
  expires: number;
};

/**
 * Value type of the user tokes.
 */
export type UserTokens = {
  refresh_token?: MaybeValue<string>;
  access_token?: MaybeValue<string>;
};

/**
 * Value type of the token actions.
 */
export type TokenActions = {
  getTokens: () => MaybePromise<UserTokens>;
  setTokens: (data: TokenData | null) => MaybePromise<void>;
};
