from pydantic import BaseModel,validator
from typing import Optional

class AutorNoId(BaseModel):
    """Schema base para creacion

    Atributos:

        dni: int (dni > 10 millones)

        nombre: str (No espacios en blanco o length == 0)

        apellido: str (No espacios en blanco o length == 0)
    """
    dni: int
    nombre: str
    apellido: str

    @validator('dni')
    def check_dni(cls,v:int):
        if v < 10000000:
            raise ValueError('El dni introducido es inválido')
        return v
    
    @validator('nombre','apellido')
    def check_nombre_completo(cls,v:str):
        if v.isspace() or len(v) == 0:
            raise ValueError('El nombre o el apellido introducido es incorrecto')
        if v.isnumeric():
            raise ValueError('Los nombres y apellidos deben contener letras')
        return v.strip()

    class Config:
        orm_mode = True


class AutorDTO(AutorNoId):
    id_autor: int

class AutorForUpdate(BaseModel):
    """Schema base para update

    Atributos:

        dni: int (dni > 10 millones) Opcional

        nombre: str (No espacios en blanco o length == 0) Opcional

        apellido: str (No espacios en blanco o length == 0) Opcional
    """
    dni: Optional[int]
    nombre: Optional[str]
    apellido: Optional[str]

    @validator('dni')
    def check_dni(cls,v:int):
        if v < 10000000:
            raise ValueError('El dni introducido es inválido')
        return v
    
    @validator('nombre','apellido')
    def check_nombre_completo(cls,v:str):
        if v.isspace() or len(v) == 0:
            raise ValueError('El nombre o el apellido introducido es incorrecto')
        if v.isnumeric():
            raise ValueError('Los nombres y apellidos deben contener letras')
        return v.strip()

    class Config:
        orm_mode = True