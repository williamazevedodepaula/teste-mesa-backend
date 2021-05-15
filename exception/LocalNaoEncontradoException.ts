export class LocalNaoEncontradoException extends Error{
  constructor(){
    super("Local não cadastrado");
    (<any>this).statusCode = 400;
  }
}