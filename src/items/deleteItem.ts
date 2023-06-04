import type {
  Client,
  Collections,
  ItemKey,
  ItemQuery,
  GetItem,
  GetCollection,
} from '../types';
import { fetchDirectus, getBasePath } from '../utils';

/**
 * Deletes a single item by its primary key.
 *
 * @param client The client.
 * @param collection The collection.
 * @param key The primary key.
 *
 * @returns The item.
 */
export async function deleteItem<
  TCollections extends Collections,
  TCollection extends GetCollection<TCollections>
>(
  client: Client<TCollections>,
  collection: TCollection,
  key: ItemKey
): Promise<void>;

/**
 * Deletes a single item by a query.
 *
 * @param client The client.
 * @param collection The collection.
 * @param query The query.
 *
 * @returns The item.
 */
export async function deleteItem<
  TCollections extends Collections,
  TCollection extends GetCollection<TCollections>,
  TItem extends GetItem<TCollections, TCollection>,
  TQuery extends Omit<ItemQuery<TItem>, 'fields'>
>(
  client: Client<TCollections>,
  collection: TCollection,
  query: TQuery
): Promise<void>;

export async function deleteItem<
  TCollections extends Collections,
  TCollection extends GetCollection<TCollections>,
  TItem extends GetItem<TCollections, TCollection>,
  TQuery extends Omit<ItemQuery<TItem>, 'fields'>
>(
  client: Client<TCollections>,
  collection: TCollection,
  arg3: ItemKey | TQuery
): Promise<void> {
  // If arg3 is query object, delete by query
  if (typeof arg3 === 'object') {
    await fetchDirectus(client, {
      path: getBasePath(collection),
      method: 'DELETE',
      data: {
        query: {
          ...arg3,
          limit: 1,
        },
      },
    });

    // Otherwise delete item by primary key
  } else {
    await fetchDirectus(client, {
      path: `${getBasePath(collection)}/${arg3}`,
      method: 'DELETE',
    });
  }
}
