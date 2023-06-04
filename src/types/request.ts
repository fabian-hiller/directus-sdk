import type { Item, ItemData, Json, JsonData, ItemKey, Relation } from './item';

/**
 * Value type of the item data request.
 */
export type ItemDataRequest<TItem extends Item<ItemData>> = {
  // Filter each key of fields individually
  [TKey in keyof Omit<
    TItem,
    '__item__' | '__relation__'
  >]?: TItem[TKey] extends Relation<Item<ItemData>>[]
    ? // If value is an array of relation, return array of item key or item data
      (ItemKey | ItemDataRequest<TItem[TKey][number]>)[]
    : // If value is a relation, return item key or item data
    TItem[TKey] extends Relation<Item<ItemData>>
    ? ItemKey | ItemDataRequest<TItem[TKey]>
    : // If value is JSON, return it without __json__
    TItem[TKey] extends Json<JsonData>
    ? Omit<TItem[TKey], '__json__'>
    : // Otherwise just return value
      TItem[TKey];
};
