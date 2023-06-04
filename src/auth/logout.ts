import { getPublicClient } from '../clients';
import type { UserClient } from '../types';
import { fetchDirectus } from '../utils';

/**
 * Logs out the user by destroying the session.
 *
 * @param client The user client.
 * @param data The logout data.
 */
export async function logout({
  url,
  getTokens,
  setTokens,
}: Pick<UserClient<any>, 'url' | 'getTokens' | 'setTokens'>): Promise<void> {
  const { refresh_token } = await getTokens();
  await fetchDirectus(getPublicClient({ url }), {
    path: '/auth/logout',
    method: 'POST',
    data: { refresh_token },
  });
  await setTokens(null);
}
