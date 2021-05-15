'use strict';

import { Usuario } from "entity/Usuario";
import { Avaliacao } from "../../entity/Avaliacao";
import { LocalJaAvaliadoException } from "../../exception/LocalJaAvaliadoException";
import { LocalNaoEncontradoException } from "../../exception/LocalNaoEncontradoException";

const app = require('../../server/server');

module.exports = function (UsuarioService) {
console.log('----------->')
  UsuarioService.avaliarLocal = async (id,localId,avaliacao:Avaliacao) => {
    const LocalService = app.models.Local;
    const AvaliacaoService = app.models.Avaliacao;

    const local = await LocalService.findById(localId);
    if(!local) throw new LocalNaoEncontradoException;

    const avaliacaoAnterior = await AvaliacaoService.findOne({where:{usuarioId:id,localId:id}});
    if (avaliacaoAnterior)  throw new LocalJaAvaliadoException;

    return AvaliacaoService.create(<Avaliacao>{
      comentario:avaliacao.comentario,
      nota:avaliacao.nota,
      usuarioId:id,
      localId:localId
    })
  }
  UsuarioService.remoteMethod('avaliarLocal', {
    description: 'Register a new rating for a Local instance',
    accepts: [
      {
        arg: 'id',
        type: 'number',
        description: 'Id do usuário que realizará a avaliação'
      },
      {
        arg: 'localId',
        type: 'number',
        description: 'Id do local a ser avaliado'
      },
      {
        arg: 'avaliacao',
        type: 'Avaliacao',
        description: 'Avaliacao a ser registrada',
        http:{
          source:'body'
        }
      }
    ],
    returns: {
      arg: 'data',
      type: 'Avaliacao',
      root: true
    },
    http: { verb: 'post', path: '/:id/local/:localId/avaliar' }
  })
};
