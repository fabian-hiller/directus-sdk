import { readItem } from '../items';
import type {
  Client,
  Collections,
  ItemKey,
  ItemQuery,
  ItemDataResponse,
  GetItem,
  DataQuery,
} from '../types';

/**
 * Reads a single user by its primary key.
 *
 * @param client The client.
 * @param key The primary key.
 * @param query The query.
 *
 * @returns The user.
 */
export async function readUser<
  TCollections extends Collections,
  TItem extends GetItem<TCollections, 'directus_users'>,
  TQuery extends DataQuery<TItem>
>(
  client: Client<TCollections>,
  key: ItemKey,
  query?: TQuery
): Promise<ItemDataResponse<TItem, TQuery>>;

/**
 * Reads a single user by a query.
 *
 * @param client The client.
 * @param query The query.
 *
 * @returns The user.
 */
export async function readUser<
  TCollections extends Collections,
  TItem extends GetItem<TCollections, 'directus_users'>,
  TQuery extends ItemQuery<TItem>
>(
  client: Client<TCollections>,
  query: TQuery
): Promise<ItemDataResponse<TItem, TQuery> | null>;

export async function readUser<
  TCollections extends Collections,
  TItem extends GetItem<TCollections, 'directus_users'>,
  TQuery extends DataQuery<TItem> | ItemQuery<TItem>
>(
  client: Client<TCollections>,
  arg2: ItemKey | TQuery,
  arg3?: TQuery
): Promise<ItemDataResponse<TItem, TQuery> | null> {
  // @ts-expect-error
  return readItem(client, 'directus_users', arg2, arg3);
}
