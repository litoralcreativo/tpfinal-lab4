import { Autor } from "./Autor.model";
import { Tema } from "./Tema.model";

export interface Libro {
  isbn: number;
  titulo: string;
  cant_hojas: number;
  anio_edicion: number;
  editorial_id: number;
  formato_id: number;
  temas: Tema[];
  autores: Autor[];
}

export interface LibroDTO {
  isbn: string;
  titulo: string;
  cant_hojas: string;
  anio_edicion: string;
  editorial_id: string;
  formato_id: string;
  temas: Tema[];
  autores: Autor[];
}
