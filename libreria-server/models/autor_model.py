from config.db import BaseBd
from sqlalchemy import Column, Integer, String,Table,ForeignKey
from sqlalchemy.orm import relationship
# from models.autor_libro_model import AutorLibro

autor_Libro = Table(
    "autores_libros",
    BaseBd.metadata,
    Column("autor_dni", ForeignKey("autor.dni"), primary_key=True),
    Column("libro_isbn", ForeignKey("libro.isbn"), primary_key=True)
)

class Autor(BaseBd):
    __tablename__ = 'autor'
    dni = Column(Integer, primary_key=True, autoincrement=False)
    nombre = Column(String(255), nullable=False)
    apellido = Column(String(255))
    libros = relationship("Libro",secondary=autor_Libro)