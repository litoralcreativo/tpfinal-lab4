from pydantic import BaseModel
from typing import Optional

class EditorialNoId(BaseModel):
    nombre: str
    direccion: str
    url: str

    class Config:
        orm_mode = True


class EditorialDTO(EditorialNoId):
    editorial_id: int

class EditorialForUpdate(BaseModel):
    nombre: Optional[str]
    direccion: Optional[str]
    url: Optional[str]

    class Config:
        orm_mode = True