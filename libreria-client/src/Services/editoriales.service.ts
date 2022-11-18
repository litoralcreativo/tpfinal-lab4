import axios from "axios";
import { from, map, Observable, of } from "rxjs";
import { ajax } from "rxjs/ajax";
import { CRUD } from "../Models/Crud.model";
import { Editorial } from "../Models/Editorial.model";

export default class EditorialService extends CRUD<Editorial> {
  CONTROLLER: string = "editoriales";

  getAll = (): Observable<Editorial[]> => {
    return ajax
      .get<Editorial[]>(`http://localhost:8000/${this.CONTROLLER}`)
      .pipe(map((x) => x.response));
  };

  getSingle = (id: number): Observable<Editorial> => {
    return ajax
      .get<Editorial>(`http://localhost:8000/${this.CONTROLLER}/${id}`)
      .pipe(map((x) => x.response));
  };

  updateSingle = (id: number, newValue: Editorial): Observable<Editorial> => {
    return ajax
      .put<Editorial>(
        `http://localhost:8000/${this.CONTROLLER}/${id}`,
        newValue
      )
      .pipe(map((x) => x.response));
  };

  createSingle = (newValue: Editorial): Observable<Editorial> => {
    return ajax
      .post<Editorial>(`http://localhost:8000/${this.CONTROLLER}`, newValue)
      .pipe(map((x) => x.response));
  };

  removeSingle = (id: number): Observable<any> => {
    return ajax
      .delete<any>(`http://localhost:8000/${this.CONTROLLER}/${id}`)
      .pipe(map((x) => x.response));
  };
}
