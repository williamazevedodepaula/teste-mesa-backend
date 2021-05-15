import * as chai from 'chai';
import { Avaliacao } from '../../entity/Avaliacao';
import { Local } from "../../entity/Local";
import { Usuario } from "../../entity/Usuario";
const should = chai.should();

export interface TestDatabaseResult {
  locais: Local[],
  usuarios: Usuario[],
  avaliacoes:Avaliacao[]
}

export async function SetupTestDatabase(app: any): Promise<TestDatabaseResult> {
  if (process.env.NODE_ENV != 'test') {
    throw Error("Testes de integração devem ser executados apenas em ambiente de TESTE, para evitar limpeza indesejada do banco de dados");
  }

  const LocalService = app.models.Local;
  const UsuarioService = app.models.Usuario;
  const AvaliacaoService = app.models.Avaliacao;

  //Recria o banco, realizando drop de todas as tabelas
  await app.dataSources.db.automigrate('Local');
  await app.dataSources.db.automigrate('Usuario');
  await app.dataSources.db.automigrate('Avaliacao');
  //await app.dataSources.db.automigrate('AccessToken');
  await app.dataSources.db.autoupdate();
  
  let usuarios: Usuario[] = await SetupUsuarios();
  let locais: Local[] = await SetupLocais();
  let avaliacoes: Avaliacao[] = await SetupAvaliacoes();

  return {
    usuarios: usuarios,
    locais: locais,
    avaliacoes: avaliacoes,
  }


  async function SetupLocais(): Promise<Local[]> {
    let firstLocation: Local;
    let secondLocation: Local;
    let thirdLocation: Local;
    let fourthLocation: Local;

    firstLocation = await LocalService.create(<Partial<Local>>{nome:'perto de casa',latitude:-19.979960698224904,longitude:-44.036929657309685,endereco:'Avenida tiradentes, Industrial, Contagem'});
    firstLocation.should.have.property('id').that.equals(1);

    secondLocation = await LocalService.create(<Partial<Local>>{nome:'Savassi',latitude:-19.934785809462117,longitude:-43.93067634470021,endereco:'Praça da savassi, Belo Horizonte'});
    secondLocation.should.have.property('id').that.equals(2);
    
    thirdLocation = await LocalService.create(<Partial<Local>>{nome:'Casa',latitude:-19.9780676,longitude:-44.0406794,endereco:'Avenida cel. Benjamin guimaraes, 332, fundos'});
    thirdLocation.should.have.property('id').that.equals(3);
    
    fourthLocation = await LocalService.create(<Partial<Local>>{nome:'Museu Historico Vespasiano',latitude:-19.46446270797849,longitude:-44.246931423539394,endereco:'Museu Historico Vespasiano'});
    fourthLocation.should.have.property('id').that.equals(4);

    return [firstLocation, secondLocation, thirdLocation, fourthLocation];
  }
  async function SetupUsuarios(): Promise<Usuario[]> {
    let firstUsuario: Usuario;
    let secondUsuario: Usuario;

    const firstUsuarioPlainPassword = 'teste123';
    firstUsuario = await UsuarioService.create(<Partial<Usuario>>{
      username: 'usuario_1',
      email: 'usuario_1@teste.com',
      password: 'teste123'
    });
    firstUsuario.should.have.property('id').that.equals(1);
    (<any>firstUsuario).$plainPassword = firstUsuarioPlainPassword;


    const secondUsuarioPlainPassword = 'teste321';
    secondUsuario = await UsuarioService.create(<Partial<Usuario>>{
      username: 'usuario_2',
      email: 'usuario_2@teste.com',
      password: 'teste321'
    });
    secondUsuario.should.have.property('id').that.equals(2);
    (<any>secondUsuario).$plainPassword = secondUsuarioPlainPassword;

    return [firstUsuario, secondUsuario];
  }
  async function SetupAvaliacoes(): Promise<Avaliacao[]> {
    let avaliacao1: Avaliacao;
    let avaliacao2: Avaliacao;
    let avaliacao3: Avaliacao;
    let avaliacao4: Avaliacao;

    avaliacao1 = await AvaliacaoService.create(<Partial<Avaliacao>>{
      comentario:'avaliacao 1',
      nota:1,
      usuarioId:1,
      localId:1
    });
    avaliacao1.should.have.property('id').that.equals(1);

    avaliacao2 = await AvaliacaoService.create(<Partial<Avaliacao>>{
      comentario:'avaliacao 2',
      nota:2,
      usuarioId:1,
      localId:2
    });
    avaliacao2.should.have.property('id').that.equals(2);

    avaliacao3 = await AvaliacaoService.create(<Partial<Avaliacao>>{
      comentario:'avaliacao 3',
      nota:3,
      usuarioId:2,
      localId:1
    });
    avaliacao3.should.have.property('id').that.equals(3);

    avaliacao4 = await AvaliacaoService.create(<Partial<Avaliacao>>{
      comentario:'avaliacao 4',
      nota:4,
      usuarioId:2,
      localId:2
    });
    avaliacao4.should.have.property('id').that.equals(4);

    return [avaliacao1,avaliacao2,avaliacao3,avaliacao4];
  }
}