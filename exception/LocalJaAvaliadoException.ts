export class LocalJaAvaliadoException extends Error{
  constructor(){    
    super("Local já avaliado pelo usuário");
    (<any>this).statusCode = 400;
  }
}