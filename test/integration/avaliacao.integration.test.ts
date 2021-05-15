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

describe('Testes de Integração de Avaliacao', function () {

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

  it('Deve listar as avaliacoes',async function(){
    let accessToken = await login(usuarios[0].email, (<any>usuarios[0]).$plainPassword);
    const result = await supertest(app).get(`/api/avaliacoes`).set('Authorization',accessToken).expect(200);
    result.body.should.be.an('array').with.length(4);
  })

  it('Não Deve listar as avaliacoes se não estiver autenticado',async function(){
    await supertest(app).get(`/api/avaliacoes`).expect(401);
  })

  it('Deve buscar uma avaliacao',async function(){
    let accessToken = await login(usuarios[0].email, (<any>usuarios[0]).$plainPassword);
    const result = await supertest(app).get(`/api/avaliacoes/${avaliacoes[0].id}`).set('Authorization',accessToken).expect(200);
    result.body.should.have.property('id').that.equals(avaliacoes[0].id);
  })

  it('Não Deve buscar uma avaliacao se não estiver autenticado',async function(){
    await supertest(app).get(`/api/avaliacoes/${avaliacoes[0].id}`).expect(401);
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