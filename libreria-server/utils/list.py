from typing import List

def create_int_list(str_csv:str) -> List[int]:
    int_list = [int(s) for s in str_csv.split(',')]
    return int_list