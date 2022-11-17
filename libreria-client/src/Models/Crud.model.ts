import { Observable } from "rxjs";

export abstract class CRUD<T> {
  /**
   * Nombre del controlador del endpoint
   */
  abstract CONTROLLER: string;
  /**
   * @method GET
   * @returns Observable de todas las entidades
   */
  abstract getAll(): Observable<T[]>;
  /**
   * @method GET
   * @param id Identificador
   * @returns Observable de una entidad
   */
  abstract getSingle(id: number): Observable<T>;
  /**
   * @method PUT
   * @param id Identificador
   * @param editedEntity Entidad editada parcial
   * @returns Observable de la entidad editada completa
   */
  abstract updateSingle(id: number, editedEntity: Partial<T>): Observable<T>;
  /**
   * @method POST
   * @param newEntity Entidad parcial a insertar. Esta entidad puede tener todos los atributos o carecer de alguno, como el identificador.
   * @returns Observable de la entidad creada completa
   */
  abstract createSingle(newEntity: Partial<T>): Observable<T>;
  /**
   * @method DELETE
   * @param id Identificador de la entidad
   * @returns Observable
   */
  abstract removeSingle(id: number): Observable<any>;
}
