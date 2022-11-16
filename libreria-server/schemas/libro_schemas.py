from pydantic import BaseModel
from datetime import datetime
from schemas.tema_schemas import TemaNoId
from schemas.autor_schemas import AutorNoDni
from schemas.formato_schemas import FormatoNoId
from schemas.editorial_schemas import EditorialNoId
from typing import Optional

class LibroBase(BaseModel):
    isbn: int
    titulo: str
    cant_hojas: int
    anio_edicion: Optional[datetime]
    editorial_id: int
    formato_id: int
    autor_dni: Optional[int]
    temas_id: Optional[int]

class LibroDTO(LibroBase):
    editorial: EditorialNoId
    formato: FormatoNoId
    autores: AutorNoDni
    temas: TemaNoId
