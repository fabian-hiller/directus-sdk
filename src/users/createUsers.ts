import { createItems } from '../items';
import type {
  Client,
  Collections,
  ItemDataResponse,
  GetItem,
  ItemDataRequest,
  DataQuery,
} from '../types';

/**
 * Creates multiple users.
 *
 * @param client The client.
 * @param data The user data array.
 * @param query The query.
 *
 * @returns The users.
 */
export async function createUsers<
  TCollections extends Collections,
  TItem extends GetItem<TCollections, 'directus_users'>,
  TQuery extends DataQuery<TItem>
>(
  client: Client<TCollections>,
  data: ItemDataRequest<TItem>[],
  query?: TQuery
): Promise<ItemDataResponse<TItem, TQuery>[]> {
  // @ts-expect-error: Excessive stack depth comparing types
  return createItems(client, 'directus_users', data, query);
}
