export class DuplicateError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "DuplicateError";
  }
}

export class NoResponseError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "NotResponseError";
  }
}
