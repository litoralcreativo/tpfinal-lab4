from sqlalchemy.orm import Session
from sqlalchemy import select,desc
from models.autor_model import Autor
from schemas.autor_schemas import AutorNoDni

class AutorController:
    def get_all(self,db:Session):
        return db.execute(select(Autor).order_by(Autor.dni)).scalars().all()

    def get_by_id(self,db:Session, dni:int):
        result = db.execute(select(Autor).where(Autor.dni == dni)).scalar()
        return result

    def new_autor(self, db:Session, datos:AutorNoDni):
        nuevo_autor: Autor = Autor(**datos.dict())
        db.add(nuevo_autor)
        db.commit()
        return db.execute(select(Autor).order_by(desc(Autor.dni))).scalars().first()

    def update_autor(self,db:Session,datos:AutorNoDni,dni:int):
        autor = self.get_by_id(db,dni)
        if autor is None:
            return None
        else:
            autor.apellido = datos.apellido if datos.apellido is not None else autor.apellido
            autor.nombre = datos.nombre if datos.nombre is not None else autor.nombre
            db.commit()
        return autor

    def delete_autor(self,db:Session,dni:int):
        autor = self.get_by_id(db,dni)
        if autor is None:
            return None
        db.delete(autor)
        db.commit()
        return autor