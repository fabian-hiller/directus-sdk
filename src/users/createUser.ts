import { createItem } from '../items';
import type {
  Client,
  Collections,
  DataQuery,
  GetItem,
  ItemDataRequest,
  ItemDataResponse,
} from '../types';

/**
 * Creates a single user.
 *
 * @param client The client.
 * @param data The user data.
 * @param query The query.
 *
 * @returns The user.
 */
export async function createUser<
  TCollections extends Collections,
  TItem extends GetItem<TCollections, 'directus_users'>,
  TQuery extends DataQuery<TItem>
>(
  client: Client<TCollections>,
  data: ItemDataRequest<TItem>,
  query?: TQuery
): Promise<ItemDataResponse<TItem, TQuery>> {
  // @ts-expect-error: Excessive stack depth comparing types
  return createItem(client, 'directus_users', data, query);
}
