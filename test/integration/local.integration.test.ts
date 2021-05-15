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

describe('Testes de Integração de Local', function () {
  
  let locais: Local[];
  let usuarios: Usuario[];
  let avaliacoes: Avaliacao[];

  before('Verifica se está no ambiente de teste, para evitar limpar o banco', function () {
    if (process.env.NODE_ENV != 'test') {
      throw Error("Testes de integração devem ser executados apenas em ambiente de TESTE, para evitar limpeza indesejada do banco de dados");
    }
  })

  beforeEach('Configura o banco de dados para testes', async function () {
    let testDb: TestDatabaseResult = await SetupTestDatabase(app);
    locais = testDb.locais;
    usuarios = testDb.usuarios;
    avaliacoes = testDb.avaliacoes;
  })

  it('Deve listar os locais, na forma de lista, ordenado por nome', async function () {
    let accessToken = await login(usuarios[0].email, (<any>usuarios[0]).$plainPassword);
    const result = await supertest(app).get(`/api/locais`).set('Authorization',accessToken).expect(200);
    result.body[0].should.have.property('id').that.equals(3);
    result.body[1].should.have.property('id').that.equals(4);
    result.body[2].should.have.property('id').that.equals(1);
    result.body[3].should.have.property('id').that.equals(2);
  })

  it('Deve listar os locais, na forma de map, ordenado por proximidade', async function () {
    let accessToken = await login(usuarios[0].email, (<any>usuarios[0]).$plainPassword);
    const lat = -19.9780676;
    const long = -44.0406794;
    const result = await supertest(app).get(`/api/locais/lat/${lat}/long/${long}/map`).set('Authorization',accessToken).expect(200);
    result.body[0].should.have.property('id').that.equals(3);
    result.body[1].should.have.property('id').that.equals(1);
    result.body[2].should.have.property('id').that.equals(2);
    result.body[3].should.have.property('id').that.equals(4);
  })
  
  it('Não deve listar os locais para usuário não autenticado', async function () {
    const lat = -19.9780676;
    const long = -44.0406794;
    await supertest(app).get(`/api/locais`).expect(401);
    await supertest(app).get(`/api/locais/lat/${lat}/long/${long}/map`).expect(401);
  })

  it('Deve listar as avaliacoes de um local', async function () {
    let accessToken = await login(usuarios[0].email, (<any>usuarios[0]).$plainPassword);
    const result = await supertest(app).get(`/api/locais/${locais[0].id}/avaliacoes`).set('Authorization',accessToken).expect(200);
    result.body.should.be.an('array').with.length(2);
    result.body[0].id.should.equal(1);
    result.body[1].id.should.equal(3);
  })


  async function login(email: string, password: string) {
    let result = await supertest(app).post(`/api/usuarios/login`).send(<Usuario>{
      email: email,
      password: password
    }).expect(200);
    result.body.should.have.property('id');
    return result.body.id;
  }
})