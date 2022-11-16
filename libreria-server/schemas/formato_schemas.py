from pydantic import BaseModel

class FormatoNoId(BaseModel):
    nombre: str

    class Config:
        orm_mode = True


class FormatoDTO(FormatoNoId):
    formato_id: int