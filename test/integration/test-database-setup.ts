import * as chai from 'chai';
import { Local } from "../../entity/Local";
import { Usuario } from "../../entity/Usuario";
const should = chai.should();

export interface TestDatabaseResult {
  locais: Local[],
  usuarios: Usuario[]
}

export async function SetupTestDatabase(app: any): Promise<TestDatabaseResult> {
  if (process.env.NODE_ENV != 'test') {
    throw Error("Testes de integração devem ser executados apenas em ambiente de TESTE, para evitar limpeza indesejada do banco de dados");
  }

  const LocalModel = app.models.Local;
  const UsuarioModel = app.models.Usuario;

  //Recria o banco, realizando drop de todas as tabelas
  await app.dataSources.db.automigrate('Local');
  await app.dataSources.db.automigrate('Usuario');
  await app.dataSources.db.autoupdate();

  let locais: Local[] = await SetupLocais();
  let usuarios: Usuario[] = await SetupUsuarios();

  return {
    usuarios: usuarios,
    locais: locais,
  }


  async function SetupLocais(): Promise<Local[]> {
    let firstLocation: Local;
    let secondLocation: Local;

    firstLocation = await LocalModel.create(<Partial<Local>>{
      nome: 'Café Nice',
      endereco: 'Praça sete de setembro, centro, Belo Horizonte, MG',
      latitude: 111111111111,
      longitude: -111111111111
    });
    firstLocation.should.have.property('id').that.equals(1);


    secondLocation = await UsuarioModel.create(<Partial<Local>>{
      nome: 'Igreja Sao Jose do Operario',
      endereco: 'Praça Sao Jose do Operario, Industrial, Contagem, MG',
      latitude: 22222222222,
      longitude: -22222222222
    });
    secondLocation.should.have.property('id').that.equals(2);

    return [firstLocation, secondLocation];
  }
  async function SetupUsuarios(): Promise<Usuario[]> {
    let firstUsuario: Usuario;
    let secondUsuario: Usuario;

    firstUsuario = await LocalModel.create(<Partial<Usuario>>{
      username: 'usuario_1',
      email: 'usuario_1@teste.com',
      password: 'teste123'
    });
    firstUsuario.should.have.property('id').that.equals(1);


    secondUsuario = await UsuarioModel.create(<Partial<Usuario>>{
      username: 'usuario_2',
      email: 'usuario_2@teste.com',
      password: 'teste321'
    });
    secondUsuario.should.have.property('id').that.equals(2);

    return [firstUsuario, secondUsuario];
  }
}