import AutorService from "./autores.service";
import EditorialService from "./editoriales.service";
import FormatoService from "./formatos.service";
import LibroService from "./libros.service";
import MonitorService from "./monitor.service";
import TemaService from "./temas.service";

export class LibreriaServices {
  static libros: LibroService = new LibroService();
  static editoriales: EditorialService = new EditorialService();
  static autores: AutorService = new AutorService();
  static formatos: FormatoService = new FormatoService();
  static temas: TemaService = new TemaService();
  static monitor: MonitorService = new MonitorService();
}
