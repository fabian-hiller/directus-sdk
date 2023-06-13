import type {
  Item,
  ItemData,
  ItemMeta,
  Json,
  JsonData,
  ItemKey,
  Relation,
} from './item';
import type { DataQuery, ItemsAggregateQuery, ItemsQuery } from './query';

/**
 * Returns the top level fileds of an item.
 */
export type TopLevelFields<TItem> = {
  [TKey in keyof Omit<TItem, '__item__' | '__relation__'>]: true;
};

/**
 * Filters the item data by the fields query.
 */
export type FilterItemByFields<TItem, TFields> =
  // If fields are undefined, filter by top level fields
  undefined extends TFields
    ? FilterItemByFields<TItem, TopLevelFields<TItem>>
    : // Otherwise filter each key of fields individually
      {
        [TKey1 in keyof TFields]: TKey1 extends keyof TItem
          ? // If value of field is an object, filter nested fields
            TFields[TKey1] extends Record<string, any>
            ? TItem[TKey1] extends Relation<Item<ItemData>>[]
              ? FilterItemByFields<TItem[TKey1][number], TFields[TKey1]>[]
              : TItem[TKey1] extends Relation<Item<ItemData>>
              ? FilterItemByFields<TItem[TKey1], TFields[TKey1]>
              : FilterItemByFields<
                  NonNullable<TItem[TKey1]>,
                  TFields[TKey1]
                > | null
            : // If value of field is a wildcard, filter by top level fields
            TFields[TKey1] extends '*'
            ? TItem[TKey1] extends Relation<Item<ItemData>>[]
              ? FilterItemByFields<
                  TItem[TKey1][number],
                  TopLevelFields<TItem[TKey1][number]>
                >[]
              : TItem[TKey1] extends Relation<Item<ItemData>>
              ? FilterItemByFields<TItem[TKey1], TopLevelFields<TItem[TKey1]>>
              : FilterItemByFields<
                  NonNullable<TItem[TKey1]>,
                  TopLevelFields<NonNullable<TItem[TKey1]>>
                > | null
            : // If value of field is "true", return value of item
            TFields[TKey1] extends true
            ? // If value of item is an array of relation, return array of item keys
              TItem[TKey1] extends Relation<Item<ItemData>>[]
              ? ItemKey[]
              : // If value of item is a relation, return item key
              TItem[TKey1] extends Relation<Item<ItemData>>
              ? ItemKey
              : // If value of item is a relation, return item key
              TItem[TKey1] extends Relation<Item<ItemData>> | null
              ? ItemKey | null
              : // If value of item is JSON, return it without __json__
              TItem[TKey1] extends Json<JsonData>
              ? Omit<TItem[TKey1], '__json__'>
              : // Otherwise return value of field
                TItem[TKey1]
            : never
          : never;
      };

/**
 * Filters the items aggregate data by the aggregate fields query.
 */
export type FilterItemsAggregateByFields<TItem, TFields> = {
  [TKey1 in keyof TFields]: TFields[TKey1] extends '*' | true
    ? number
    : FilterItemsAggregateByFields<TItem, TFields[TKey1]>;
};

/**
 * Value type of the item data response.
 */
export type ItemDataResponse<
  TItem extends Item<ItemData>,
  TQuery extends DataQuery<TItem>
> = FilterItemByFields<TItem, TQuery['fields']>;

/**
 * Value type of the items aggregate data response.
 */
export type ItemsAggregateDataResponse<
  TItem extends Item<ItemData>,
  TQuery extends ItemsAggregateQuery<TItem>
> = FilterItemsAggregateByFields<TItem, TQuery['aggregate']>;

/**
 * Value type of the item meta response.
 */
export type ItemMetaResponse<TQuery extends ItemsQuery<any>> =
  TQuery['meta'] extends '*'
    ? ItemMeta
    : TQuery['meta'] extends keyof ItemMeta
    ? Pick<ItemMeta, TQuery['meta']>
    : undefined;
