from pydantic import BaseModel,validator,ValidationError
from typing import Optional

class FormatoNoId(BaseModel):
    """Schema para creacion

    Atibutos:
        nombres: str (No espacios en blanco o length == 0)
    """
    nombre: str

    @validator('nombre')
    def not_spaces(cls,v:str):
        if v.isspace() or len(v) == 0:
            raise ValueError('El nombre del formato no pueden ser espacios en blanco')
        if v.isnumeric():
            raise ValueError('El nombre del formato no puede ser un numero')
        return v.strip()

    class Config:
        orm_mode = True


class FormatoDTO(FormatoNoId):
    formato_id: int

class FormatoForUpdate(BaseModel):
    nombre: Optional[str]

    @validator('nombre')
    def not_spaces(cls,v:str):
        if v.isspace() or len(v) == 0:
            raise ValueError('El nombre del formato no pueden ser espacios en blanco')
        if v.isnumeric():
            raise ValueError('El nombre del formato no puede ser un numero')
        return v.strip()

    class Config:
        orm_mode = True