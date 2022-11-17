import axios from "axios";
import { from, map, Observable, of } from "rxjs";
import { ajax } from "rxjs/ajax";
import { Formato } from "../Models/Formato.model";

class FormatoService {
  constructor() {}

  /**
   * GET que consulta los formatos
   * @returns observable de todas los formatos
   */
  static getAll = (): Observable<Formato[]> => {
    return ajax
      .get<Formato[]>("http://localhost:8000/formatos")
      .pipe(map((x) => x.response));
  };

  /**
   * GET que consulta un formato particular
   * @param id identificador del formato
   * @returns observable del formato buscada
   */
  static getSingle = (id: number): Observable<Formato> => {
    return ajax
      .get<Formato>(`http://localhost:8000/formatos/${id}`)
      .pipe(map((x) => x.response));
  };

  /**
   * PUT que modifica un formato
   * @param id identificador del formato a ser editado
   * @param {Formato} newValue formato con valores modificados
   * @returns observable del formato editado
   */
  static updateSingle = (
    id: number,
    newValue: Formato
  ): Observable<Formato> => {
    return ajax
      .put<Formato>(`http://localhost:8000/formatos/${id}`, newValue)
      .pipe(map((x) => x.response));
  };

  /**
   * POST que inserta un formato
   * @param {Formato} newValue formato a ser insertado
   * @returns observable del formato insertado
   */
  static createSingle = (newValue: Formato): Observable<Formato> => {
    return ajax
      .post<Formato>(`http://localhost:8000/formatos`, newValue)
      .pipe(map((x) => x.response));
  };

  /**
   * DELETE que elimina un formato
   * @param id identificador de la formato a ser eliminado
   */
  static removeSingle = (id: number): Observable<any> => {
    return ajax
      .delete<any>(`http://localhost:8000/formatos/${id}`)
      .pipe(map((x) => x.response));
  };
}

export default FormatoService;
