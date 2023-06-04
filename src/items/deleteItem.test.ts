import { afterEach, describe, expect, test } from 'vitest';
import { getAdminClient } from '../clients';
import type { DirectusUserItem, ItemQuery } from '../types';
import { createItem } from './createItem';
import { createItems } from './createItems';
import { deleteItem } from './deleteItem';
import { deleteItems } from './deleteItems';
import { readItem } from './readItem';

// Create admin client
const adminClient = getAdminClient({
  url: process.env.PUBLIC_URL!,
  staticToken: process.env.ADMIN_STATIC_TOKEN!,
});

// Test `deleteItem` function
describe('deleteItem', () => {
  test('should delete item by key', async () => {
    const item = await createItem(adminClient, 'directus_users', {
      last_name: 'Doe',
    });
    await expect(
      deleteItem(adminClient, 'directus_users', item.id)
    ).resolves.not.toThrowError();
    await expect(
      readItem(adminClient, 'directus_users', item.id)
    ).rejects.toThrowError();
  });

  test('should delete item by query', async () => {
    await createItems(adminClient, 'directus_users', [
      { last_name: 'Doe' },
      { last_name: 'Doe' },
    ]);
    const query: Omit<ItemQuery<DirectusUserItem>, 'fields'> = {
      filter: {
        last_name: {
          _eq: 'Doe',
        },
      },
    };
    await expect(
      deleteItem(adminClient, 'directus_users', query)
    ).resolves.not.toThrowError();
    await expect(
      readItem(adminClient, 'directus_users', query)
    ).resolves.not.toBeNull();
    await expect(
      deleteItem(adminClient, 'directus_users', query)
    ).resolves.not.toThrowError();
    await expect(
      readItem(adminClient, 'directus_users', query)
    ).resolves.toBeNull();
  });
});

// Delete deleted items
afterEach(async () => {
  await deleteItems(adminClient, 'directus_users', {
    filter: {
      last_name: {
        _eq: 'Doe',
      },
    },
  });
});
