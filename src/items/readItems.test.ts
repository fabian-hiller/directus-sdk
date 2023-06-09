import { afterEach, describe, expect, test } from 'vitest';
import { getAdminClient } from '../clients';
import { createItem } from './createItem';
import { deleteItems } from './deleteItems';
import { createItems } from './createItems';
import { readItems } from './readItems';

// Create admin client
const adminClient = getAdminClient({
  url: process.env.PUBLIC_URL!,
  staticToken: process.env.ADMIN_STATIC_TOKEN!,
});

// Test `readItems` function
describe('readItems', () => {
  test('should read items by key', async () => {
    const items1 = await createItems(adminClient, 'directus_users', [
      {
        first_name: 'Jane',
        last_name: 'Doe',
      },
      {
        first_name: 'John',
        last_name: 'Doe',
      },
    ]);
    const items2 = await readItems(
      adminClient,
      'directus_users',
      items1.map((item) => item.id)
    );
    expect(items2).toHaveLength(2);
    expect(items2.map((item) => item.first_name)).toContain('Jane');
    expect(items2.map((item) => item.first_name)).toContain('John');
    expect(items2.map((item) => item.last_name)).toMatchObject(['Doe', 'Doe']);
  });

  test('should read items by query', async () => {
    await createItems(adminClient, 'directus_users', [
      {
        first_name: 'Jane',
        last_name: 'Doe',
      },
      {
        first_name: 'John',
        last_name: 'Doe',
      },
    ]);
    const [items] = await readItems(adminClient, 'directus_users', {
      filter: {
        last_name: {
          _eq: 'Doe',
        },
      },
    });
    expect(items).toHaveLength(2);
    expect(items.map((item) => item.first_name)).toContain('Jane');
    expect(items.map((item) => item.first_name)).toContain('John');
    expect(items.map((item) => item.last_name)).toMatchObject(['Doe', 'Doe']);
  });

  test('should read items with sorting asc', async () => {
    await createItems(adminClient, 'directus_users', [
      {
        first_name: 'John',
        last_name: 'Doe',
      },
      {
        first_name: 'Jane',
        last_name: 'Doe',
      },
    ]);
    const [items] = await readItems(adminClient, 'directus_users', {
      filter: {
        last_name: {
          _eq: 'Doe',
        },
      },
      sort: {
        first_name: true,
      },
    });
    expect(items).toHaveLength(2);
    expect(items.map((item) => item.first_name)).toContain('Jane');
    expect(items.map((item) => item.first_name)).toContain('John');
    expect(items.map((item) => item.first_name)).toMatchObject([
      'Jane',
      'John',
    ]);
  });

  test('should read items with sorting desc', async () => {
    await createItems(adminClient, 'directus_users', [
      {
        first_name: 'Jane',
        last_name: 'Doe',
      },
      {
        first_name: 'John',
        last_name: 'Doe',
      },
    ]);
    const [items] = await readItems(adminClient, 'directus_users', {
      filter: {
        last_name: {
          _eq: 'Doe',
        },
      },
      sort: {
        '-first_name': true,
      },
    });
    expect(items).toHaveLength(2);
    expect(items.map((item) => item.first_name)).toContain('Jane');
    expect(items.map((item) => item.first_name)).toContain('John');
    expect(items.map((item) => item.first_name)).toMatchObject([
      'John',
      'Jane',
    ]);
  });

  test('should return only first name', async () => {
    const { id } = await createItem(adminClient, 'directus_users', {
      first_name: 'Jane',
      last_name: 'Doe',
    });
    const [item1] = await readItems(adminClient, 'directus_users', [id], {
      fields: {
        first_name: true,
      },
    });
    expect(item1.first_name).toBe('Jane');
    expect(item1).not.toHaveProperty('last_name');
    const [[item2]] = await readItems(adminClient, 'directus_users', {
      filter: {
        last_name: {
          _eq: 'Doe',
        },
      },
      fields: {
        first_name: true,
      },
    });
    expect(item2.first_name).toBe('Jane');
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
