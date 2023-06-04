import { afterEach, describe, expect, test } from 'vitest';
import { getAdminClient } from '../clients';
import { createItem } from './createItem';
import { deleteItems } from './deleteItems';
import { updateItem } from './updateItem';

// Create admin client
const adminClient = getAdminClient({
  url: process.env.PUBLIC_URL!,
  staticToken: process.env.ADMIN_STATIC_TOKEN!,
});

// Test `updateItem` function
describe('updateItem', () => {
  test('should update item by key', async () => {
    const { id } = await createItem(adminClient, 'directus_users', {
      first_name: 'Jane',
      last_name: 'Doe',
    });
    const item = await updateItem(adminClient, 'directus_users', id, {
      first_name: 'John',
    });
    expect(item.first_name).toBe('John');
    expect(item.last_name).toBe('Doe');
  });

  test('should update item by query', async () => {
    await createItem(adminClient, 'directus_users', {
      first_name: 'Jane',
      last_name: 'Doe',
    });
    const item1 = await updateItem(
      adminClient,
      'directus_users',
      {
        first_name: 'John',
      },
      {
        filter: {
          last_name: {
            _eq: 'Doe',
          },
        },
      }
    );
    expect(item1).not.toBeNull();
    expect(item1!.first_name).toBe('John');
    expect(item1!.last_name).toBe('Doe');
    const item2 = await updateItem(
      adminClient,
      'directus_users',
      {
        first_name: 'John',
      },
      {
        filter: {
          last_name: {
            _eq: 'abcd',
          },
        },
      }
    );
    expect(item2).toBeNull();
  });

  test('should return only first name', async () => {
    const { id } = await createItem(adminClient, 'directus_users', {
      first_name: 'Jane',
      last_name: 'Doe',
    });
    const item1 = await updateItem(
      adminClient,
      'directus_users',
      id,
      {
        first_name: 'John',
      },
      {
        fields: {
          first_name: true,
        },
      }
    );
    expect(item1.first_name).toBe('John');
    expect(item1).not.toHaveProperty('last_name');
    const item2 = await updateItem(
      adminClient,
      'directus_users',
      {
        first_name: 'Jane',
      },
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
    expect(item2!.first_name).toBe('Jane');
    expect(item2).not.toHaveProperty('last_name');
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
