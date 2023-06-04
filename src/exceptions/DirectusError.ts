/**
 * Value type of a sub error.
 */
export type SubError = {
  message: string;
  extensions: {
    code: string;
    field?: string;
  };
};

/**
 * Value type of the error data.
 */
export type ErrorData = {
  errors: SubError[];
};

/**
 * A Directus error with useful information.
 */
export class DirectusError extends Error {
  public readonly name = 'DirectusError';
  public readonly code: string;
  public readonly field: string | undefined;
  public readonly errors: SubError[];

  /**
   * Creates a Directus error with useful information.
   *
   * @param data The error data.
   */
  constructor(data: ErrorData) {
    const error = data.errors[0];
    super(error?.message || 'An unknown error has occurred.');
    this.code = error?.extensions?.code || 'UNKNOWN';
    this.field = error?.extensions?.field;
    this.errors = data.errors;
  }
}
