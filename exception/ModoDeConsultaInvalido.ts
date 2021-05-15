export class ModoDeConsultaInvalido extends Error{
  constructor(){
    super("Modo de consulta inválido. Por favor, informe LIST ou MAP");
    (<any>this).statusCode = 400;
  }
}