from pydantic import BaseModel

class AutorNoDni(BaseModel):
    nombre: str
    apellido: str

    class Config:
        orm_mode = True


class AutorDTO(AutorNoDni):
    dni: int