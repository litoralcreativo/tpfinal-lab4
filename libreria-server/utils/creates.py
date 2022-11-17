from sqlalchemy.orm import Session
from typing import List
# Import de modelos
from models.autor_model import Autor
from models.editorial_model import Editorial
from models.formato_model import Formato
from models.tema_model import Tema
from models.libro_model import Libro

# Import de DTOs
from schemas.libro_schemas import LibroDTO
from schemas.autor_schemas import AutorDTO
from schemas.tema_schemas import TemaDTO
from schemas.formato_schemas import FormatoDTO
from schemas.editorial_schemas import EditorialDTO

# Import de repositorios
from repositories.editorial_repository import EditorialRepository
from repositories.formato_repository import FormatoRepository


def create_libro(lib:Libro,db:Session) -> LibroDTO | None:
    """Crea un LibroDTO a partir de un Model Libro

    Recibe un Model de libro y crea un objeto LibroDTO para poder ser tratado

    Parametros:
        lib: Libro (Objeto de Model Libro)

    Return:
        libro: LibroDTO (Para llevar a front)
    
    """
    editorial_repository = EditorialRepository()
    formato_repository = FormatoRepository()
    libro = LibroDTO(
                isbn = lib.isbn,
                anio_edicion = lib.anio_edicion,
                titulo = lib.titulo,
                cant_hojas = lib.cant_hojas,
                editorial = editorial_repository.get_by_id(db,lib.editorial_id),
                formato = formato_repository.get_by_id(db,lib.formato_id),
                temas = lib.temas,
                autores = lib.autores
            )
    return libro

def create_editorial(edit:Editorial) -> EditorialDTO | None:
    editorial_dto = EditorialDTO(
        nombre= edit.nombre,
        direccion= edit.direccion,
        editorial_id= edit.editorial_id,
        url= edit.url,
    )
    return editorial_dto

def create_autor(autor:Autor) -> AutorDTO | None:
    autor_dto = AutorDTO(
        id_autor= autor.id_autor,
        dni= autor.dni,
        nombre= autor.nombre,
        apellido= autor.apellido
    )
    return autor_dto

def create_formato(formato:Formato) -> FormatoDTO | None:
    formato_dto = FormatoDTO(
        nombre= formato.nombre,
        formato_id= formato.formato_id
    )
    return formato_dto

def create_tema(tema:Tema) -> TemaDTO | None:
    tema_dto = TemaDTO(
        nombre= tema.nombre,
        tema_id= tema.tema_id
    )
    return tema_dto

def create_list_libro(libros:List[Libro],db:Session) -> List[LibroDTO]:
    libros_list = []
    for libro in libros:
        libroDTO = create_libro(libro,db)
        libros_list.append(libroDTO)
    return libros_list

def create_list_autor(autores:List[Autor]) -> List[AutorDTO]:
    autores_list = []
    for autor in autores:
        autor_dto = create_autor(autor)
        autores_list.append(autor_dto)
    return autores_list

def create_list_editorial(editoriales:List[Editorial]) -> List[EditorialDTO]:
    editoriales_list = []
    for editorial in editoriales:
        editorial_dto = create_editorial(editorial)
        editoriales_list.append(editorial_dto)
    return editoriales_list

def create_list_formato(formatos:List[Formato]) -> List[FormatoDTO]:
    formatos_list = []
    for formato in formatos:
        formato_dto = create_formato(formato)
        formatos_list.append(formato_dto)
    return formatos_list

def create_list_tema(temas:List[Tema]) -> List[TemaDTO]:
    temas_list = []
    for tema in temas:
        tema_dto = create_tema(tema)
        temas_list.append(tema_dto)
    return temas_list
