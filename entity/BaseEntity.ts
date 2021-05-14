import { PersistedModel } from "loopback";

/**
 * Entidade base da aplicação
 */
export class BaseEntity<T> extends PersistedModel{

    /**
     * Construtor da classe
     * @param data dados a serem injetados na classe (JSON)
     */
    constructor(data?:Partial<T>){
        super(data);
    }
}