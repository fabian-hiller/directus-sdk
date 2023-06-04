import { afterEach, describe, expect, test } from 'vitest';
import { getAdminClient } from '../clients';
import { createItem } from './createItem';
import { deleteItems } from './deleteItems';
import { readItem } from './readItem';

// Create admin client
const adminClient = getAdminClient({
  url: process.env.PUBLIC_URL!,
  staticToken: process.env.ADMIN_STATIC_TOKEN!,
});

// Test `readItem` function
describe('readItem', () => {
  test('should read item by key', async () => {
    const { id } = await createItem(adminClient, 'directus_users', {
      first_name: 'Jane',
      last_name: 'Doe',
    });
    const item = await readItem(adminClient, 'directus_users', id);
    expect(item.first_name).toBe('Jane');
    expect(item.last_name).toBe('Doe');
  });

  test('should read item by query', async () => {
    await createItem(adminClient, 'directus_users', {
      first_name: 'Jane',
      last_name: 'Doe',
    });
    const item1 = await readItem(adminClient, 'directus_users', {
      filter: {
        last_name: {
          _eq: 'Doe',
        },
      },
    });
    expect(item1).not.toBeNull();
    expect(item1!.first_name).toBe('Jane');
    expect(item1!.last_name).toBe('Doe');
    const item2 = await readItem(adminClient, 'directus_users', {
      filter: {
        last_name: {
          _eq: 'abcd',
        },
      },
    });
    expect(item2).toBeNull();
  });

  test('should return only first name', async () => {
    const { id } = await createItem(adminClient, 'directus_users', {
      first_name: 'Jane',
      last_name: 'Doe',
    });
    const item1 = await readItem(adminClient, 'directus_users', id, {
      fields: {
        first_name: true,
      },
    });
    expect(item1.first_name).toBe('Jane');
    expect(item1).not.toHaveProperty('last_name');
    const item2 = await readItem(adminClient, 'directus_users', {
      filter: {
        last_name: {
          _eq: 'Doe',
        },
      },
      fields: {
        first_name: true,
      },
    });
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
