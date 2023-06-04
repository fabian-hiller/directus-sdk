import { readItems } from '../items';
import type {
  Client,
  Collections,
  ItemKey,
  ItemDataResponse,
  GetItem,
  ItemsQuery,
  DataQuery,
  ItemMetaResponse,
} from '../types';

/**
 * Reads multiple users by their primary key.
 *
 * @param client The client.
 * @param keys The primary keys.
 * @param query The query.
 *
 * @returns The users.
 */
export async function readUsers<
  TCollections extends Collections,
  TItem extends GetItem<TCollections, 'directus_users'>,
  TQuery extends DataQuery<TItem>
>(
  client: Client<TCollections>,
  keys: ItemKey[],
  query?: TQuery
): Promise<ItemDataResponse<TItem, TQuery>[]>;

/**
 * Reads multiple users by a query.
 *
 * @param client The client.
 * @param query The query.
 *
 * @returns The query tuple.
 */
export async function readUsers<
  TCollections extends Collections,
  TItem extends GetItem<TCollections, 'directus_users'>,
  TQuery extends ItemsQuery<TItem>
>(
  client: Client<TCollections>,
  query: TQuery
): Promise<[ItemDataResponse<TItem, TQuery>[], ItemMetaResponse<TQuery>]>;

export async function readUsers<
  TCollections extends Collections,
  TItem extends GetItem<TCollections, 'directus_users'>,
  TQuery extends DataQuery<TItem> | ItemsQuery<TItem>
>(
  client: Client<TCollections>,
  arg2: ItemKey[] | TQuery,
  arg3?: TQuery
): Promise<
  | ItemDataResponse<TItem, TQuery>[]
  | [ItemDataResponse<TItem, TQuery>[], ItemMetaResponse<TQuery>]
> {
  // @ts-expect-error
  return readItems(client, 'directus_users', arg2, arg3);
}
