from pydantic import BaseModel,validator,ValidationError
from typing import Optional

class EditorialNoId(BaseModel):
    """Schema para creacion

    Atributos:

    nombre: str (No espacios en blanco o length < 2)

    apellido: str (No espacios en blanco o length == 0)

    url: str (Maximo 253 caracteres y No espacios en blanco)
    """
    nombre: str
    direccion: str
    url: str

    @validator('nombre','direccion',each_item=True)
    def not_empty(cls,v:str):
        if v.isspace() or len(v) < 1:
            raise ValueError('El nombre o la direccion no tiene la cantidad de caracteres necesarios: 2')
        if v.isnumeric():
            raise ValueError('El nombre o la direccion no pueden ser numeros')
        return v
    
    @validator('url')
    def not_url(cls,v:str):
        print(v)
        if v.isspace() or len(v) < 1:
            raise ValueError('La url no pueden ser caracteres en blanco')
        if len(v) > 253:
            raise ValueError('La url debe contener maximo 253 caracteres')
        if v.isnumeric():
            raise ValueError('La URL no puede ser un número')
        if v.find(' ') != -1:
            raise ValueError('La URL no puede contener espacios')
        return v

    class Config:
        orm_mode = True


class EditorialDTO(EditorialNoId):
    editorial_id: int

class EditorialForUpdate(BaseModel):
    """Schema para update

    Atributos:

    nombre: str (No espacios en blanco o length < 2) Opcional

    apellido: str (No espacios en blanco o length == 0) Opcional

    url: str (Maximo 253 caracteres y No espacios en blanco) Opcional
    """
    nombre: Optional[str]
    direccion: Optional[str]
    url: Optional[str]

    @validator('nombre','direccion')
    def not_empty(cls,v:str):
        if v.isspace() or len(v) < 1:
            raise ValueError('El nombre o la direccion no tiene la cantidad de caracteres necesarios: 2')
        if v.isnumeric():
                raise ValueError('El nombre o la direccion no pueden ser numeros')
        return v.strip()
    
    @validator('url')
    def not_url(cls,v:str):
        print(v)
        if len(v) > 253:
            raise ValueError('La url debe contener maximo 253 caracteres')
        if v.isspace() or len(v) < 1:
            raise ValueError('La url no pueden ser caracteres en blanco')
        if v.isnumeric():
            raise ValueError('La URL no puede ser un número')
        return v.strip()

    class Config:
        orm_mode = True