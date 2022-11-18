import { Autor } from "./Autor.model";
import { Editorial } from "./Editorial.model";
import { Formato } from "./Formato.model";
import { Tema } from "./Tema.model";

export interface Libro {
  isbn: number;
  titulo: string;
  cant_hojas: number;
  anio_edicion: number;
  editorial: Editorial;
  formato: Formato;
  temas: Tema[];
  autores: Autor[];
}

export interface LibroDTO {
  isbn: string;
  titulo: string;
  cant_hojas: string;
  anio_edicion: string;
  editorial: Editorial;
  formato: Formato;
  temas: Tema[];
  autores: Autor[];
}

export interface LibroPayloadDTO {
  isbn: number;
  titulo: string;
  cant_hojas: number;
  anio_edicion: number;
  editorial_id: number;
  formato_id: number;
  temas_id: number[];
  autor_id: number[];
}
