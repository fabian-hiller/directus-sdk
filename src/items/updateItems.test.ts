import { afterEach, describe, expect, test } from 'vitest';
import { getAdminClient } from '../clients';
import { createItem } from './createItem';
import { deleteItems } from './deleteItems';
import { updateItems } from './updateItems';
import { createItems } from './createItems';

// Create admin client
const adminClient = getAdminClient({
  url: process.env.PUBLIC_URL!,
  staticToken: process.env.ADMIN_STATIC_TOKEN!,
});

// Test `updateItems` function
describe('updateItems', () => {
  test('should update items by key', async () => {
    const items1 = await createItems(adminClient, 'directus_users', [
      {
        first_name: 'Jane',
        last_name: 'Doe',
      },
      {
        first_name: 'Jane',
        last_name: 'Doe',
      },
    ]);
    const items2 = await updateItems(
      adminClient,
      'directus_users',
      items1.map((item) => item.id),
      { first_name: 'John' }
    );
    expect(items2).toHaveLength(2);
    expect(items2.map((item) => item.first_name)).toMatchObject([
      'John',
      'John',
    ]);
    expect(items2.map((item) => item.last_name)).toMatchObject(['Doe', 'Doe']);
  });

  test('should update items by query', async () => {
    await createItems(adminClient, 'directus_users', [
      {
        first_name: 'Jane',
        last_name: 'Doe',
      },
      {
        first_name: 'Jane',
        last_name: 'Doe',
      },
    ]);
    const [items] = await updateItems(
      adminClient,
      'directus_users',
      { first_name: 'John' },
      {
        filter: {
          last_name: {
            _eq: 'Doe',
          },
        },
      }
    );
    expect(items).toHaveLength(2);
    expect(items.map((item) => item.first_name)).toMatchObject([
      'John',
      'John',
    ]);
    expect(items.map((item) => item.last_name)).toMatchObject(['Doe', 'Doe']);
  });

  test('should update items in a batch', async () => {
    const items1 = await createItems(adminClient, 'directus_users', [
      {
        first_name: 'Jane',
        last_name: 'Doe',
      },
      {
        first_name: 'Jane',
        last_name: 'Doe',
      },
    ]);
    const items2 = await updateItems(
      adminClient,
      'directus_users',
      items1.map((item) => ({ id: item.id, first_name: 'John' }))
    );
    expect(items2).toHaveLength(2);
    expect(items2.map((item) => item.first_name)).toMatchObject([
      'John',
      'John',
    ]);
    expect(items2.map((item) => item.last_name)).toMatchObject(['Doe', 'Doe']);
  });

  test('should return only first name', async () => {
    const { id } = await createItem(adminClient, 'directus_users', {
      first_name: 'Jane',
      last_name: 'Doe',
    });
    const [item1] = await updateItems(
      adminClient,
      'directus_users',
      [id],
      { first_name: 'John' },
      {
        fields: {
          first_name: true,
        },
      }
    );
    expect(item1.first_name).toBe('John');
    expect(item1).not.toHaveProperty('last_name');
    const [[item2]] = await updateItems(
      adminClient,
      'directus_users',
      { first_name: 'John' },
      {
        filter: {
          last_name: {
            _eq: 'Doe',
          },
        },
        fields: {
          first_name: true,
        },
      }
    );
    expect(item2.first_name).toBe('John');
    expect(item2).not.toHaveProperty('last_name');
    const [item3] = await updateItems(
      adminClient,
      'directus_users',
      [{ id, first_name: 'John' }],
      {
        fields: {
          first_name: true,
        },
      }
    );
    expect(item3.first_name).toBe('John');
    expect(item3).not.toHaveProperty('last_name');
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
