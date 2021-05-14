import { BaseEntity } from './BaseEntity'
import { Local } from './Local'
import { Usuario } from './Usuario'

/**
 * Representa uma Avalicao de um loca da aplicação
 */
export class Avaliacao extends BaseEntity<Avaliacao>{
    /**
     * ID do usuário. (PK)
     */
    id:number
    /**
     * comentário da avaliação
     */
    comentario:string
    /**
     * Nota, de 1 a 5
     */
    nota:number
    /**
     * id do usuário que realizou a avaiação
     */
    usuarioId:number
    /**
     * Instância do usuário que realizou a avaliação
     */
    usuario?:Usuario
    /**
     * ID do local avaliado
     */
    localId:number
    /**
     * Instância do local avaliado
     */
    local?:Local
}