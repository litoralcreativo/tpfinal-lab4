import axios from "axios";
import { from, map, Observable, of } from "rxjs";
import { ajax } from "rxjs/ajax";
import { CRUD } from "../Models/Crud.model";
import { Formato } from "../Models/Formato.model";

export default class FormatoService extends CRUD<Formato> {
  CONTROLLER: string = "formatos";

  getAll = (): Observable<Formato[]> => {
    return ajax
      .get<Formato[]>(`http://localhost:8000/${this.CONTROLLER}`)
      .pipe(map((x) => x.response));
  };

  getSingle = (id: number): Observable<Formato> => {
    return ajax
      .get<Formato>(`http://localhost:8000/${this.CONTROLLER}/${id}`)
      .pipe(map((x) => x.response));
  };

  updateSingle = (id: number, newValue: Formato): Observable<Formato> => {
    return ajax
      .put<Formato>(`http://localhost:8000/${this.CONTROLLER}/${id}`, newValue)
      .pipe(map((x) => x.response));
  };

  createSingle = (newValue: Formato): Observable<Formato> => {
    return ajax
      .post<Formato>(`http://localhost:8000/${this.CONTROLLER}`, newValue)
      .pipe(map((x) => x.response));
  };

  removeSingle = (id: number): Observable<any> => {
    return ajax
      .delete<any>(`http://localhost:8000/${this.CONTROLLER}/${id}`)
      .pipe(map((x) => x.response));
  };
}
