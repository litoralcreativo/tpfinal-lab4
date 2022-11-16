from config.db import BaseBd
from sqlalchemy import Column,Integer,String,Date,func,ForeignKey,Table
from sqlalchemy.orm import relationship
from datetime import datetime

tema_libro = Table(
    "temas_libros",
    BaseBd.metadata,
    Column("tema_id", ForeignKey("tema.tema_id"), primary_key=True),
    Column("libro_isbn", ForeignKey("libro.isbn"), primary_key=True)
    )

autor_libro = Table(
    "autores_libros",
    BaseBd.metadata,
    Column("autor_id", ForeignKey("autor.id_autor"), primary_key=True),
    Column("libro_isbn", ForeignKey("libro.isbn"), primary_key=True)
)

class Libro(BaseBd):
    __tablename__ = "libro"
    isbn = Column(Integer,primary_key=True,autoincrement=False)
    titulo = Column(String(255),nullable=False)
    cant_hojas = Column(Integer,default=0)
    anio_edicion = Column(Integer,nullable=False)
    editorial_id = Column(Integer,ForeignKey("editorial.editorial_id",onupdate="CASCADE"),nullable=False)
    formato_id = Column(Integer,ForeignKey("formato.formato_id",onupdate="CASCADE"),nullable=False)
    temas = relationship("Tema",secondary=tema_libro,backref='libro')
    autores = relationship("Autor",secondary=autor_libro,backref='libro')

    def __repr__(self) -> str:
        return f'<Libro> temas: {self.temas}, autores: {self.autores}'

