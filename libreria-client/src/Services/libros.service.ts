import { map, Observable } from "rxjs";
import { ajax } from "rxjs/ajax";
import { CRUD } from "../Models/Crud.model";
import { Libro, LibroDTO, LibroPayloadDTO } from "../Models/Libro.model";

export default class LibroService extends CRUD<Libro> {
  parseToLibroDTO = (libro: Libro): LibroDTO => {
    let res: LibroDTO = {
      ...libro,
      isbn: libro.isbn.toString(),
      cant_hojas: libro.cant_hojas.toString(),
      anio_edicion: libro.anio_edicion.toString(),
      editorial: libro.editorial,
      formato: libro.formato,
    };
    return res;
  };

  parseToLibro = (libro: LibroDTO): Libro => {
    let res: Libro = {
      ...libro,
      isbn: Number.parseInt(libro.isbn.replace(/\s/g, "")),
      cant_hojas: Number.parseInt(libro.cant_hojas),
      anio_edicion: Number.parseInt(libro.anio_edicion),
      editorial: libro.editorial,
      formato: libro.formato,
    };
    return res;
  };

  parseToLibroPayloadDTO = (libro: Partial<Libro>): LibroPayloadDTO => {
    let res: LibroPayloadDTO = {
      titulo: libro.titulo!,
      isbn: libro.isbn!,
      cant_hojas: libro.cant_hojas!,
      anio_edicion: libro.anio_edicion!,
      editorial_id: libro.editorial!.editorial_id!,
      formato_id: libro.formato!.formato_id,
      autor_id: libro.autores!.map((x) => x.id_autor),
      temas_id: libro.temas!.map((x) => x.tema_id),
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
    const parsed = this.parseToLibroPayloadDTO(editedEntity);
    return ajax
      .put<Libro>(`http://localhost:8000/${this.CONTROLLER}/${id}`, parsed)
      .pipe(map((x) => x.response));
  }

  createSingle(newEntity: Partial<Libro>): Observable<Libro> {
    const parsed = this.parseToLibroPayloadDTO(newEntity);
    return ajax
      .post<Libro>(`http://localhost:8000/${this.CONTROLLER}`, parsed)
      .pipe(map((x) => x.response));
  }

  removeSingle(id: number): Observable<any> {
    return ajax
      .delete<any>(`http://localhost:8000/${this.CONTROLLER}/${id}`)
      .pipe(map((x) => x.response));
  }
}
