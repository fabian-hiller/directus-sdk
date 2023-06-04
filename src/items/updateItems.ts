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
  GetCollection,
} from '../types';
import { fetchDirectus, getBasePath, getDataQueryParams } from '../utils';

/**
 * Updates multiple items by their primary key.
 *
 * @param client The client.
 * @param collection The collection.
 * @param keys The primary keys.
 * @param data The item data.
 * @param query The query.
 *
 * @returns The items.
 */
export async function updateItems<
  TCollections extends Collections,
  TCollection extends GetCollection<TCollections>,
  TItem extends GetItem<TCollections, TCollection>,
  TQuery extends DataQuery<TItem>
>(
  client: Client<TCollections>,
  collection: TCollection,
  keys: ItemKey[],
  data: ItemDataRequest<TItem>,
  query?: TQuery
): Promise<ItemDataResponse<TItem, TQuery>[]>;

/**
 * Updates multiple items by a query.
 *
 * @param client The client.
 * @param collection The collection.
 * @param data The item data.
 * @param query The query.
 *
 * @returns The query tuple.
 */
export async function updateItems<
  TCollections extends Collections,
  TCollection extends GetCollection<TCollections>,
  TItem extends GetItem<TCollections, TCollection>,
  TQuery extends ItemsQuery<TItem>
>(
  client: Client<TCollections>,
  collection: TCollection,
  data: ItemDataRequest<TItem>,
  query: TQuery
): Promise<[ItemDataResponse<TItem, TQuery>[], ItemMetaResponse<TQuery>]>;

/**
 * Updates multiple items in a batch.
 *
 * @param client The client.
 * @param collection The collection.
 * @param data The item data array.
 * @param query The query.
 *
 * @returns The items.
 */
export async function updateItems<
  TCollections extends Collections,
  TCollection extends GetCollection<TCollections>,
  TItem extends GetItem<TCollections, TCollection>,
  TQuery extends DataQuery<TItem>
>(
  client: Client<TCollections>,
  collection: TCollection,
  data: ItemDataRequest<TItem>[],
  query?: TQuery
): Promise<ItemDataResponse<TItem, TQuery>[]>;

export async function updateItems<
  TCollections extends Collections,
  TCollection extends GetCollection<TCollections>,
  TItem extends GetItem<TCollections, TCollection>,
  TQuery extends DataQuery<TItem> | ItemsQuery<TItem>
>(
  client: Client<TCollections>,
  collection: TCollection,
  arg3: ItemKey[] | ItemDataRequest<TItem> | ItemDataRequest<TItem>[],
  arg4?: ItemDataRequest<TItem> | TQuery,
  arg5?: TQuery
): Promise<
  | ItemDataResponse<TItem, TQuery>[]
  | [ItemDataResponse<TItem, TQuery>[], ItemMetaResponse<TQuery>]
> {
  // If arg3 is not an array, update by query
  if (!Array.isArray(arg3)) {
    const { fields, ...query } = arg4 as TQuery;
    const response = await fetchDirectus<
      ItemDataResponse<TItem, TQuery>[],
      ItemMetaResponse<TQuery>
    >(client, {
      path: getBasePath(collection),
      method: 'PATCH',
      params: getDataQueryParams({ fields }),
      data: { data: arg3, query },
    });
    return [response.data, response.meta];
  }

  // Otherwise update items by primary key or in batch
  const [query, data] =
    typeof arg3[0] === 'object'
      ? [arg4, arg3]
      : [arg5, { keys: arg3, data: arg4 }];
  const response = await fetchDirectus<ItemDataResponse<TItem, TQuery>[]>(
    client,
    {
      path: getBasePath(collection),
      method: 'PATCH',
      params: getDataQueryParams(query as TQuery),
      data,
    }
  );
  return response.data;
}
