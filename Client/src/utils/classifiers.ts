import type { IMateriasBySemester, IMateriasObject } from "../schemas/materias";

export function getMateriasByDepartamento(materias: IMateriasObject, departamento: string): IMateriasObject {
 let materiasFiltradas: IMateriasObject = {};

 for (const materia in materias as IMateriasObject) {
    if (materias[materia].departamento == departamento) {
        materiasFiltradas[materia] = materias[materia];
    }}
    return materiasFiltradas;
}

export function getMateriasByNucleo(materias: IMateriasObject, nucleo: string): IMateriasObject {
 let materiasFiltradas: IMateriasObject = {};

 for (const materia in materias as IMateriasObject) {
    if (materias[materia].nucleo == nucleo) {
        materiasFiltradas[materia] = materias[materia];
    }}
    return materiasFiltradas;
} 

export function getMateriasBySemester(materias: IMateriasObject): IMateriasBySemester {
    let materiasSemestre: IMateriasBySemester = {};
    for (const codigo in materias) {
        const semestre = materias[codigo].semestre;
        if (!materiasSemestre[semestre]) {
            materiasSemestre[semestre] = {};
        }
        materiasSemestre[semestre][codigo] = materias[codigo];
    }
    return materiasSemestre;
} 