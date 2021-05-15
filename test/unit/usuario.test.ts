'use strict'

import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
chai.use(chaiAsPromised);
import { Avaliacao } from '../../entity/Avaliacao';
import { Usuario } from '../../entity/Usuario';
const should = chai.should();
const expect = chai.expect;
const assert = chai.assert;
import * as sinon from 'sinon';
import { Local } from '../../entity/Local';
import { CreateServiceMock } from './ServiceMock';
import { LocalNaoEncontradoException } from '../../exception/LocalNaoEncontradoException';
import { LocalJaAvaliadoException } from '../../exception/LocalJaAvaliadoException';

const UsuarioServiceFactory = require('../../server/models/usuario.ts');
const LocalServiceFactory = require('../../server/models/local.ts');
const AvaliacaoServiceFactory = require('../../server/models/avaliacao.ts');

describe('Testes Unitários de Usuario', function () {

  describe('testes do Entity', function () {
    it('Deve criar um Usuario', async function () {
      let usuario: Usuario = new Usuario(undefined);
      expect(usuario).to.exist;
    })

    it('Deve criar uma usuario à partir de um JSON', async function () {
      let usuario: Usuario = new Usuario({
        id: 1,
        username: 'william',
        email: 'williamazevedodepaula@hotmail.com',
        password: '1234eE'
      });
      usuario.should.have.property('id').that.equals(1);
      usuario.should.have.property('username').that.equals('william');
      usuario.should.have.property('email').that.equals('williamazevedodepaula@hotmail.com');
      usuario.should.have.property('password').that.equals('1234eE');
    })

    describe('Testes do Model Loopback (Services)', function () {
      let app: any;
      let LocalService: any;
      let UsuarioService: any;
      let AvaliacaoService: any;

      const local: Partial<Local> = { id: 1, nome: 'perto de casa', latitude: -19.979960698224904, longitude: -44.036929657309685, endereco: 'Avenida tiradentes, Industrial, Contagem' };
      const avaliacao: Partial<Avaliacao> = { id: 1, nota: 10, comentario: 'Otimo lugar' };

      before('realiza o stup e mock dos services e do app', function () {
        let app = { models: {} };
        LocalService = CreateServiceMock(app);
        UsuarioService = CreateServiceMock(app);
        AvaliacaoService = CreateServiceMock(app);
        app.models = { Local: LocalService, Usuario: UsuarioService, Avaliacao: AvaliacaoService };
        UsuarioServiceFactory(UsuarioService);
        LocalServiceFactory(LocalService);
        AvaliacaoServiceFactory(AvaliacaoService);
      })
      afterEach('realiza o stup e mock do Model', function () {
        sinon.restore();
      })

      it('Deve registrar uma avaliacao para um local', async function () {
        sinon.stub(LocalService, "findById").resolves(local);
        sinon.stub(AvaliacaoService, "findOne").resolves(undefined);
        sinon.stub(AvaliacaoService, "create").resolves(undefined);
        await UsuarioService.avaliarLocal(2, 3, <Partial<Avaliacao>>{
          comentario: 'Excelente local',
          nota: 10
        })
        assert(AvaliacaoService.create.calledOnceWith({
          comentario: 'Excelente local',
          nota: 10,
          usuarioId: 2,
          localId: 3
        }))
      })

      it('Deve retornar erro se o local não existir', async function () {
        sinon.stub(LocalService, "findById").resolves(undefined);
        await UsuarioService.avaliarLocal(2, 3, <Partial<Avaliacao>>{
          comentario: 'Excelente local',
          nota: 10
        }).should.eventually.be.rejectedWith(LocalNaoEncontradoException).and.to.include({statusCode:400});
      })

      it('Deve retornar erro se o local ja tiver sido avaliado', async function () {
        sinon.stub(LocalService, "findById").resolves(local);
        sinon.stub(AvaliacaoService, "findOne").resolves(avaliacao);
        await UsuarioService.avaliarLocal(2, 3, <Partial<Avaliacao>>{
          comentario: 'Excelente local',
          nota: 10
        }).should.eventually.be.rejectedWith(LocalJaAvaliadoException).and.to.include({statusCode:400});
      })

    })
  })
})