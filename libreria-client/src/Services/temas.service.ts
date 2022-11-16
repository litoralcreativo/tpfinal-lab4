import axios from "axios";
import { from, map, Observable, of } from "rxjs";
import { ajax } from "rxjs/ajax";
import { Tema } from "../Models/Tema.model";

class TemaService {
  constructor() {}

  /**
   * GET que consulta los temas
   * @returns observable de todas los temas
   */
  static getAll = (): Observable<Tema[]> => {
    return ajax
      .get<Tema[]>("http://localhost:8000/temas")
      .pipe(map((x) => x.response));
  };

  /**
   * GET que consulta un tema particular
   * @param id identificador del tema
   * @returns observable del tema buscado
   */
  static getSingle = (id: number): Observable<Tema> => {
    return ajax
      .get<Tema>(`http://localhost:8000/temas/${id}`)
      .pipe(map((x) => x.response));
  };

  /**
   * PUT que modifica un tema
   * @param id identificador del tema a ser editado
   * @param {Tema} newValue tema con valores modificados
   * @returns observable del tema editado
   */
  static updateSingle = (id: number, newValue: Tema): Observable<Tema> => {
    return ajax
      .put<Tema>(`http://localhost:8000/temas/${id}`, newValue)
      .pipe(map((x) => x.response));
  };

  /**
   * POST que inserta un tema
   * @param {Tema} newValue tema a ser insertado
   * @returns observable del tema insertado
   */
  static createSingle = (newValue: Tema): Observable<Tema> => {
    return ajax
      .post<Tema>(`http://localhost:8000/temas`, newValue)
      .pipe(map((x) => x.response));
  };

  /**
   * DELETE que elimina un tema
   * @param id identificador del tema a ser eliminado
   */
  static removeSingle = (id: number): Observable<any> => {
    return ajax
      .delete<any>(`http://localhost:8000/temas/${id}`)
      .pipe(map((x) => x.response));
  };
}

export default TemaService;
