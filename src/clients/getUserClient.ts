/* eslint-disable @typescript-eslint/ban-types */
import { refresh } from '../auth';
import type {
  TokenData,
  Client,
  ClientOptions,
  TokenActions,
  Collections,
} from '../types';

// Create global token promise map
const tokenPromiseMap = new Map<string, Promise<TokenData>>();

/**
 * Value type of the user client options.
 */
export type UserClientOptions = ClientOptions & TokenActions;

/**
 * Creates and returns a user client.
 *
 * @param options The client options.
 *
 * @returns A user client.
 */
export function getUserClient<TCollections extends Collections = {}>({
  url,
  getTokens,
  setTokens,
}: UserClientOptions): Client<TCollections> {
  return {
    url,
    getToken: async () => {
      // Get current access and refresh token
      const { access_token, refresh_token } = await getTokens();

      // Return access token if cookie is available
      if (access_token) {
        return access_token;
      }

      // Otherwise return new access token if refresh token cookie is available
      if (refresh_token) {
        // Create token promise and response variable
        let tokenPromise = tokenPromiseMap.get(refresh_token);
        let tokenData: TokenData;

        // If token promise has not been created yet, create it
        if (!tokenPromise) {
          // Execute refresh request and get token promise
          tokenPromise = refresh({ url, getTokens, setTokens });

          // Add token promise to map to not run it twice
          tokenPromiseMap.set(refresh_token, tokenPromise);

          // Await token promise to get token data
          tokenData = await tokenPromise;

          // Delete token promise from map to free up memory
          tokenPromiseMap.delete(refresh_token);

          // Otherwise just await token promise to get response
        } else {
          tokenData = await tokenPromise;
        }

        // Return new access token
        return tokenData.access_token;
      }

      // Otherwise return null
      return null;
    },
  };
}
