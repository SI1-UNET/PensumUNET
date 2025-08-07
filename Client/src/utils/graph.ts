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
    if(!prelaciones.includes(prelacion)) {       
        prelaciones.push(prelacion)
        getPrelacionesDeMateria(materias, prelacion, prelaciones);}
    });
    return ;
}

export function getDesbloqueablesDeMateria(materias: IMateriasObject, codigo: string, desbloqueables: string[]) {
    try{
    if (materias[codigo].desbloqueables[0] == null) {    
        return;
    }

    materias[codigo].desbloqueables.forEach((desbloqueable) => {
        if(!desbloqueables.includes(desbloqueable)) {
        desbloqueables.push(desbloqueable);
        getDesbloqueablesDeMateria(materias, desbloqueable, desbloqueables);}
    });
    return ;}
    catch (error) {
        console.error(`Error processing desbloqueables for ${codigo}:`, error);
        return;
    }
}

export function getBestPath(materias: IMateriasObject, codigos: string[], uc: number, uc_aprobadas: number): IMateriasBest[] {
    let materiasWithDesbloqueables: IMateriasBest[] = [];
    let materiasBest: IMateriasBest[] = [];
    let materiasHuerfanas = getMateriasHuerfanas(materias, uc_aprobadas);

    codigos.forEach((codigo) => {

        
        if (materias[codigo].desbloqueables[0] != null) {        
            materias[codigo].desbloqueables.forEach((desbloqueable) => {
                let materiasArray: string[] = []
                if(materias[desbloqueable].uc_requeridas <= uc_aprobadas){     
                
                    getDesbloqueablesDeMateria(materias, desbloqueable, materiasArray);             
                    materiasWithDesbloqueables.push({
                        "codigo": desbloqueable,
                        "nombre": materias[desbloqueable].nombre,
                        "desbloqueables": materiasArray.length,
                        "correquisito": false,
                        "codigo_correquisito": null,
                        "uc": materias[desbloqueable].uc,
                        "uc_min": materias[desbloqueable].uc_requeridas
                        
                    } as IMateriasBest);

                    if(materias[desbloqueable].correquisito){
                        let materiasCoArray: string[] = []
                        getDesbloqueablesDeMateria(materias, desbloqueable, materiasCoArray);
                        let correquisito = materias[desbloqueable].correquisito
                        materiasWithDesbloqueables.push({
                        "codigo": correquisito,
                        "nombre": materias[correquisito].nombre,
                        "desbloqueables": materiasCoArray.length,
                        "correquisito": true,
                        "codigo_correquisito": desbloqueable,
                        "uc": materias[correquisito].uc,
                        "uc_min": materias[correquisito].uc_requeridas
                        
                    } as IMateriasBest);
                    }}
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
                "correquisito": false,
                "codigo_correquisito": null,
                "uc": materias[codigo].uc,
                "uc_min": materias[codigo].uc_requeridas
                
            } as IMateriasBest);}
    });

    materiasWithDesbloqueables.sort((a,b) => b.desbloqueables - a.desbloqueables)
    let materiasWithDesbloqueablesFiltrada: IMateriasBest[] = materiasWithDesbloqueables.filter((o,index,arr) => 
        arr.findIndex(item => JSON.stringify(item) === JSON.stringify(o)) === index);


    let ucTotal = 0;
    materiasWithDesbloqueablesFiltrada.forEach((materia) => {
        
        if(
        (materias[materia.codigo].prelaciones.every(prelacion => codigos.includes(prelacion)) || materias[materia.codigo].prelaciones[0] == null || materia.correquisito )
        && !codigos.includes(materia.codigo) 
        && ucTotal + materia.uc <= uc
        && ((materia.correquisito && materia.codigo_correquisito !== null && materiasBest.some(m => m.codigo === materia.codigo_correquisito)) || !materia.correquisito)) {

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

export function getMissingMateria(materias: IMateriasObject, codigo: string, selected_materias: string[], missing_materias: string[], visited_materias: string[]){ 
    if (!visited_materias.includes(codigo)) {
        visited_materias.push(codigo);
    }
    
    if (materias[codigo].prelaciones[0] == null 
        || materias[codigo].prelaciones.every(prelacion => visited_materias.includes(prelacion))) {
        return;
    }

    materias[codigo].prelaciones.forEach((prelacion) => {
        getMissingMateria(materias, prelacion, selected_materias, missing_materias, visited_materias);
        
        if(!materias[prelacion].desbloqueables.every(desbloqueable => visited_materias.includes(desbloqueable))
            && !selected_materias.includes(prelacion)
            && !missing_materias.includes(prelacion)
            && !materias[prelacion].desbloqueables.every(desbloqueable => selected_materias.includes(desbloqueable))
            ){
            missing_materias.push(prelacion);
        }
            
    });
    return ;
}