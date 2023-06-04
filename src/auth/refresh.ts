import { getPublicClient } from '../clients';
import type { TokenData, UserClient } from '../types';
import { fetchDirectus } from '../utils';

/**
 * Value type of the logout data.
 */
export type RefreshData = {
  refresh_token: string;
};

/**
 * Renews the current refresh token.
 *
 * @param client The user client.
 * @param data The logout data.
 */
export async function refresh({
  url,
  getTokens,
  setTokens,
}: Pick<
  UserClient<any>,
  'url' | 'getTokens' | 'setTokens'
>): Promise<TokenData> {
  const { refresh_token } = await getTokens();
  const response = await fetchDirectus<TokenData>(getPublicClient({ url }), {
    path: '/auth/refresh',
    method: 'POST',
    data: { refresh_token, mode: 'json' },
  });
  await setTokens(response.data);
  return response.data;
}
