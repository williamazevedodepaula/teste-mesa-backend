'use strict';

import { Local } from "entity/Local";

module.exports = function (LocalService) {


  LocalService.listar = async () => {
    return LocalService.find({order:'nome ASC'});
  }
  LocalService.remoteMethod('listar', {
    description: 'Find all instances of the model from the data source, sorter by name.',
    accepts: [

    ],
    returns: {
      arg: 'data',
      type: ['Local'],
      root: true
    },
    http: { verb: 'get', path: '/' }
  })
  
  
  LocalService.listarMapa = async (lat: number, long: number) => {
    return (await LocalService.find()).sort((local1: Local, local2: Local) => {
      const dist1 = distance(local1.latitude, local1.longitude, lat, long);
      const dist2 = distance(local2.latitude, local2.longitude, lat, long);
      (<any>local1).$dist = dist1;
      (<any>local2).$dist = dist2;
      return dist1 < dist2 ? -1 : (dist1 > dist2) ? 1 : 0;
    });
  }
  LocalService.remoteMethod('listarMapa', {
    description: 'Find all instances of the model from the data source, sorter by proximity.',
    accepts: [
      {
        arg: 'lat',
        type: 'number',
        description: 'Latitude atual'
      },
      {
        arg: 'long',
        type: 'number',
        description: 'Longitude atual'
      }
    ],
    returns: {
      arg: 'data',
      type: ['Local'],
      root: true
    },
    http: { verb: 'get', path: '/lat/:lat/long/:long/map' }
  })


  /**
   * Utiliza a formula de Haversine para calcular a distancia entre duas coordenadas
   * @param lat1 latitude 1
   * @param lon1 logintude 1
   * @param lat2 latitude 2
   * @param lon2 longitude 2
   */
  function distance(lat1, lon1, lat2, lon2) {
    var radlat1 = Math.PI * lat1 / 180
    var radlat2 = Math.PI * lat2 / 180
    var theta = lon1 - lon2
    var radtheta = Math.PI * theta / 180
    var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    dist = Math.acos(dist)
    dist = dist * 180 / Math.PI
    dist = dist * 60 * 1.1515

    //Converte para Km, embora essa informação não seja necessáriamente relevante
    return dist * 1.609344
  }
};
