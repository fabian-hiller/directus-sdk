import type {
  Item,
  ItemData,
  ItemMeta,
  Json,
  JsonData,
  ItemKey,
  Relation,
} from './item';
import type { DataQuery, ItemsQuery } from './query';
import type { Primitive } from './utils';

/**
 * Returns the top level fields of an item.
 */
export type TopLevelFields<TItem> = {
  [TKey in keyof Omit<TItem, '__item__' | '__relation__'>]: true;
};

/**
 * Returns the top level fields of an item recursively.
 */
export type RecursiveTopLevelFields<
  TItem,
  TFields,
  Recursive extends { [TKey in keyof TFields]: any } | true
> = {
  [TKey in keyof Omit<
    TItem,
    '__item__' | '__relation__'
  >]: TItem[TKey] extends Primitive ? true : Recursive;
};

/**
 * Filters the item data by the fields query.
 */
export type FilterItemByFields<TItem, TFields> = '*' extends keyof TFields
  ? FilterItemByFields<
      TItem,
      RecursiveTopLevelFields<
        TItem,
        TFields['*'],
        '*' extends keyof TFields['*']
          ? { [TKey in keyof TFields['*']]: TFields['*'][TKey] }
          : true
      >
    >
  : // If fields are undefined, filter by top level fields
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
 * Value type of the item data response.
 */
export type ItemDataResponse<
  TItem extends Item<ItemData>,
  TQuery extends DataQuery<TItem>
> = FilterItemByFields<TItem, TQuery['fields']>;

/**
 * Value type of the item meta response.
 */
export type ItemMetaResponse<TQuery extends ItemsQuery<any>> =
  TQuery['meta'] extends '*'
    ? ItemMeta
    : TQuery['meta'] extends keyof ItemMeta
    ? Pick<ItemMeta, TQuery['meta']>
    : undefined;
