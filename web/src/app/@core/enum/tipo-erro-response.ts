export enum ETipoErroResponse {
    Success = 0,
    NotFound = 1,
    ValidationError = 2,
    Unauthorized = 3,
  
    // Erros específicos de exclusão
    DeleteCascadeError = 1001,
    ForeignKeyConstraintViolation = 1002,
    DeleteFailedDueToDependencies = 1003
  }