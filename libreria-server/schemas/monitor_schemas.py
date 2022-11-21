from pydantic import BaseModel

class Monitor(BaseModel):
  autores: int
  temas: int
  formatos: int
  editoriales: int
  libros: int