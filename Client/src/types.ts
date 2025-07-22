export interface Node {
    id: string;
    content: string;
    uc: number;
    departamento: string;
    info: string;
    x: number;
    y: number;
    width: number;
    height: number;
}

export interface Edge {
    from: string;
    to: string[];
}

export interface Carrera {
    id: number;
    nombre: string;
    uc_totales: number;
}


export interface Departamento {
    id: number;
    nombre: string;
}


export interface InfoMateria {
    codigo: string;
    nombre: string;
    info: string;
    uc: number;
    horas_estudio: number;
    id_departamento: number;
}

export interface Materia {
    codigo: string;
    id_carrera: number;
    id_semestre: number;
    electiva: number;
    id_nucleo: number;
}

export interface Nucleo {
    id: number;
    nombre: string;
    id_departamento: string;
}

export interface PrelacionMaterias {
    codigo_mat: string;
    codigo_mat_prela: string;
    id_carrera: number;
}

export interface PrelacionUc {
    codigo_mat: string;
    id_carrera: number;
    uc: number;
}

export interface Semestre {
    id: number;
    semestre: string;
    num_semestre: number;
}
