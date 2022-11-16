from config.db import BaseBd
from sqlalchemy import Column, Integer, String,Table,ForeignKey
from sqlalchemy.orm import relationship
# from models.autor_libro_model import AutorLibro

# autor_Libro = Table(
#     "autores_libros",
#     BaseBd.metadata,
#     Column("autor_dni", ForeignKey("autor.dni"), primary_key=True),
#     Column("libro_isbn", ForeignKey("libro.isbn"), primary_key=True)
# )

class Autor(BaseBd):
    __tablename__ = 'autor'
    id_autor = Column(Integer,primary_key=True)
    dni = Column(Integer, autoincrement=False,nullable=False)
    nombre = Column(String(255), nullable=False)
    apellido = Column(String(255), nullable=False)

    def __repr__(self) -> str:
        return f'<Autor> Nombre: {self.nombre}; Apellido: {self.apellido}; DNI: {self.dni}; ID: {self.id_autor}'