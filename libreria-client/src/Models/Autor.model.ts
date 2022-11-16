export interface Autor {
  id_autor: number;
  dni: number;
  nombre: string;
  apellido: string;
}

export interface AutorDTO {
  dni: string;
  nombre: string;
  apellido: string;
}
