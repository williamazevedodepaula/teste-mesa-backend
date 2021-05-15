'use strict'

import * as chai from 'chai';
import { Avaliacao } from '../../entity/Avaliacao';
const should = chai.should();
const expect = chai.expect;

describe('Testes Unitários de Avaliacao', function () {

  describe('testes do Entity', function () {
    it('Deve criar uma Avaliacao', async function () {
      let avaliacao: Avaliacao = new Avaliacao(undefined);
      expect(avaliacao).to.exist;
    })

    it('Deve criar uma Avaliacao à partir de um JSON', async function () {
      let avaliacao: Avaliacao = new Avaliacao({
        id: 1,
        comentario:'Exelente local',
        nota:10
      });
      avaliacao.should.have.property('id').that.equals(1);
      avaliacao.should.have.property('comentario').that.equals('Exelente local');
      avaliacao.should.have.property('nota').that.equals(10);
    })

  })
})