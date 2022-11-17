import { map, Observable } from "rxjs";
import { ajax } from "rxjs/ajax";
import { CRUD } from "../Models/Crud.model";
import { Libro, LibroDTO } from "../Models/Libro.model";

export class LibroService extends CRUD<Libro> {
  parseToLibroDTO = (libro: Libro): LibroDTO => {
    let res: LibroDTO = {
      ...libro,
      isbn: libro.isbn.toString(),
      cant_hojas: libro.cant_hojas.toString(),
      anio_edicion: libro.anio_edicion.toString(),
      editorial_id: libro.editorial_id.toString(),
      formato_id: libro.formato_id.toString(),
    };
    return res;
  };

  parseToLibro = (libro: LibroDTO): Libro => {
    let res: Libro = {
      ...libro,
      isbn: Number.parseInt(libro.isbn),
      cant_hojas: Number.parseInt(libro.cant_hojas),
      anio_edicion: Number.parseInt(libro.anio_edicion),
      editorial_id: Number.parseInt(libro.editorial_id),
      formato_id: Number.parseInt(libro.formato_id),
    };
    return res;
  };

  CONTROLLER: string = "libros";

  getAll(): Observable<Libro[]> {
    return ajax
      .get<Libro[]>(`http://localhost:8000/${this.CONTROLLER}`)
      .pipe(map((x) => x.response));
  }

  getSingle(id: number): Observable<Libro> {
    return ajax
      .get<Libro>(`http://localhost:8000/${this.CONTROLLER}/${id}`)
      .pipe(map((x) => x.response));
  }

  updateSingle(id: number, editedEntity: Partial<Libro>): Observable<Libro> {
    return ajax
      .put<Libro>(
        `http://localhost:8000/${this.CONTROLLER}/${id}`,
        editedEntity
      )
      .pipe(map((x) => x.response));
  }

  createSingle(newEntity: Partial<Libro>): Observable<Libro> {
    return ajax
      .post<Libro>(`http://localhost:8000/${this.CONTROLLER}`, newEntity)
      .pipe(map((x) => x.response));
  }

  removeSingle(id: number): Observable<any> {
    return ajax
      .delete<any>(`http://localhost:8000/${this.CONTROLLER}/${id}`)
      .pipe(map((x) => x.response));
  }
}
