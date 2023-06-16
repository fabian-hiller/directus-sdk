import type {
  Client,
  Collections,
  ItemKey,
  ItemQuery,
  ItemDataResponse,
  GetItem,
  DataQuery,
  ItemDataRequest,
  GetCollection,
} from '../types';
import { fetchDirectus, getBasePath, getDataQueryParams } from '../utils';

/**
 * Updates a single item by its primary key.
 *
 * @param client The client.
 * @param collection The collection.
 * @param key The primary key.
 * @param data The item data.
 * @param query The query.
 *
 * @returns The item.
 */
// @ts-expect-error: Type instantiation is excessively deep and possibly infinite
export async function updateItem<
  TCollections extends Collections,
  TCollection extends GetCollection<TCollections>,
  TItem extends GetItem<TCollections, TCollection>,
  TQuery extends DataQuery<TItem>
>(
  client: Client<TCollections>,
  collection: TCollection,
  key: ItemKey,
  data: ItemDataRequest<TItem>,
  query?: TQuery
): Promise<ItemDataResponse<TItem, TQuery>>;

/**
 * Updates a single item by a query.
 *
 * @param client The client.
 * @param collection The collection.
 * @param data The item data.
 * @param query The query.
 *
 * @returns The item.
 */
export async function updateItem<
  TCollections extends Collections,
  TCollection extends GetCollection<TCollections>,
  TItem extends GetItem<TCollections, TCollection>,
  TQuery extends ItemQuery<TItem>
>(
  client: Client<TCollections>,
  collection: TCollection,
  data: ItemDataRequest<TItem>,
  query: TQuery
): Promise<ItemDataResponse<TItem, TQuery> | null>;

export async function updateItem<
  TCollections extends Collections,
  TCollection extends GetCollection<TCollections>,
  TItem extends GetItem<TCollections, TCollection>,
  TQuery extends DataQuery<TItem> | ItemQuery<TItem>
>(
  client: Client<TCollections>,
  collection: TCollection,
  arg3: ItemKey | ItemDataRequest<TItem>,
  arg4: ItemDataRequest<TItem> | TQuery,
  arg5?: TQuery
): Promise<ItemDataResponse<TItem, TQuery> | null> {
  // If arg3 is query object, update by query
  if (typeof arg3 === 'object') {
    const { fields, ...query } = arg4 as TQuery;
    const response = await fetchDirectus<ItemDataResponse<TItem, TQuery>[]>(
      client,
      {
        path: getBasePath(collection),
        method: 'PATCH',
        params: getDataQueryParams({ fields }),
        data: {
          data: arg3,
          query: { ...query, limit: 1 },
        },
      }
    );
    return response.data[0] || null;
  }

  // Otherwise update item by primary key
  const response = await fetchDirectus<ItemDataResponse<TItem, TQuery>>(
    client,
    {
      path: `${getBasePath(collection)}/${arg3}`,
      method: 'PATCH',
      data: arg4,
      params: getDataQueryParams(arg5),
    }
  );
  return response.data;
}
