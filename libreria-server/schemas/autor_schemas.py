from pydantic import BaseModel
from typing import Optional

class AutorNoId(BaseModel):
    dni: int
    nombre: str
    apellido: str

    class Config:
        orm_mode = True


class AutorDTO(AutorNoId):
    id_autor: int

class AutorForUpdate(BaseModel):
    dni: Optional[int]
    nombre: Optional[str]
    apellido: Optional[str]

    class Config:
        orm_mode = True