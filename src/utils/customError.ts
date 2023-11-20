// eslint-disable-next-line camelcase
class CustomError extends Error {
  statusCode: number;

  constructor(code: number, message: string = '') {
    super(message);
    this.statusCode = code;
    this.parseCode();
  }

  private parseCode() {
    switch (this.statusCode) {
      case 400:
        this.name = 'BadRequestError';
        break;
      case 401:
        this.name = 'Unauthorized';
        break;
      case 403:
        this.name = 'Forbidden';
        break;
      case 404:
        this.name = 'NotFound';
        break;
      case 409:
        this.name = 'Conflict';
        break;
      default:
        this.name = 'DefaultError';
        this.statusCode = 500;
        this.message = 'На сервере произошла ошибка';
        break;
    }
  }
}

// eslint-disable-next-line camelcase
export default CustomError;
