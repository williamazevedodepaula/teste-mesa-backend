'use strict'

import * as chai from 'chai';
import { Local } from '../../entity/Local';
import * as sinon from 'sinon'
const should = chai.should();
const expect = chai.expect;

const LocalServiceFactory = require('../../server/models/local.ts');

const locais:Partial<Local>[] = [
  {id:1,nome:'perto de casa',latitude:-19.979960698224904,longitude:-44.036929657309685,endereco:'Avenida tiradentes, Industrial, Contagem'},
  {id:2,nome:'Savassi',latitude:-19.934785809462117,longitude:-43.93067634470021,endereco:'Praça da savassi, Belo Horizonte'},
  {id:3,nome:'Casa',latitude:-19.9780676,longitude:-44.0406794,endereco:'Avenida cel. Benjamin guimaraes, 332, fundos'},
  {id:4,nome:'Museu Historico Vespasiano',latitude:-19.46446270797849,longitude:-44.246931423539394,endereco:'Museu Historico Vespasiano'},
]

describe('Testes Unitários de Local', function () {
  
  describe('testes do Entity', function () {
    it('Deve criar um Local', async function () {
      let local: Local = new Local(undefined);
      expect(local).to.exist;
    })

    it('Deve criar um Local à partir de um JSON', async function () {
      let local: Local = new Local({
        id: 1,
        nome: 'Praça do Operario',
        endereco: 'Avenida Coronel Benjamin Guimaraes, 332',
        latitude: 111111111,
        longitude: -111111111
      });
      local.should.have.property('id').that.equals(1);
      local.should.have.property('nome').that.equals('Praça do Operario');
      local.should.have.property('endereco').that.equals('Avenida Coronel Benjamin Guimaraes, 332');
      local.should.have.property('latitude').that.equals(111111111);
      local.should.have.property('longitude').that.equals(-111111111);
    })

    describe('Testes do Model Loopback', function () {
      let LocalService:any;
      
      before('realiza o stup e mock do Model',function(){
        LocalService = {remoteMethod:()=>{},find:()=>{}};
        LocalServiceFactory(LocalService);
      })
      afterEach('realiza o stup e mock do Model',function(){
        LocalService.find.restore();
      })

      it('Deve listar locais no modo Mapa, ordenando por proximidade', async function () {
        sinon.stub(LocalService,"find").resolves(locais);
        const result = await LocalService.listarMapa(-19.9780676,-44.0406794);
        result[0].id.should.equal(3);
        result[1].id.should.equal(1);
        result[2].id.should.equal(2);
        result[3].id.should.equal(4);
      })

      it('Deve listar locais no modo Lista, solicitando ordenacao por nome', async function () {
        sinon.stub(LocalService,"find").withArgs({order:'nome ASC'}).resolves(locais);
        const result = await LocalService.listar(-19.9780676,-44.0406794);
        result.should.equal(locais);
      })
    })
  })
})