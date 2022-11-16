import axios from "axios";
import { from, map, Observable, of } from "rxjs";
import { ajax } from "rxjs/ajax";
import { Autor } from "../Models/Autor.model";

class AutorService {
  constructor() {}

  /**
   * GET que consulta los autores
   * @returns observable de todos los autores
   */
  static getAll = (): Observable<Autor[]> => {
    return ajax
      .get<Autor[]>("http://localhost:8000/autores")
      .pipe(map((x) => x.response));
  };

  /**
   * GET que consulta un autor particular
   * @param id identificador del autor
   * @returns observable del autor buscado
   */
  static getSingle = (id: number): Observable<Autor> => {
    return ajax
      .get<Autor>(`http://localhost:8000/autores/${id}`)
      .pipe(map((x) => x.response));
  };

  /**
   * PUT que modifica un autor
   * @param id identificador del autor a ser editado
   * @param {Autor} newValue autor con valores modificados
   * @returns observable del autor editado
   */
  static updateSingle = (id: number, newValue: Autor): Observable<Autor> => {
    return ajax
      .put<Autor>(`http://localhost:8000/autores/${id}`, newValue)
      .pipe(map((x) => x.response));
  };

  /**
   * POST que inserta un autor
   * @param {Autor} newValue autor a ser insertado
   * @returns observable del autor insertado
   */
  static createSingle = (newValue: Autor): Observable<Autor> => {
    return ajax
      .post<Autor>(`http://localhost:8000/autores`, newValue)
      .pipe(map((x) => x.response));
  };

  /**
   * DELETE que elimina un autor
   * @param id identificador del autor a ser eliminado
   */
  static removeSingle = (id: number): Observable<any> => {
    return ajax
      .delete<any>(`http://localhost:8000/autores/${id}`)
      .pipe(map((x) => x.response));
  };
}

export default AutorService;
