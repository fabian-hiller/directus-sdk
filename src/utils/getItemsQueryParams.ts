import type { Item, ItemData, ItemsQuery } from '../types';
import { getObjectPaths } from './getObjectPaths';
import { getItemQueryParams } from './getItemQueryParams';

/**
 * Value type of the items query params.
 */
type ItemsQueryParams = {
  [TKey in keyof ItemsQuery<Item<ItemData>>]: string;
};

/**
 * Returns the items query params.
 *
 * @param query The query.
 *
 * @returns The query params.
 */
export function getItemsQueryParams({
  sort,
  limit,
  offset,
  page,
  meta,
  ...rest
}: ItemsQuery<Item<ItemData>> = {}): ItemsQueryParams {
  const query: ItemsQueryParams = getItemQueryParams(rest);
  if (sort) {
    query.sort = getObjectPaths(sort, (list, path, value, self) => {
      if (value === true) {
        list.push(path);
      } else {
        self(value, list, path);
      }
    });
  }
  if (limit !== undefined) {
    query.limit = limit.toString();
  }
  if (offset !== undefined) {
    query.offset = offset.toString();
  }
  if (page !== undefined) {
    query.page = page.toString();
  }
  if (meta) {
    query.meta = meta;
  }
  return query;
}
