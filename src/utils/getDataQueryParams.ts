import type { DataQuery, Item, ItemData } from '../types';
import { getObjectPaths } from './getObjectPaths';

/**
 * Value type of the data query params.
 */
type DataQueryParams = {
  [TKey in keyof DataQuery<Item<ItemData>>]: string;
};

/**
 * Returns the data query params.
 *
 * @param query The query.
 *
 * @returns The query params.
 */
export function getDataQueryParams({
  fields,
}: DataQuery<Item<ItemData>> = {}): DataQueryParams {
  return fields
    ? {
        fields: getObjectPaths(fields, (list, path, value, self) => {
          if (value === true) {
            list.push(path);
          } else if (value === '*') {
            list.push(`${path}.*`);
          } else {
            self(value, list, path);
          }
        }),
      }
    : {};
}
