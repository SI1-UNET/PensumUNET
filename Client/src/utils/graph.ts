import type {IMateriasBest, IMateriasObject } from "../schemas/materias";

export function getPrelacionesDeMateria(materias: IMateriasObject, codigo: string, prelaciones: string[]) {
    if (materias[codigo].prelaciones[0] == null) {
        return;
    }

    materias[codigo].prelaciones.forEach((prelacion) => {
        prelaciones.push(materias[prelacion].nombre)
        getPrelacionesDeMateria(materias, prelacion, prelaciones);
    });
    return ;
}

export function getDesbloqueablesDeMateria(materias: IMateriasObject, codigo: string, desbloqueables: string[]) {
    if (materias[codigo].desbloqueables[0] == null) {    
        return;
    }

    materias[codigo].desbloqueables.forEach((desbloqueable) => {
        desbloqueables.push(materias[desbloqueable].nombre);
        getDesbloqueablesDeMateria(materias, desbloqueable, desbloqueables);
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

export function getBestPath(materias: IMateriasObject, codigos: string[], uc: number): IMateriasBest[] {
    let materiasWithDesbloqueables: IMateriasBest[] = [];
    let materiasBest: IMateriasBest[] = [];
   
    codigos.forEach((codigo) => {
        if (materias[codigo].desbloqueables[0] != null) {    
            materias[codigo].desbloqueables.forEach((desbloqueable) => {
              
                let materiasArray: string[] = []
                getDesbloqueablesDeMateria(materias, desbloqueable, materiasArray);
                
                let materiasDes= materiasArray.filter((codigo, index) => materiasArray.indexOf(codigo) === index);
                materiasWithDesbloqueables.push({
                    "codigo": desbloqueable,
                    "nombre": materias[desbloqueable].nombre,
                    "desbloqueables": materiasDes.length, 
                    "uc": materias[desbloqueable].uc
                } as IMateriasBest);
            });           
        }
    });

    materiasWithDesbloqueables.sort((a,b) => b.desbloqueables - a.desbloqueables)

    let materiasWithDesbloqueablesFiltrada: IMateriasBest[] = materiasWithDesbloqueables.filter((o,index,arr) => 
        arr.findIndex(item => JSON.stringify(item) === JSON.stringify(o)) === index);
    
    let ucTotal = 0;
    materiasWithDesbloqueablesFiltrada.forEach((materia) => {
        if (ucTotal + materia.uc <= uc) {
            ucTotal += materia.uc;
            materiasBest.push(materia);
        }
    });
    console.log('Runito gato pequeño');
    return materiasBest;
}

export function getBestPathIntesivo(materias: IMateriasObject, codigos: string[], uc: number): IMateriasBest[] {
    if (uc > 10) {
        throw new Error("No pueden ser mas de 10 uc");
    }
    let materiasWithDesbloqueables: IMateriasBest[] = getBestPath(materias, codigos, uc);
    materiasWithDesbloqueables.sort((a,b) => b.desbloqueables - a.desbloqueables)

    return materiasWithDesbloqueables.slice(0, 3)
}

export function getRemainingSemestres(materias: IMateriasObject, codigos: string[]): number {
    let materiasPending: string[][] = [];
    codigos.forEach((codigo) => {
        if (materias[codigo].desbloqueables[0] != null) {    
            materias[codigo].desbloqueables.forEach((desbloqueable) => {
                let materiasArray: string[] = []
                materiasArray.push(materias[desbloqueable].nombre)
                getDesbloqueablesDeMateria(materias, desbloqueable, materiasArray);
                materiasPending.push(materiasArray)
                
            });           
        }
    });
    materiasPending.sort((a,b) => b.length - a.length)
    console.log('Materias pendientes:', materiasPending);
    return materiasPending[0].length
}



