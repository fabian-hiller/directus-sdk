import { afterEach, describe, expect, test } from 'vitest';
import { getAdminClient } from '../clients';
import { createItems } from './createItems';
import { deleteItems } from './deleteItems';

// Create admin client
const adminClient = getAdminClient({
  url: process.env.PUBLIC_URL!,
  staticToken: process.env.ADMIN_STATIC_TOKEN!,
});

// Test `createItemss` function
describe('createItems', () => {
  test('should create items with data', async () => {
    const items = await createItems(adminClient, 'directus_users', [
      {
        first_name: 'Jane',
        last_name: 'Doe',
      },
      {
        first_name: 'John',
        last_name: 'Doe',
      },
    ]);
    expect(items).toHaveLength(2);
    expect(items.map((item) => item.first_name)).toContain('Jane');
    expect(items.map((item) => item.first_name)).toContain('John');
    expect(items.map((item) => item.last_name)).toMatchObject(['Doe', 'Doe']);
  });

  test('should return only first name', async () => {
    const items = await createItems(
      adminClient,
      'directus_users',
      [
        {
          first_name: 'Jane',
          last_name: 'Doe',
        },
        {
          first_name: 'John',
          last_name: 'Doe',
        },
      ],
      {
        fields: {
          first_name: true,
        },
      }
    );
    expect(items.map((item) => item.first_name)).toContain('Jane');
    expect(items.map((item) => item.first_name)).toContain('John');
    expect(items[0]).not.toHaveProperty('last_name');
    expect(items[1]).not.toHaveProperty('last_name');
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
