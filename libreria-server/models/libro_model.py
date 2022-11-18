from config.db import BaseBd
from sqlalchemy import Column,Integer,String,ForeignKey,Table
from sqlalchemy.orm import relationship

# Tabla derivada para asociacion N a N de libros y temas
tema_libro = Table(
    "temas_libros",
    BaseBd.metadata,
    Column("tema_id", ForeignKey("tema.tema_id"), primary_key=True),
    Column("libro_isbn", ForeignKey("libro.isbn"), primary_key=True)
    )

# Tabla derivada para asociacion N a N de libros y autores
autor_libro = Table(
    "autores_libros",
    BaseBd.metadata,
    Column("autor_id", ForeignKey("autor.id_autor"), primary_key=True),
    Column("libro_isbn", ForeignKey("libro.isbn"), primary_key=True)
)

class Libro(BaseBd):
    """Modelo Para ORM

    Atributos:
        isbn = String(13) (PK)

        titulo = String NOT NULL

        cant_hojas = Integer NOT NULL

        anio_edicion = INTEGER NOT NULL

        editorial_id = INTEGER NOT NULL FK editorial

        formato_id = INTEGER NOT NULL FK formato

        temas = Refiere a la relacion N -> N con Temas y la tabla derivada
        
        autores = Refiere a la relacion N -> N con Autores y la tabla derivada

    """
    __tablename__ = "libro"
    isbn = Column(String(13),primary_key=True)
    titulo = Column(String(255),nullable=False)
    cant_hojas = Column(Integer,default=0)
    anio_edicion = Column(Integer,nullable=False)
    editorial_id = Column(Integer,ForeignKey("editorial.editorial_id",onupdate="CASCADE",ondelete='CASCADE'),nullable=False)
    formato_id = Column(Integer,ForeignKey("formato.formato_id",onupdate="CASCADE",ondelete='CASCADE'),nullable=False)
    temas = relationship("Tema",secondary=tema_libro,backref='libro')
    autores = relationship("Autor",secondary=autor_libro,backref='libro')

    def __repr__(self) -> str:
        return f'<Libro> temas: {self.temas}, autores: {self.autores}'

