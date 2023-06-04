/**
 * Returns the selected object paths as a comma-separated string.
 *
 * @param object The object.
 * @param action The action.
 *
 * @returns A comma-separated string.
 */
export function getObjectPaths<TObject extends Record<string, any>>(
  object: TObject,
  action: (
    list: string[],
    path: string,
    value: NonNullable<TObject[keyof TObject]>,
    self: (object: TObject, list: string[], prevPath?: string) => string[]
  ) => void
): string {
  const self = (object: TObject, list: string[], prevPath?: string) =>
    Object.entries(object).reduce((list, [path, value]) => {
      if (value) {
        action(list, prevPath ? `${prevPath}.${path}` : path, value, self);
      }
      return list;
    }, list);
  return self(object, []).join();
}
