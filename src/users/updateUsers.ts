import { updateItems } from '../items';
import type {
  Client,
  Collections,
  ItemKey,
  ItemDataResponse,
  GetItem,
  ItemsQuery,
  ItemMetaResponse,
  DataQuery,
  ItemDataRequest,
} from '../types';

/**
 * Updates multiple users by their primary key.
 *
 * @param client The client.
 * @param keys The primary keys.
 * @param data The user data.
 * @param query The query.
 *
 * @returns The users.
 */
export async function updateUsers<
  TCollections extends Collections,
  TItem extends GetItem<TCollections, 'directus_users'>,
  TQuery extends DataQuery<TItem>
>(
  client: Client<TCollections>,
  keys: ItemKey[],
  data: ItemDataRequest<TItem>,
  query?: TQuery
): Promise<ItemDataResponse<TItem, TQuery>[]>;

/**
 * Updates multiple users by a query.
 *
 * @param client The client.
 * @param data The user data.
 * @param query The query.
 *
 * @returns The query tuple.
 */
export async function updateUsers<
  TCollections extends Collections,
  TItem extends GetItem<TCollections, 'directus_users'>,
  TQuery extends ItemsQuery<TItem>
>(
  client: Client<TCollections>,
  data: ItemDataRequest<TItem>,
  query: TQuery
): Promise<[ItemDataResponse<TItem, TQuery>[], ItemMetaResponse<TQuery>]>;

/**
 * Updates multiple users in a batch.
 *
 * @param client The client.
 * @param data The user data array.
 * @param query The query.
 *
 * @returns The users.
 */
export async function updateUsers<
  TCollections extends Collections,
  TItem extends GetItem<TCollections, 'directus_users'>,
  TQuery extends DataQuery<TItem>
>(
  client: Client<TCollections>,
  data: ItemDataRequest<TItem>[],
  query?: TQuery
): Promise<ItemDataResponse<TItem, TQuery>[]>;

export async function updateUsers<
  TCollections extends Collections,
  TItem extends GetItem<TCollections, 'directus_users'>,
  TQuery extends DataQuery<TItem> | ItemsQuery<TItem>
>(
  client: Client<TCollections>,
  arg2: ItemKey[] | ItemDataRequest<TItem> | ItemDataRequest<TItem>[],
  arg3?: ItemDataRequest<TItem> | TQuery,
  arg4?: TQuery
): Promise<
  | ItemDataResponse<TItem, TQuery>[]
  | [ItemDataResponse<TItem, TQuery>[], ItemMetaResponse<TQuery>]
> {
  // @ts-expect-error
  return updateItems(client, 'directus_users', arg2, arg3, arg4);
}
