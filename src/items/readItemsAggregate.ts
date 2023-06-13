import type {
  Client,
  Collections,
  GetItem,
  ItemsAggregateQuery,
  ItemMetaResponse,
  GetCollection,
  ItemsAggregateDataResponse,
} from '../types';
import {
  fetchDirectus,
  getBasePath,
  getItemsAggregateQueryParams,
} from '../utils';

/**
 * Reads multiple items by a query.
 *
 * @param client The client.
 * @param collection The collection.
 * @param query The query.
 *
 * @returns The query tuple.
 */
export async function readItemsAggregate<
  TCollections extends Collections,
  TCollection extends GetCollection<TCollections>,
  TItem extends GetItem<TCollections, TCollection>,
  TQuery extends ItemsAggregateQuery<TItem>
>(
  client: Client<TCollections>,
  collection: TCollection,
  query: TQuery
): Promise<
  [ItemsAggregateDataResponse<TItem, TQuery>[], ItemMetaResponse<TQuery>]
>;

export async function readItemsAggregate<
  TCollections extends Collections,
  TCollection extends GetCollection<TCollections>,
  TItem extends GetItem<TCollections, TCollection>,
  TQuery extends ItemsAggregateQuery<TItem>
>(
  client: Client<TCollections>,
  collection: TCollection,
  arg3: TQuery
): Promise<
  | ItemsAggregateDataResponse<TItem, TQuery>[]
  | [ItemsAggregateDataResponse<TItem, TQuery>[], ItemMetaResponse<TQuery>]
> {
  const response = await fetchDirectus<
    ItemsAggregateDataResponse<TItem, TQuery>[],
    ItemMetaResponse<TQuery>
  >(client, {
    path: getBasePath(collection),
    method: 'GET',
    params: getItemsAggregateQueryParams(arg3),
  });

  return [response.data, response.meta];
}
