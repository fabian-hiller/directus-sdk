import { deleteItem } from '../items';
import type {
  Client,
  Collections,
  GetItem,
  ItemKey,
  ItemQuery,
} from '../types';

/**
 * Deletes a single user by its primary key.
 *
 * @param client The client.
 * @param key The primary key.
 *
 * @returns The user.
 */
export async function deleteUser<TCollections extends Collections>(
  client: Client<TCollections>,
  key: ItemKey
): Promise<void>;

/**
 * Deletes a single user by a query.
 *
 * @param client The client.
 * @param query The query.
 *
 * @returns The user.
 */
export async function deleteUser<
  TCollections extends Collections,
  TItem extends GetItem<TCollections, 'directus_users'>,
  TQuery extends Omit<ItemQuery<TItem>, 'fields'>
>(client: Client<TCollections>, query: TQuery): Promise<void>;

export async function deleteUser<
  TCollections extends Collections,
  TItem extends GetItem<TCollections, 'directus_users'>,
  TQuery extends Omit<ItemQuery<TItem>, 'fields'>
>(client: Client<TCollections>, arg2: ItemKey | TQuery): Promise<void> {
  // @ts-expect-error
  await deleteItem(client, 'directus_users', arg2);
}
