import type { Item, ItemData, ItemsAggregateQuery } from '../types';
import { getObjectPaths } from './getObjectPaths';
import { DirectusError } from '../exceptions';

/**
 * Returns the items query params.
 *
 * @param aggregate The aggregate query.
 *
 * @returns The query params.
 */
export function getItemsAggregateQueryParams({
  aggregate,
}: ItemsAggregateQuery<Item<ItemData>>): string {
  if (!aggregate) throw new DirectusError(aggregate);

  return Object.entries(aggregate)
    .map(([aggregateKey, itemFields]) => {
      if (itemFields === '*') return `aggregate[${aggregateKey}]=*`;

      return `aggregate[${aggregateKey}]=${getObjectPaths(
        itemFields,
        (list, path, value, self) => {
          if (value === true) {
            list.push(path);
          } else {
            self(value, list, path);
          }
        }
      )}`;
    })
    .join('&');
}
