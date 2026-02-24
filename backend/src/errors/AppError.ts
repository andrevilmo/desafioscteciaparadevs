export class AppError extends Error {
  public statusCode: number;

  constructor(message: string, statusCode: number = 500) {
    super(message);
    this.statusCode = statusCode;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = 'Recurso não encontrado') {
    super(message, 404);
  }
}

export class ValidationError extends AppError {
  constructor(message: string = 'Erro de validação') {
    super(message, 400);
  }
}

export class ConflictError extends AppError {
  constructor(message: string = 'Conflito de recursos') {
    super(message, 409);
  }
}
