from sqlalchemy.orm import Session
from sqlalchemy import select,desc,func,Integer
from models.autor_model import Autor
from schemas.autor_schemas import AutorNoId,AutorForUpdate
from typing import List

class AutorRepository:
    def get_all(self,db:Session) -> List[Autor]:
        """Devuelve todos los autores dentro de la tabla

        Devolvemos todos los autores ordenados por el id
        """
        result = db.execute(select(Autor).order_by(Autor.id_autor)).scalars().all()
        return result

    def get_by_id(self,db:Session, id_autor:int) -> Autor:
        """Devuelve un autor por su id

        Parametros:
            id_autor: int (id del autor buscado)
        
        Return:
            Autor (Objeto de autor_model)

        """
        result = db.execute(select(Autor).where(Autor.id_autor == id_autor)).scalar()
        return result

    def get_count(self,db:Session) -> Integer:
        """Devuelve la cantidad de autores del sistema
        
        Return:
            int (cantidad)

        """
        result = db.query(func.count(Autor.id_autor)).scalar()
        return result

    def new_autor(self, db:Session, datos:AutorNoId) -> Autor:
        """Crea un autor nuevo

        LLega un Objeto de tipo Autor pero sin el id, que lo asigna la BDD

        Parametros
            datos: AutorNoId (Objeto a insertar en la base de datos)

        Return:
            Autor (Objeto de autor_model)
        """
        nuevo_autor = Autor(dni= datos.dni, nombre = datos.nombre, apellido = datos.apellido)
        db.add(nuevo_autor)
        db.commit()
        result =  db.execute(select(Autor).order_by(desc(Autor.id_autor))).scalars().first()
        return result

    def update_autor(self,db:Session,datos:AutorForUpdate,id_autor:int) -> Autor:
        """Actualiza los datos de un autor
        Busca un autor por si id, si lo encuentra actualiza los campos no NULL
        
        Parametros:
            id_autor: int (id del autor a ser actualiazado)
            datos: AutorForUpdate (Schema de autor con campos opcionales)

        Return:
            Autor (Objeto de autor_model)
        """
        autor = self.get_by_id(db,id_autor)
        if autor is None:
            return None
        else:
            # ternarias para saber si cambiar o no los campos
            autor.apellido = datos.apellido if datos.apellido is not None else autor.apellido
            autor.nombre = datos.nombre if datos.nombre is not None else autor.nombre
            autor.dni = datos.dni if datos.dni is not None else autor.dni
            db.commit()
        return autor

    def delete_autor(self,db:Session,id_autor:int) -> Autor:
        autor = self.get_by_id(db,id_autor)
        if autor is None:
            return None
        db.delete(autor)
        db.commit()
        return autor