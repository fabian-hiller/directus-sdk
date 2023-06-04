import { afterEach, describe, expect, test } from 'vitest';
import { getAdminClient } from '../clients';
import type { DirectusUserItem, ItemQuery } from '../types';
import { createItems } from './createItems';
import { deleteItems } from './deleteItems';
import { readItems } from './readItems';

// Create admin client
const adminClient = getAdminClient({
  url: process.env.PUBLIC_URL!,
  staticToken: process.env.ADMIN_STATIC_TOKEN!,
});

// Test `deleteItems` function
describe('deleteItems', () => {
  test('should delete items by key', async () => {
    const items = await createItems(adminClient, 'directus_users', [
      { last_name: 'Doe' },
      { last_name: 'Doe' },
    ]);
    const itemIds = items.map((item) => item.id);
    await expect(
      deleteItems(adminClient, 'directus_users', itemIds)
    ).resolves.not.toThrowError();
    await expect(
      readItems(adminClient, 'directus_users', itemIds)
    ).rejects.toThrowError();
  });

  test('should delete items by query', async () => {
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
      deleteItems(adminClient, 'directus_users', query)
    ).resolves.not.toThrowError();
    const [items] = await readItems(adminClient, 'directus_users', query);
    expect(items).toHaveLength(0);
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
