import { keyof } from "zod/v4";
import type { IMaterias, IMateriasObject } from "../schemas/materias";

export function getPrelacionesDeMateria(materias: IMateriasObject, codigo: string, prelaciones: string[]) {
    if (materias[codigo].prelaciones[0] == null) {
        return;
    }

    materias[codigo].prelaciones.forEach((prelacion) => {
        prelaciones.push(prelacion);
        getPrelacionesDeMateria(materias, prelacion, prelaciones);
    });
    return ;
}

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
