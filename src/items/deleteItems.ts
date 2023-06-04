import type {
  Client,
  Collections,
  ItemKey,
  GetItem,
  ItemsQuery,
  GetCollection,
} from '../types';
import { fetchDirectus, getBasePath } from '../utils';

/**
 * Deletes multiple items by their primary key.
 *
 * @param client The client.
 * @param collection The collection.
 * @param keys The primary keys.
 *
 * @returns The items.
 */
export async function deleteItems<
  TCollections extends Collections,
  TCollection extends GetCollection<TCollections>
>(
  client: Client<TCollections>,
  collection: TCollection,
  keys: ItemKey[]
): Promise<void>;

/**
 * Deletes multiple items by a query.
 *
 * @param client The client.
 * @param collection The collection.
 * @param query The query.
 *
 * @returns The query tuple.
 */
export async function deleteItems<
  TCollections extends Collections,
  TCollection extends GetCollection<TCollections>,
  TItem extends GetItem<TCollections, TCollection>,
  TQuery extends Omit<ItemsQuery<TItem>, 'fields'>
>(
  client: Client<TCollections>,
  collection: TCollection,
  query: TQuery
): Promise<void>;

export async function deleteItems<
  TCollections extends Collections,
  TCollection extends GetCollection<TCollections>,
  TItem extends GetItem<TCollections, TCollection>,
  TQuery extends Omit<ItemsQuery<TItem>, 'fields'>
>(
  client: Client<TCollections>,
  collection: TCollection,
  arg3: ItemKey[] | TQuery
): Promise<void> {
  await fetchDirectus(client, {
    path: getBasePath(collection),
    method: 'DELETE',
    data: Array.isArray(arg3) ? arg3 : { query: arg3 },
  });
}
