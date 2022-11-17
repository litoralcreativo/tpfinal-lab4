from pydantic import BaseModel
from datetime import datetime
from schemas.tema_schemas import TemaDTO
from schemas.autor_schemas import AutorDTO
from schemas.formato_schemas import FormatoDTO
from schemas.editorial_schemas import EditorialDTO
from typing import Optional


class LibroBase(BaseModel):
    """
    Clase base para la creacion de libros

    Atributos:

        isbn: int (ISBN unico del libro)
        titulo: str 
        cant_hojas: int
        anio_edicion: int
        editorial_id: int
        formato_id: int

        (A partir de estas listas luego se crean las asocianes en tablas derivadas)

        autor_id: list[int]
        temas_id: list[int]
    """
    isbn: int
    titulo: str
    cant_hojas: int
    anio_edicion: int
    editorial_id: int
    formato_id: int
    autor_id: list[int]
    temas_id: list[int]

class LibroDTO(BaseModel):
    """Clase de intercambio con el lado del Cliente

    Atributos:
        isbn: int

        titulo: str

        cant_hojas: int

        anio_edicion: int

        editorial: EditorialDTO

        formato: FormatoDTO

        temas: list[TemaDTO]
        
        autores: list[AutorDTO]
    """
    isbn: int
    titulo: str
    cant_hojas: int
    anio_edicion: int
    editorial: EditorialDTO
    formato: FormatoDTO
    temas: list[TemaDTO]
    autores: list[AutorDTO]

class LibroForUpdate(BaseModel):
    """Clase utilizada para Updates

    Tiene la misma estructura que la clase base pero los campos son opcionales

    Atributos:
        titulo: str (Optional)

        cant_hojas: int (Optional)

        anio_edicion: int (Optional)

        editorial_id: int (Optional)

        formato_id: int (Optional)

        autor_id: list[int] (Optional)
        
        temas_id: list[int] (Optional)
    """
    titulo: Optional[str]
    cant_hojas: Optional[int]
    anio_edicion: Optional[int]
    editorial_id: Optional[int]
    formato_id: Optional[int]
    autor_id: Optional[list[int]]
    temas_id: Optional[list[int]]
