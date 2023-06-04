import { getPublicClient } from '../clients';
import type { TokenData, UserClient } from '../types';
import { fetchDirectus } from '../utils';

/**
 * Value type of the request password data.
 */
export type RequestPasswordData = {
  email: string;
};

/**
 * Requests a password reset email.
 *
 * @param client The user client.
 * @param data The request password data.
 */
export async function requestPassword(
  { url }: Pick<UserClient<any>, 'url'>,
  data: RequestPasswordData
): Promise<void> {
  await fetchDirectus<TokenData>(getPublicClient({ url }), {
    path: '/auth/password/request',
    method: 'POST',
    data,
  });
}
