export class LocalNaoEncontradoException extends Error{
  constructor(){
    super("Local não cadastrado")
  }
}