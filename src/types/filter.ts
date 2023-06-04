import type { ItemField, Item, ItemData, Relation } from './item';
import type { FilterQuery } from './query';

/**
 * Value type of the "and" filter.
 */
export type AndFilter<TItem extends Item<ItemData>> = {
  _and: FilterQuery<TItem>[];
};

/**
 * Value type of the "or" filter.
 */
export type OrFilter<TItem extends Item<ItemData>> = {
  _or: FilterQuery<TItem>[];
};

/**
 * Value type of the logical filter.
 */
export type LogicalFilter<TItem extends Item<ItemData>> =
  | AndFilter<TItem>
  | OrFilter<TItem>;

/**
 * Value type of the filter operators.
 * TODO: Show only one filter option and make value type safe.
 */
export type FilterOperators<TFieldValue extends ItemField> = {
  _eq?: TFieldValue;
  _neq?: TFieldValue;
  _gt?: TFieldValue;
  _gte?: TFieldValue;
  _lt?: TFieldValue;
  _lte?: TFieldValue;
  _in?: TFieldValue[];
  _nin?: TFieldValue[];
  _between?: TFieldValue[];
  _nbetween?: TFieldValue[];
  _contains?: TFieldValue;
  _ncontains?: TFieldValue;
  _starts_with?: TFieldValue;
  _nstarts_with?: TFieldValue;
  _ends_with?: TFieldValue;
  _nends_with?: TFieldValue;
  _empty?: boolean;
  _nempty?: boolean;
  _nnull?: boolean;
  _null?: boolean;
  _intersects?: TFieldValue;
  _nintersects?: TFieldValue;
  _intersects_bbox?: TFieldValue;
  _nintersects_bbox?: TFieldValue;
};

/**
 * Value type of the field filter.
 */
export type FieldFilter<TItem extends Item<ItemData>> = {
  [TKey in keyof Omit<
    TItem,
    '__item__' | '__relation__'
  >]?: TItem[TKey] extends Relation<Item<ItemData>>[]
    ? FieldFilter<TItem[TKey][number]>
    : TItem[TKey] extends Relation<Item<ItemData>>
    ? FieldFilter<TItem[TKey]>
    : TItem[TKey] extends ItemField
    ? FilterOperators<TItem[TKey]>
    : never;
};
