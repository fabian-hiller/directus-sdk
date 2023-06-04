import type {
  Client,
  Collections,
  ItemDataResponse,
  GetItem,
  ItemDataRequest,
  DataQuery,
  GetCollection,
} from '../types';
import { fetchDirectus, getBasePath, getDataQueryParams } from '../utils';

/**
 * Creates multiple items.
 *
 * @param client The client.
 * @param collection The collection.
 * @param data The item data array.
 * @param query The query.
 *
 * @returns The items.
 */
export async function createItems<
  TCollections extends Collections,
  TCollection extends GetCollection<TCollections>,
  TItem extends GetItem<TCollections, TCollection>,
  TQuery extends DataQuery<TItem>
>(
  client: Client<TCollections>,
  collection: TCollection,
  data: ItemDataRequest<TItem>[],
  query?: TQuery
): Promise<ItemDataResponse<TItem, TQuery>[]> {
  const response = await fetchDirectus<ItemDataResponse<TItem, TQuery>[]>(
    client,
    {
      path: getBasePath(collection),
      method: 'POST',
      data,
      params: getDataQueryParams(query),
    }
  );
  return response.data;
}
