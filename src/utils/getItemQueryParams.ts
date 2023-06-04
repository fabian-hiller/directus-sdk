import type { Item, ItemData, ItemQuery } from '../types';
import { getDataQueryParams } from './getDataQueryParams';

/**
 * Value type of the item query params.
 */
type ItemQueryParams = {
  [TKey in keyof ItemQuery<Item<ItemData>>]: string;
};

/**
 * Returns the item query params.
 *
 * @param query The query.
 *
 * @returns The query params.
 */
export function getItemQueryParams({
  filter,
  search,
  ...rest
}: ItemQuery<Item<ItemData>> = {}): ItemQueryParams {
  const params: ItemQueryParams = getDataQueryParams(rest);
  if (filter) {
    params.filter = JSON.stringify(filter);
  }
  if (search) {
    params.search = search;
  }
  return params;
}
