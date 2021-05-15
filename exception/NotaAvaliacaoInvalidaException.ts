export class NotaAvaliacaoInvalidaException extends Error{
  constructor(){    
    super("Avaliação deve ser um valor entre 0 e 10");
    (<any>this).statusCode = 400;
  }
}