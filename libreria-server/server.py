import uvicorn
from fastapi import FastAPI
from config.db import create_all
# routers
from routes.editorial_router import editorial_router
from routes.autor_router import autor_router
from routes.formato_router import formato_router
from routes.tema_router import tema_router

# models
from models.editorial_model import Editorial
from models.autor_model import Autor
from models.formato_model import Formato
from models.tema_model import Tema

app = FastAPI()

# Para crear las entidades
create_all()

# Añado los APiRouter
app.include_router(editorial_router)
app.include_router(autor_router)
app.include_router(formato_router)
app.include_router(tema_router)

if __name__ == '__main__':
    uvicorn.run('server:app',reload=True)