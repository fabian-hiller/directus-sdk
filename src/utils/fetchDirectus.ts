import { DirectusError } from '../exceptions';
import type { Client, Maybe, MaybeValue } from '../types';

/**
 * Value type of the fetch options.
 */
type FetchOptions = {
  method: 'GET' | 'SEARCH' | 'POST' | 'PATCH' | 'DELETE';
  path: string;
  params?: Maybe<Record<string, string>>;
  data?: MaybeValue<Record<string, any>>;
};

/**
 * Sends fetch request to Directus and returns the JSON response.
 *
 * @param client The client.
 * @param options The fetch options.
 *
 * @returns The JSON response.
 */
export async function fetchDirectus<
  TData extends Record<string, any>,
  TMeta extends Record<string, any> | undefined = undefined
>(
  { url, getToken }: Client<any>,
  { path, method, params, data = null }: FetchOptions
): Promise<{ data: TData; meta: TMeta }> {
  // Create request headers
  const headers: HeadersInit = { 'Content-Type': 'application/json' };
  const token = await getToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;

  // Execute fetch request and get JSON response
  const response = await fetch(
    new URL(`${url}${path}?${new URLSearchParams(params)}`).href,
    { method, headers, body: data && JSON.stringify(data) }
  );
  const jsonResponse = await response.json().catch(() => null);

  // Throw a Directus error if request was not successfull
  if (!response.ok) {
    throw new DirectusError(jsonResponse);
  }

  // Otherwise return JSON response
  return jsonResponse;
}
