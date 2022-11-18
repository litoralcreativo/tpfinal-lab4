import { from, map, Observable, of } from "rxjs";
import { ajax } from "rxjs/ajax";
import { Autor, AutorDTO } from "../Models/Autor.model";
import { CRUD } from "../Models/Crud.model";

class AutorService extends CRUD<Autor> {
  CONTROLLER: string = "autores";

  parseToAutor = (autor: Autor): AutorDTO => {
    let res = { ...autor, dni: autor.dni.toString() };
    return res;
  };

  parseToAutorDTO = (autor: AutorDTO): Autor => {
    let res: Autor = { ...autor, dni: Number.parseInt(autor.dni), id_autor: 0 };
    return res;
  };

  getAll = (): Observable<Autor[]> => {
    return ajax
      .get<Autor[]>(`http://localhost:8000/${this.CONTROLLER}`)
      .pipe(map((x) => x.response));
  };

  getSingle = (id: number): Observable<Autor> => {
    return ajax
      .get<Autor>(`http://localhost:8000/${this.CONTROLLER}/${id}`)
      .pipe(map((x) => x.response));
  };

  updateSingle = (id: number, newValue: Autor): Observable<Autor> => {
    return ajax
      .put<Autor>(`http://localhost:8000/${this.CONTROLLER}/${id}`, newValue)
      .pipe(map((x) => x.response));
  };

  createSingle = (newValue: Autor): Observable<Autor> => {
    return ajax
      .post<Autor>(
        `http://localhost:8000/${this.CONTROLLER}`,
        this.parseToAutor(newValue)
      )
      .pipe(map((x) => x.response));
  };

  removeSingle = (id: number): Observable<any> => {
    return ajax
      .delete<any>(`http://localhost:8000/${this.CONTROLLER}/${id}`)
      .pipe(map((x) => x.response));
  };
}

export default AutorService;
