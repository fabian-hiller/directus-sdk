import { deleteItems } from '../items';
import type {
  Client,
  Collections,
  ItemKey,
  GetItem,
  ItemsQuery,
} from '../types';

/**
 * Deletes multiple users by their primary key.
 *
 * @param client The client.
 * @param keys The primary keys.
 *
 * @returns The users.
 */
export async function deleteUsers<TCollections extends Collections>(
  client: Client<TCollections>,
  keys: ItemKey[]
): Promise<void>;

/**
 * Deletes multiple users by a query.
 *
 * @param client The client.
 * @param query The query.
 *
 * @returns The query tuple.
 */
export async function deleteUsers<
  TCollections extends Collections,
  TItem extends GetItem<TCollections, 'directus_users'>,
  TQuery extends Omit<ItemsQuery<TItem>, 'fields'>
>(client: Client<TCollections>, query: TQuery): Promise<void>;

export async function deleteUsers<
  TCollections extends Collections,
  TItem extends GetItem<TCollections, 'directus_users'>,
  TQuery extends Omit<ItemsQuery<TItem>, 'fields'>
>(client: Client<TCollections>, arg3: ItemKey[] | TQuery): Promise<void> {
  // @ts-expect-error
  await deleteItems(client, 'directus_users', arg3);
}
