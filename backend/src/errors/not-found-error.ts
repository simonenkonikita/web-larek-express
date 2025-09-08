import statusCode from './statusCode';

class notFoundError extends Error {
  public statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = statusCode.NOT_FOUND;
  }
}
export default notFoundError;
