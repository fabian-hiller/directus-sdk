import type {
  Collections,
  ItemDataResponse,
  GetItem,
  DataQuery,
  ItemDataRequest,
  UserClient,
} from '../types';
import { fetchDirectus, getDataQueryParams } from '../utils';

/**
 * Updates the current user.
 *
 * @param client The client.
 * @param data The user data.
 * @param query The query.
 *
 * @returns The user.
 */
export async function updateCurrentUser<
  TCollections extends Collections,
  TItem extends GetItem<TCollections, 'directus_users'>,
  TQuery extends DataQuery<TItem>
>(
  client: UserClient<TCollections>,
  data: ItemDataRequest<TItem>,
  query?: TQuery
): Promise<ItemDataResponse<TItem, TQuery>> {
  const response = await fetchDirectus<ItemDataResponse<TItem, TQuery>>(
    client,
    {
      path: '/users/me',
      method: 'PATCH',
      params: getDataQueryParams(query),
      data,
    }
  );
  return response.data;
}
