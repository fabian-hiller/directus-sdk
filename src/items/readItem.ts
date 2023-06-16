import type {
  Client,
  Collections,
  ItemKey,
  ItemQuery,
  ItemDataResponse,
  GetItem,
  DataQuery,
  GetCollection,
} from '../types';
import {
  fetchDirectus,
  getBasePath,
  getDataQueryParams,
  getItemQueryParams,
} from '../utils';

/**
 * Reads a single item by its primary key.
 *
 * @param client The client.
 * @param collection The collection.
 * @param key The primary key.
 * @param query The query.
 *
 * @returns The item.
 */
// @ts-expect-error: Type instantiation is excessively deep and possibly infinite
export async function readItem<
  TCollections extends Collections,
  TCollection extends GetCollection<TCollections>,
  TItem extends GetItem<TCollections, TCollection>,
  TQuery extends DataQuery<TItem>
>(
  client: Client<TCollections>,
  collection: TCollection,
  key: ItemKey,
  query?: TQuery
): Promise<ItemDataResponse<TItem, TQuery>>;

/**
 * Reads a single item by a query.
 *
 * @param client The client.
 * @param collection The collection.
 * @param query The query.
 *
 * @returns The item.
 */
export async function readItem<
  TCollections extends Collections,
  TCollection extends GetCollection<TCollections>,
  TItem extends GetItem<TCollections, TCollection>,
  TQuery extends ItemQuery<TItem>
>(
  client: Client<TCollections>,
  collection: TCollection,
  query: TQuery
): Promise<ItemDataResponse<TItem, TQuery> | null>;

export async function readItem<
  TCollections extends Collections,
  TCollection extends GetCollection<TCollections>,
  TItem extends GetItem<TCollections, TCollection>,
  TQuery extends DataQuery<TItem> | ItemQuery<TItem>
>(
  client: Client<TCollections>,
  collection: TCollection,
  arg3: ItemKey | TQuery,
  arg4?: TQuery
): Promise<ItemDataResponse<TItem, TQuery> | null> {
  // If arg3 is query object, read by query
  if (typeof arg3 === 'object') {
    const response = await fetchDirectus<ItemDataResponse<TItem, TQuery>[]>(
      client,
      {
        path: getBasePath(collection),
        method: 'GET',
        params: {
          ...getItemQueryParams(arg3),
          limit: '1',
        },
      }
    );
    return response.data[0] || null;
  }

  // Otherwise read item by primary key
  const response = await fetchDirectus<ItemDataResponse<TItem, TQuery>>(
    client,
    {
      path: `${getBasePath(collection)}/${arg3}`,
      method: 'GET',
      params: getDataQueryParams(arg4),
    }
  );
  return response.data;
}
