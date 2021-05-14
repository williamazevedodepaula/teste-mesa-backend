'use strict'

import * as chai from 'chai';
import { Local } from '../../entity/Local';
const should = chai.should();
const expect = chai.expect;

describe('Testes Unitários de Local',function(){

    it('Deve criar um Local',async function(){
        let local:Local = new Local(undefined);
        expect(local).to.exist;
    })

    it('Deve criar um Local à partir de um JSON',async function(){
        let local:Local = new Local({
            id:1,
            nome:'Praça do Operario',
            endereco:'Avenida Coronel Benjamin Guimaraes, 332',
            latitude:111111111,
            longitude:-111111111
        });
        local.should.have.property('id').that.equals(1);
        local.should.have.property('nome').that.equals('Praça do Operario');
        local.should.have.property('endereco').that.equals('Avenida Coronel Benjamin Guimaraes, 332');
        local.should.have.property('latitude').that.equals(111111111);
        local.should.have.property('longitude').that.equals(-111111111);
    })
})