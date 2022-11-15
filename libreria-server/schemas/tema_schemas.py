from pydantic import BaseModel

class TemaNoId(BaseModel):
    nombre: str

    class Config:
        orm_mode = True


class TemaDTO(TemaNoId):
    tema_id: int