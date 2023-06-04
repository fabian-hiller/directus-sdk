import type {
  Client,
  Collections,
  ItemKey,
  ItemDataResponse,
  GetItem,
  ItemsQuery,
  ItemMetaResponse,
  DataQuery,
  GetCollection,
} from '../types';
import { fetchDirectus, getBasePath, getItemsQueryParams } from '../utils';
import { readItem } from './readItem';

/**
 * Reads multiple items by their primary key.
 *
 * TODO: Check if it is faster to send a single get request instead of
 * request each item individually by primary key.
 *
 * @param client The client.
 * @param collection The collection.
 * @param keys The primary keys.
 * @param query The query.
 *
 * @returns The items.
 */
export async function readItems<
  TCollections extends Collections,
  TCollection extends GetCollection<TCollections>,
  TItem extends GetItem<TCollections, TCollection>,
  TQuery extends DataQuery<TItem>
>(
  client: Client<TCollections>,
  collection: TCollection,
  keys: ItemKey[],
  query?: TQuery
): Promise<ItemDataResponse<TItem, TQuery>[]>;

/**
 * Reads multiple items by a query.
 *
 * @param client The client.
 * @param collection The collection.
 * @param query The query.
 *
 * @returns The query tuple.
 */
export async function readItems<
  TCollections extends Collections,
  TCollection extends GetCollection<TCollections>,
  TItem extends GetItem<TCollections, TCollection>,
  TQuery extends ItemsQuery<TItem>
>(
  client: Client<TCollections>,
  collection: TCollection,
  query: TQuery
): Promise<[ItemDataResponse<TItem, TQuery>[], ItemMetaResponse<TQuery>]>;

export async function readItems<
  TCollections extends Collections,
  TCollection extends GetCollection<TCollections>,
  TItem extends GetItem<TCollections, TCollection>,
  TQuery extends DataQuery<TItem> | ItemsQuery<TItem>
>(
  client: Client<TCollections>,
  collection: TCollection,
  arg3: ItemKey[] | TQuery,
  arg4?: TQuery
): Promise<
  | ItemDataResponse<TItem, TQuery>[]
  | [ItemDataResponse<TItem, TQuery>[], ItemMetaResponse<TQuery>]
> {
  // If arg3 is an array, read each by key
  if (Array.isArray(arg3)) {
    return Promise.all(
      arg3.map((key) =>
        readItem<TCollections, TCollection, TItem, TQuery>(
          client,
          collection,
          key,
          arg4
        )
      )
    );
  }

  // Otherwise read items by query
  const response = await fetchDirectus<
    ItemDataResponse<TItem, TQuery>[],
    ItemMetaResponse<TQuery>
  >(client, {
    path: getBasePath(collection),
    method: 'GET',
    params: getItemsQueryParams(arg3),
  });
  return [response.data, response.meta];
}
