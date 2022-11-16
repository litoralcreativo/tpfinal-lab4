from pydantic import BaseModel
from datetime import datetime
from schemas.tema_schemas import TemaDTO
from schemas.autor_schemas import AutorDTO
from schemas.formato_schemas import FormatoDTO
from schemas.editorial_schemas import EditorialDTO
from typing import Optional

class LibroBase(BaseModel):
    isbn: int
    titulo: str
    cant_hojas: int
    anio_edicion: Optional[int]
    editorial_id: int
    formato_id: int
    autor_dni: list[int]
    temas_id: list[int]

class LibroDTO(BaseModel):
    isbn: int
    titulo: str
    cant_hojas: int
    anio_edicion: int
    editorial_id: int
    formato_id: int
    # editorial: EditorialDTO
    # formato: FormatoDTO
    temas: list[TemaDTO]
    autores: list[AutorDTO]

class LibroForUpdate(BaseModel):
    titulo: Optional[str]
    cant_hojas: Optional[int]
    anio_edicion: Optional[int]
    editorial_id: Optional[int]
    formato_id: Optional[int]
    autor_dni: Optional[list[int]]
    temas_id: Optional[list[int]]
