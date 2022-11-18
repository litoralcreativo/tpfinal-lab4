from pydantic import BaseModel,validator
from datetime import datetime
from schemas.tema_schemas import TemaDTO
from schemas.autor_schemas import AutorDTO
from schemas.formato_schemas import FormatoDTO
from schemas.editorial_schemas import EditorialDTO
from typing import Optional
from datetime import datetime

class LibroBase(BaseModel):
    """Clase base para la creacion de libros

    Atributos:

        isbn: str (ISBN unico del libro) 11 a 13 caracteres

        titulo: str (No espacios en blanco o length < 1)

        cant_hojas: int (No hojas == 0 OR hojas > 1 millon)

        anio_edicion: int (No anio < 868 OR anio > ANIO_ACTUAL)

        editorial_id: int
        
        formato_id: int

        (A partir de estas listas luego se crean las asocianes en tablas derivadas)

        autor_id: list[int]
        temas_id: list[int]
    """
    isbn: str
    titulo: str
    cant_hojas: int
    anio_edicion: int
    editorial_id: int
    formato_id: int
    autor_id: list[int]
    temas_id: list[int]

    @validator('isbn')
    def check_isbn(cls,v:str):
        if v.isnumeric() == False or len(v) < 11 or len(v) > 13:
            raise ValueError('El ISBN introducido es inválido, debe tener al menos 11 dígitos')
        return v

    @validator('titulo')
    def check_titulo(cls,v:str):
        if v.isspace():
            raise ValueError('El titulo no pueden ser solo caracteres en blanco')
        if len(v) < 1:
            raise ValueError('El nombre del libro debe tener al menos 1 caracter')
        return v.strip()

    @validator('cant_hojas')
    def check_hojas(cls,v:int):
        if v == 0:
            raise ValueError('El libro no puede no tener hojas')
        if v > 1000000:
            raise ValueError('El libro no puede contener más de 1 millon de hojas')

        return v

    @validator('anio_edicion')
    def check_anio_edicion(cls,v:int):
        # basado en el libro "Sutra de diamante" año 868 d.C
        if v < 868:
            raise ValueError('El anio de edicion del libro es inválido')
        if v > datetime.now().year:
            raise ValueError('El año de edicion del libro no puede ser posterior al año actual')
        return v

    class Config:
        orm_mode = True

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
    isbn: str
    titulo: str
    cant_hojas: int
    anio_edicion: int
    editorial: EditorialDTO
    formato: FormatoDTO
    temas: list[TemaDTO]
    autores: list[AutorDTO]

class LibroForUpdate(BaseModel):
    """Clase base para la creacion de libros

    Atributos:

        isbn: int (ISBN unico del libro) isbn > 10 digitos Opcional

        titulo: str (No espacios en blanco o length < 1) Opcional

        cant_hojas: int (No hojas == 0 OR hojas > 1 millon) Opcional

        anio_edicion: int (No anio < 868 OR anio > ANIO_ACTUAL) Opcional

        editorial_id: int Opcional

        formato_id: int Opcional

        (A partir de estas listas luego se crean las asocianes en tablas derivadas)

        autor_id: list[int]
        temas_id: list[int]
    """
    titulo: Optional[str]
    cant_hojas: Optional[int]
    anio_edicion: Optional[int]
    editorial_id: Optional[int]
    formato_id: Optional[int]
    autor_id: Optional[list[int]]
    temas_id: Optional[list[int]]

    @validator('titulo')
    def check_titulo(cls,v:str):
        if v.isspace():
            raise ValueError('El titulo no pueden ser solo caracteres en blanco')
        if len(v) < 1:
            raise ValueError('El nombre del libro debe tener al menos 1 caracter')
        return v.strip()

    @validator('cant_hojas')
    def check_hojas(cls,v:int):
        if v == 0:
            raise ValueError('El libro no puede no tener hojas')
        if v > 1000000:
            raise ValueError('El libro no puede contener más de 1 millon de hojas')
        return v

    @validator('anio_edicion')
    def check_anio_edicion(cls,v:int):
        # basado en el libro "Sutra de diamante" año 868 d.C
        if v < 868:
            raise ValueError('El anio de edicion del libro es inválido')
        if v > datetime.now().year:
            raise ValueError('El año de edicion del libro no puede ser posterior al año actual')
        return v

    class Config:
        orm_mode = True
