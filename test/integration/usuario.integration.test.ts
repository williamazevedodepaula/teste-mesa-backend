import * as supertest from 'supertest'
import * as chai from 'chai';
import * as moment from 'moment';
import { SetupTestDatabase, TestDatabaseResult } from "./test-database-setup";
import { Local } from '../../entity/Local';
import { Usuario } from '../../entity/Usuario';
import { Avaliacao } from '../../entity/Avaliacao';
const expect = chai.expect;
const should = chai.should();
const assert = chai.assert;

const app = require('../../server/server');
const OrderModel = app.models.Pedido;
const OrderItemModel = app.models.ItemPedido;
const ClientModel = app.models.Cliente;

describe('Testes de Integração de Usuario', function () {
  before('Verifica se está no ambiente de teste, para evitar limpar o banco', function () {
    if (process.env.NODE_ENV != 'test') {
      throw Error("Testes de integração devem ser executados apenas em ambiente de TESTE, para evitar limpeza indesejada do banco de dados");
    }
  })

  let locais: Local[];
  let usuarios: Usuario[];

  beforeEach('Configura o banco de dados para testes', async function () {
    let testDb: TestDatabaseResult = await SetupTestDatabase(app);
    locais = testDb.locais;
    usuarios = testDb.usuarios;
  })

  it('Deve cadastrar um usuario pela API', async function () {
    let result = await supertest(app).post(`/api/usuarios`).send(<Usuario>{
      username: "teste@teste.com",
      email: "teste@teste.com",
      password: "1234eE"
    }).expect(200);
  })

  it('Deve fazer login', async function () {
    let result = await supertest(app).post(`/api/usuarios/login`).send(<Usuario>{
      email: usuarios[0].email,
      password: (<any>usuarios[0]).$plainPassword
    }).expect(200);
    result.body.should.have.property('id');
  })

  it('Login deve falhar se a senha errada for informada', async function () {
    let result = await supertest(app).post(`/api/usuarios/login`).send(<Usuario>{
      email: usuarios[0].email,
      password: 'senha errada'
    }).expect(401);
  })

  it('Deve alterar os dados do usuario', async function () {
    let accessToken = await login(usuarios[0].email, (<any>usuarios[0]).$plainPassword);

    let result = await supertest(app)
      .patch(`/api/usuarios/${usuarios[0].id}`)
      .set('Authorization', accessToken)
      .send(<Usuario>{
        username: "novo nome",
        email: "novoemail@teste.com",
        password: "nova senha"
      })
      .expect(200);

    result.body.should.have.property('id').that.equals(usuarios[0].id);
    result.body.should.have.property('email').that.equals('novoemail@teste.com');
    result.body.should.have.property('username').that.equals('novo nome');
    await login("novoemail@teste.com", "nova senha").should.not.eventually.be.rejected;
  })

  it('usuário não pode editar dados de outro usuário', async function () {
    let accessToken = await login(usuarios[1].email, (<any>usuarios[1]).$plainPassword);

    await supertest(app)
      .patch(`/api/usuarios/${usuarios[0].id}`)
      .set('Authorization', accessToken)
      .send(<Usuario>{
        username: "novo nome",
        email: "novoemail@teste.com",
        password: "nova senha"
      })
      .expect(401);
  })

  it('usuario deve consultar seus dados', async function () {
    let accessToken = await login(usuarios[0].email, (<any>usuarios[0]).$plainPassword);

    let result = await supertest(app)
      .get(`/api/usuarios/${usuarios[0].id}`)
      .set('Authorization', accessToken)
      .expect(200);

    result.body.should.have.property('id').that.equals(usuarios[0].id);
    result.body.should.have.property('email').that.equals(usuarios[0].email);
    result.body.should.have.property('username').that.equals(usuarios[0].username);
  })

  it('usuário não pode consultar dados de outro usuário', async function () {
    let accessToken = await login(usuarios[1].email, (<any>usuarios[1]).$plainPassword);

    await supertest(app)
      .get(`/api/usuarios/${usuarios[0].id}`)
      .set('Authorization', accessToken)
      .expect(401);
  })

  it('usuário pode cadastrar seus locais', async function () {
    let accessToken = await login(usuarios[0].email, (<any>usuarios[0]).$plainPassword);

    await supertest(app)
      .post(`/api/usuarios/${usuarios[0].id}/locais`)
      .set('Authorization', accessToken)
      .send(<Local>
        { nome: 'Museu Historico Vespasiano', latitude: -19.46446270797849, longitude: -44.246931423539394, endereco: 'Museu Historico Vespasiano' }
      )
      .expect(200);
  })

  it('usuário não pode cadastrar locais para outro usuário', async function () {
    let accessToken = await login(usuarios[0].email, (<any>usuarios[0]).$plainPassword);

    await supertest(app)
      .post(`/api/usuarios/${usuarios[1].id}/locais`)
      .set('Authorization', accessToken)
      .send(<Local>
        { nome: 'Museu Historico Vespasiano', latitude: -19.46446270797849, longitude: -44.246931423539394, endereco: 'Museu Historico Vespasiano' }
      )
      .expect(401);
  })

  it('usuário pode avaliar qualquer local', async function () {
    await app.dataSources.db.automigrate('Avaliacao');//Apaga avaliacoes existentes

    let accessToken = await login(usuarios[0].email, (<any>usuarios[0]).$plainPassword);

    await supertest(app)
      .post(`/api/usuarios/${usuarios[0].id}/local/${locais[0].id}/avaliar`)
      .set('Authorization', accessToken)
      .send(<Avaliacao>
        { comentario: 'Otimo lugar', nota: 10 }
      )
      .expect(200);

    await supertest(app)
      .post(`/api/usuarios/${usuarios[0].id}/local/${locais[1].id}/avaliar`)
      .set('Authorization', accessToken)
      .send(<Avaliacao>
        { comentario: 'Otimo lugar', nota: 10 }
      )
      .expect(200);
  })

  it('usuário não autenticado não avaliar nenhum local', async function () {
    await supertest(app)
      .post(`/api/usuarios/${usuarios[0].id}/local/${locais[0].id}/avaliar`)
      .send(<Avaliacao>
        { comentario: 'Otimo lugar', nota: 10 }
      )
      .expect(401);
  })

  it('usuário não pode avaliar um local se passando por outro usuario', async function () {
    let accessToken = await login(usuarios[0].email, (<any>usuarios[0]).$plainPassword);

    await supertest(app)
      .post(`/api/usuarios/${usuarios[1].id}/local/${locais[0].id}/avaliar`)
      .set('Authorization', accessToken)
      .send(<Avaliacao>
        { comentario: 'Otimo lugar', nota: 10 }
      )
      .expect(401);
  })

  it('usuário deve fazer logout', async function () {
    let accessToken = await login(usuarios[0].email, (<any>usuarios[0]).$plainPassword);

    await supertest(app)
      .post(`/api/usuarios/logout`)
      .set('Authorization', accessToken)
      .expect(204);
  })


  async function login(email: string, password: string) {
    let result = await supertest(app).post(`/api/usuarios/login`).send(<Usuario>{
      email: email,
      password: password
    }).expect(200);
    result.body.should.have.property('id');
    return result.body.id;
  }

});