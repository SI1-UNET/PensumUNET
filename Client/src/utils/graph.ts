import type {IMateriasBest, IMateriasObject } from "../schemas/materias";

export function getMateriasHuerfanas(materias: IMateriasObject, uc_aprobadas: number): string[] {
    let materiasHuerfanas: string[] = [];
    for (const codigo in materias) {
        if (materias[codigo].prelaciones[0] == null && materias[codigo].uc_requeridas <= uc_aprobadas) {
            materiasHuerfanas.push(codigo);
        }
    }
    return materiasHuerfanas;
}

export function getPrelacionesDeMateria(materias: IMateriasObject, codigo: string, prelaciones: string[]) {
    if (materias[codigo].prelaciones[0] == null) {
        return;
    }

    materias[codigo].prelaciones.forEach((prelacion) => {
    if(!prelacion.includes(prelacion)) {        
        prelaciones.push(prelacion)
        getPrelacionesDeMateria(materias, prelacion, prelaciones);}
    });
    return ;
}

export function getDesbloqueablesDeMateria(materias: IMateriasObject, codigo: string, desbloqueables: string[]) {
    if (materias[codigo].desbloqueables[0] == null) {    
        return;
    }

    materias[codigo].desbloqueables.forEach((desbloqueable) => {
        if(!desbloqueables.includes(desbloqueable)) {
        desbloqueables.push(desbloqueable);
        getDesbloqueablesDeMateria(materias, desbloqueable, desbloqueables);}
    });
    return ;
}

export function getBestPath(materias: IMateriasObject, codigos: string[], uc: number, uc_aprobadas: number): IMateriasBest[] {
    let materiasWithDesbloqueables: IMateriasBest[] = [];
    let materiasBest: IMateriasBest[] = [];
    let materiasHuerfanas = getMateriasHuerfanas(materias, uc_aprobadas);

    codigos.forEach((codigo) => {
        if (materias[codigo].desbloqueables[0] != null) {    
            materias[codigo].desbloqueables.forEach((desbloqueable) => {

                let materiasArray: string[] = []
                getDesbloqueablesDeMateria(materias, desbloqueable, materiasArray);
            
                materiasWithDesbloqueables.push({
                    "codigo": desbloqueable,
                    "nombre": materias[desbloqueable].nombre,
                    "desbloqueables": materiasArray.length, 
                    "uc": materias[desbloqueable].uc,
                    "uc_min": materias[desbloqueable].uc_requeridas
                    
                } as IMateriasBest);
            });        
        }
    });

    materiasHuerfanas.forEach((codigo) => {
        let materiasArray: string[] = []
        getDesbloqueablesDeMateria(materias, codigo, materiasArray);     
        if(!materiasArray.some(desbloqueable => codigos.includes(desbloqueable)) && materias[codigo].uc_requeridas <= uc_aprobadas ){
        
            materiasWithDesbloqueables.push({
                "codigo": codigo,
                "nombre": materias[codigo].nombre,
                "desbloqueables": materiasArray.length,
                "uc": materias[codigo].uc,
                "uc_min": materias[codigo].uc_requeridas
                
            } as IMateriasBest);}
    });

    materiasWithDesbloqueables.sort((a,b) => b.desbloqueables - a.desbloqueables)
   
    let materiasWithDesbloqueablesFiltrada: IMateriasBest[] = materiasWithDesbloqueables.filter((o,index,arr) => 
        arr.findIndex(item => JSON.stringify(item) === JSON.stringify(o)) === index);
    
    let ucTotal = 0;
    materiasWithDesbloqueablesFiltrada.forEach((materia) => {
        
        if((materias[materia.codigo].prelaciones.every(prelacion => codigos.includes(prelacion)) || materias[materia.codigo].prelaciones[0] == null) 
        && !codigos.includes(materia.codigo) 
        && ucTotal + materia.uc <= uc) {

            ucTotal += materia.uc;
            materiasBest.push(materia);
        }
    });
    return materiasBest;
}

export function getBestPathIntesivo(materias: IMateriasObject, codigos: string[], uc: number, uc_aprobadas: number): IMateriasBest[] {
    if (uc > 10) {
        throw new Error("No pueden ser mas de 10 uc");
    }
    let materiasWithDesbloqueables: IMateriasBest[] = getBestPath(materias, codigos, uc, uc_aprobadas);
    materiasWithDesbloqueables.sort((a,b) => b.desbloqueables - a.desbloqueables)

    return materiasWithDesbloqueables.slice(0, 3)
}

// export function getRemainingSemestres(materias: IMateriasObject, codigos: string[]): number {
//     let materiasPending: string[][] = [];
//     codigos.forEach((codigo) => {
//         if (materias[codigo].desbloqueables[0] != null) {    
//             materias[codigo].desbloqueables.forEach((desbloqueable) => {
//                 let materiasArray: string[] = []
//                 materiasArray.push(materias[desbloqueable].nombre)
//                 getDesbloqueablesDeMateria(materias, desbloqueable, materiasArray);
//                 materiasPending.push(materiasArray)
                
//             });           
//         }
//     });
//     materiasPending.sort((a,b) => b.length - a.length)
//     console.log('Materias pendientes:', materiasPending);
//     return materiasPending[0].length
// }



