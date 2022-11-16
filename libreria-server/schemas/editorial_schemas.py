from pydantic import BaseModel

class EditorialNoId(BaseModel):
    nombre: str
    direccion: str
    url: str

    class Config:
        orm_mode = True


class EditorialDTO(EditorialNoId):
    editorial_id: int