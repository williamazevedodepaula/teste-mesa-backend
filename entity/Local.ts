import { BaseEntity } from './BaseEntity'
import { Usuario } from './Usuario'

/**
 * Representa um Local da aplicação
 */
export class Local extends BaseEntity<Local>{
    /**
     * ID do usuário. (PK)
     */
    id:number
    /**
     * Nome do local
     */
    nome:string
    /**
     * Endereço do local
     */
    endereco:string
    /**
     * latiutude do local
     */
    latitude:number
    /**
     * longitude do local
     */
    longitude:number
    /**
     * id do usuario dono do local
     */
    usuarioId:number
    /**
     * instancia do usuario dono do local
     */
    usuario?:Usuario
}