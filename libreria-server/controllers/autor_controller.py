from sqlalchemy.orm import Session
from sqlalchemy import select,desc
from models.autor_model import Autor
from schemas.autor_schemas import AutorNoId,AutorForUpdate

class AutorController:
    def get_all(self,db:Session):

        return db.execute(select(Autor).order_by(Autor.id_autor)).scalars().all()

    def get_by_id(self,db:Session, id_autor:int):
        result = db.execute(select(Autor).where(Autor.id_autor == id_autor)).scalar()
        return result

    def new_autor(self, db:Session, datos:AutorNoId):
        nuevo_autor: Autor = Autor(**datos.dict())
        db.add(nuevo_autor)
        db.commit()
        return db.execute(select(Autor).order_by(desc(Autor.id_autor))).scalars().first()

    def update_autor(self,db:Session,datos:AutorForUpdate,id_autor:int):
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

    def delete_autor(self,db:Session,id_autor:int):
        autor = self.get_by_id(db,id_autor)
        if autor is None:
            return None
        db.delete(autor)
        db.commit()
        return autor