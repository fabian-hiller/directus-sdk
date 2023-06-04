import { getPublicClient } from '../clients';
import type { TokenData, UserClient } from '../types';
import { fetchDirectus } from '../utils';

/**
 * Value type of the reset password data.
 */
export type ResetPasswordData = {
  token: string;
  password: string;
};

/**
 * Resets the password to a new one.
 *
 * @param client The user client.
 * @param data The request password data.
 */
export async function resetPassword(
  { url }: Pick<UserClient<any>, 'url'>,
  data: ResetPasswordData
): Promise<void> {
  await fetchDirectus<TokenData>(getPublicClient({ url }), {
    path: '/auth/password/reset',
    method: 'POST',
    data,
  });
}
