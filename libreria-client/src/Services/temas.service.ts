import axios from "axios";
import { from, map, Observable, of } from "rxjs";
import { ajax } from "rxjs/ajax";
import { CRUD } from "../Models/Crud.model";
import { Tema } from "../Models/Tema.model";

class TemaService extends CRUD<Tema> {
  CONTROLLER: string = "temas";

  getAll = (): Observable<Tema[]> => {
    return ajax
      .get<Tema[]>(`http://localhost:8000/${this.CONTROLLER}`)
      .pipe(map((x) => x.response));
  };

  getSingle = (id: number): Observable<Tema> => {
    return ajax
      .get<Tema>(`http://localhost:8000/${this.CONTROLLER}/${id}`)
      .pipe(map((x) => x.response));
  };

  updateSingle = (id: number, newValue: Tema): Observable<Tema> => {
    return ajax
      .put<Tema>(`http://localhost:8000/${this.CONTROLLER}/${id}`, newValue)
      .pipe(map((x) => x.response));
  };

  createSingle = (newValue: Tema): Observable<Tema> => {
    return ajax
      .post<Tema>(`http://localhost:8000/${this.CONTROLLER}`, newValue)
      .pipe(map((x) => x.response));
  };

  removeSingle = (id: number): Observable<any> => {
    return ajax
      .delete<any>(`http://localhost:8000/${this.CONTROLLER}/${id}`)
      .pipe(map((x) => x.response));
  };
}

export default TemaService;
