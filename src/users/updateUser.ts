import { updateItem } from '../items';
import type {
  Client,
  Collections,
  ItemKey,
  ItemQuery,
  ItemDataResponse,
  GetItem,
  DataQuery,
  ItemDataRequest,
} from '../types';

/**
 * Updates a single user by its primary key.
 *
 * @param client The client.
 * @param key The primary key.
 * @param data The user data.
 * @param query The query.
 *
 * @returns The user.
 */
export async function updateUser<
  TCollections extends Collections,
  TItem extends GetItem<TCollections, 'directus_users'>,
  TQuery extends DataQuery<TItem>
>(
  client: Client<TCollections>,
  key: ItemKey,
  data: ItemDataRequest<TItem>,
  query?: TQuery
): Promise<ItemDataResponse<TItem, TQuery>>;

/**
 * Updates a single user by a query.
 *
 * @param client The client.
 * @param data The user data.
 * @param query The query.
 *
 * @returns The user.
 */
export async function updateUser<
  TCollections extends Collections,
  TItem extends GetItem<TCollections, 'directus_users'>,
  TQuery extends ItemQuery<TItem>
>(
  client: Client<TCollections>,
  data: ItemDataRequest<TItem>,
  query: TQuery
): Promise<ItemDataResponse<TItem, TQuery> | null>;

export async function updateUser<
  TCollections extends Collections,
  TItem extends GetItem<TCollections, 'directus_users'>,
  TQuery extends DataQuery<TItem> | ItemQuery<TItem>
>(
  client: Client<TCollections>,
  arg2: ItemKey | ItemDataRequest<TItem>,
  arg3: ItemDataRequest<TItem> | TQuery,
  arg4?: TQuery
): Promise<ItemDataResponse<TItem, TQuery> | null> {
  // @ts-expect-error
  return updateItem(client, 'directus_users', arg2, arg3, arg4);
}
