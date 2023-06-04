import type { DirectusCollections } from './directus';
import type { MaybeArray } from './utils';

/**
 * Value type of the primary key.
 */
export type ItemKey = string | number;

/**
 * Value type of the JSON data.
 */
export type JsonData = {
  [key: string]: MaybeArray<ItemField>;
};

/**
 * Value type of the JSON.
 */
export type Json<TJsonData extends JsonData> = TJsonData & {
  __json__: true;
};

/**
 * Value type of the field value.
 */
export type ItemField =
  | ItemKey
  | Json<JsonData>
  | string[]
  | string
  | number
  | boolean
  | null;

/**
 * Value type of the item data.
 */
export type ItemData = {
  [name: string]: ItemField | MaybeArray<Relation<Item<ItemData>>>;
};

/**
 * Value type of the item meta.
 */
export type ItemMeta = {
  total_count: number;
  filter_count: number;
};

/**
 * Value type of the item.
 */
export type Item<TItemData extends ItemData> = TItemData & {
  __item__: true;
};

/**
 * Value type of the relation.
 */
export type Relation<TItem extends Item<ItemData>> = TItem & {
  __relation__: true;
};

/**
 * Value type of the collections.
 */
export type Collections = {
  [name: string]: Item<ItemData>;
};

/**
 * Returns the specified item from the collections.
 */
export type GetItem<
  TCollections extends Collections,
  TName extends keyof TCollections | keyof DirectusCollections
> = TName extends keyof TCollections
  ? TName extends keyof DirectusCollections
    ? TCollections[TName] & DirectusCollections[TName]
    : TCollections[TName]
  : TName extends keyof DirectusCollections
  ? DirectusCollections[TName]
  : never;

/**
 * Returns the possible collection names.
 */
export type GetCollection<TCollections extends Collections> = (
  | keyof TCollections
  | keyof DirectusCollections
) &
  string;
