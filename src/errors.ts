class NotFoundError extends Error {
  constructor(message: string) {
    super(message);
    // @ts-ignore
    this.statusCode = 404;
  }
}

module.exports = NotFoundError;
