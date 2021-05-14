'use strict';

import { Local } from "entity/Local";
import { ModoDeConsultaInvalido } from "../../exception/ModoDeConsultaInvalido";

module.exports = function (LocalService) {

  LocalService.listar = async (mode: string = 'LIST') => {
    mode = mode.toUpperCase();
    if (!['LIST', 'MAP'].includes(mode)) {
      throw new ModoDeConsultaInvalido;
    }

    if(mode=='LIST') return LocalService.find({order:'nome ASC'});
  }
  LocalService.remoteMethod('listar', {
    description: 'Find all instances of the model matched by filter from the data source.',
    accepts: [
      {
        arg: 'mode',
        type: 'string',
        description: 'LIST or MAP: Define o tipo de listagem a ser utilizada. Se omitido, será considerada listagem em LISTA'
      }
    ],
    returns: {
      arg: 'data',
      type: 'Local',
      root: true
    },
    http: { verb: 'get', path: '/' }
  })
};
