import { getPublicClient } from '../clients';
import type { TokenData, UserClient, Maybe } from '../types';
import { fetchDirectus } from '../utils';

/**
 * Value type of the login data.
 */
export type LoginData = {
  email: string;
  password: string;
  otp?: Maybe<string>;
};

/**
 * Logs in the user with email and password.
 *
 * @param client The user client.
 * @param data The login data.
 */
export async function login(
  { url, setTokens }: Pick<UserClient<any>, 'url' | 'setTokens'>,
  data: LoginData
): Promise<TokenData> {
  const response = await fetchDirectus<TokenData>(getPublicClient({ url }), {
    path: '/auth/login',
    method: 'POST',
    data: { ...data, mode: 'json' },
  });
  await setTokens(response.data);
  return response.data;
}
