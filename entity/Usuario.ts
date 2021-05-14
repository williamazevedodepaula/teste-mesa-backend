import { BaseEntity } from './BaseEntity'

/**
 * Representa um Usuario da aplicação
 */
export class Usuario extends BaseEntity<Usuario>{
    /**
     * ID do usuário. (PK)
     */
    id:number
    /**
     * Nome de usuário
     */
    username:string
    /**
     * Email do usuário
     */
    email:string
    /**
     * Senha do usuário
     */
    password:string
}