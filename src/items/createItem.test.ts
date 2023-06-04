import { afterEach, describe, expect, test } from 'vitest';
import { getAdminClient } from '../clients';
import { createItem } from './createItem';
import { deleteItems } from './deleteItems';

// Create admin client
const adminClient = getAdminClient({
  url: process.env.PUBLIC_URL!,
  staticToken: process.env.ADMIN_STATIC_TOKEN!,
});

// Test `createItem` function
describe('createItem', () => {
  test('should create item with data', async () => {
    const item = await createItem(adminClient, 'directus_users', {
      first_name: 'Jane',
      last_name: 'Doe',
    });
    expect(item.first_name).toBe('Jane');
    expect(item.last_name).toBe('Doe');
  });

  test('should return only first name', async () => {
    const item = await createItem(
      adminClient,
      'directus_users',
      {
        first_name: 'Jane',
        last_name: 'Doe',
      },
      {
        fields: {
          first_name: true,
        },
      }
    );
    expect(item.first_name).toBe('Jane');
    expect(item).not.toHaveProperty('last_name');
  });
});

// Delete created items
afterEach(async () => {
  await deleteItems(adminClient, 'directus_users', {
    filter: {
      last_name: {
        _eq: 'Doe',
      },
    },
  });
});
