from pydantic import BaseModel
from typing import Optional

class FormatoNoId(BaseModel):
    nombre: str

    class Config:
        orm_mode = True


class FormatoDTO(FormatoNoId):
    formato_id: int

class FormatoForUpdate(BaseModel):
    nombre: Optional[str]

    class Config:
        orm_mode = True