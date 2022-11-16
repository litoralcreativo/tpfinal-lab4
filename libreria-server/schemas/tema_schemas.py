from pydantic import BaseModel
from typing import Optional

class TemaNoId(BaseModel):
    nombre: str

    class Config:
        orm_mode = True


class TemaDTO(TemaNoId):
    tema_id: int

class TemaForUpdate(BaseModel):
    nombre: Optional[str]

    class Config:
        orm_mode = True