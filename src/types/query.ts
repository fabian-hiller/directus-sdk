import type { FieldFilter, LogicalFilter } from './filter';
import type { Item, ItemData, ItemMeta, Relation } from './item';
import type { Maybe } from './utils';

/**
 * Value type of the fields query.
 */
export type FieldsQuery<TItem extends Item<ItemData>> = {
  [TKey in keyof Omit<TItem, '__item__' | '__relation__'>]?: Maybe<
    TItem[TKey] extends Relation<Item<ItemData>>[]
      ? true | '*' | FieldsQuery<TItem[TKey][number]>
      : TItem[TKey] extends Relation<Item<ItemData>> | null
      ? true | '*' | FieldsQuery<NonNullable<TItem[TKey]>>
      : true
  >;
};

/**
 * Value type of the filter query.
 */
export type FilterQuery<TItem extends Item<ItemData>> =
  | LogicalFilter<TItem>
  | FieldFilter<TItem>;

/**
 * Value type of the data query.
 */
export type DataQuery<TItem extends Item<ItemData>> = {
  fields?: Maybe<FieldsQuery<TItem>>;
  // export?: Maybe<'json' | 'csv' | 'xml'>; // TODO:
};

/**
 * Value type of the item query.
 */
export type ItemQuery<TItem extends Item<ItemData>> = DataQuery<TItem> & {
  filter?: Maybe<FilterQuery<TItem>>;
  search?: Maybe<string>;
  // deep?: Maybe<DeepQuery<TItem>>; // TODO:
};

/**
 * Value type of the sort query.
 */
export type SortQuery<TItem extends Item<ItemData>> = {
  [TKey in keyof Omit<TItem, '__item__' | '__relation__'>]?: Maybe<
    TItem[TKey] extends Relation<Item<ItemData>>[]
      ? true | FieldsQuery<TItem[TKey][number]>
      : TItem[TKey] extends Relation<Item<ItemData>>
      ? true | FieldsQuery<TItem[TKey]>
      : true
  >;
};

/**
 * Value type of the items query.
 */
export type ItemsQuery<TItem extends Item<ItemData>> = ItemQuery<TItem> & {
  sort?: Maybe<SortQuery<TItem>>;
  limit?: Maybe<number>;
  offset?: Maybe<number>;
  page?: Maybe<number>;
  meta?: Maybe<keyof ItemMeta | '*'>;
  // groupBy?: string | string[]; // TODO:
  // aggregate?: Aggregate; // TODO:
  // alias?: Record<string, string>; // TODO:
};
