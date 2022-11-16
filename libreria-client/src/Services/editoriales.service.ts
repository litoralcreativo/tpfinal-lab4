import axios from "axios";
import { from, map, Observable, of } from "rxjs";
import { ajax } from "rxjs/ajax";
import { Editorial } from "../Models/Editorial.model";

const editoriales: Editorial[] = [
  {
    editorial_id: 1,
    nombre: "Atlantida",
    url: "https://atlantida.com.ar/",
    direccion: "Elcano 3847, CABA",
  },
  {
    editorial_id: 2,
    nombre: "AZ",
    url: "http://az.com.ar/",
    direccion: "Montenegro 1335, CABA",
  },
];

class EditorialService {
  constructor() {}

  /**
   * GET que consulta las editoriales
   * @returns observable de todas las editoriales
   */
  static getEditoriales = (): Observable<Editorial[]> => {
    return ajax
      .get<Editorial[]>("http://localhost:8000/editoriales")
      .pipe(map((x) => x.response));
  };

  /**
   * GET que consulta una editorial particular
   * @param id identificador de la editorial
   * @returns observable de la editorial buscada
   */
  static getEditorialIndividual = (id: number): Observable<Editorial> => {
    return ajax
      .get<Editorial>(`http://localhost:8000/editoriales/${id}`)
      .pipe(map((x) => x.response));
  };

  /**
   * PUT que modifica una editorial
   * @param id identificador de la editorial a ser editada
   * @param {Editorial} newValue editorial con valores modificados
   * @returns observable de la editorial editada
   */
  static updateEditorialIndividual = (
    id: number,
    newValue: Editorial
  ): Observable<Editorial> => {
    return ajax
      .put<Editorial>(`http://localhost:8000/editoriales/${id}`, newValue)
      .pipe(map((x) => x.response));
  };

  /**
   * POST que inserta una editorial
   * @param {Editorial} newValue editorial a ser insertada
   * @returns observable editorial insertada
   */
  static altaEditorialIndividual = (
    newValue: Editorial
  ): Observable<Editorial> => {
    return ajax
      .post<Editorial>(`http://localhost:8000/editoriales`, newValue)
      .pipe(map((x) => x.response));
  };

  /**
   * DELETE que elimina una editorial
   * @param id identificador de la editorial a ser eliminada
   */
  static bajaEditorialIndividual = (id: number): Observable<any> => {
    return ajax
      .delete<any>(`http://localhost:8000/editoriales/${id}`)
      .pipe(map((x) => x.response));
  };
}

export default EditorialService;
