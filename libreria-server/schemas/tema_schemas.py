from pydantic import BaseModel,validator
from typing import Optional

class TemaNoId(BaseModel):
    """Schema para creacion
    
    Atributos:
        nombre: str (No espacios en blanco o length == 0)
    """
    nombre: str

    @validator('nombre')
    def not_spaces(cls,v:str):
        if v.isspace() or len(v) == 0:
            raise ValueError('El nombre del tema no pueden ser espacios en blanco')
        return v.strip()

    class Config:
        orm_mode = True


class TemaDTO(TemaNoId):
    tema_id: int

class TemaForUpdate(BaseModel):
    """Schema para update
    
    Atributos:
        nombre: str (No espacios en blanco o length == 0) Opcional
    """
    nombre: Optional[str]

    @validator('nombre')
    def not_spaces(cls,v:str):
        if v.isspace() or len(v) == 0:
            raise ValueError('El nombre del tema no pueden ser espacios en blanco')
        return v.strip()

    class Config:
        orm_mode = True