import type {
  Collections,
  ItemDataResponse,
  GetItem,
  DataQuery,
  UserClient,
} from '../types';
import { fetchDirectus, getDataQueryParams } from '../utils';

/**
 * Reads the current user.
 *
 * @param client The client.
 * @param query The query.
 *
 * @returns The user.
 */
export async function readCurrentUser<
  TCollections extends Collections,
  TItem extends GetItem<TCollections, 'directus_users'>,
  TQuery extends DataQuery<TItem>
>(
  client: UserClient<TCollections>,
  query?: TQuery
): Promise<ItemDataResponse<TItem, TQuery>> {
  const response = await fetchDirectus<ItemDataResponse<TItem, TQuery>>(
    client,
    {
      path: '/users/me',
      method: 'GET',
      params: getDataQueryParams(query),
    }
  );
  return response.data;
}
