import statusCode from './statusCode';

class conflictError extends Error {
  public statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = statusCode.CONFLICT;
  }
}
export default conflictError;
