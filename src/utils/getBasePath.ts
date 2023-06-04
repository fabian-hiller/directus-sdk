/**
 * Returns the API base path of a collection.
 *
 * @param collection The collection name.
 *
 * @returns The base path.
 */
export function getBasePath(collection: string) {
  return collection.startsWith('directus_')
    ? `/${collection.substring(9)}`
    : `/items/${collection}`;
}
