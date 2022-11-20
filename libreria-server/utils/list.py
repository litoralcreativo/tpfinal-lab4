from typing import List


def create_int_list(str_csv:str) -> List[int]:
    """Convierte un string a una lista de ints

    Recibe un string con valores enteros separados por comas que descompone en una lista de enteros
    """
    try:
        if len(str_csv) == 0:
            raise Exception
        int_list = [int(s) for s in str_csv.split(',')]
        return int_list
    except Exception as e:
        raise ValueError(f'Los valores de ids no son validos para crear una lista')