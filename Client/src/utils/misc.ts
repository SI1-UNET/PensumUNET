import type { IMateriasObject } from "../schemas/materias";

export function getRemainingSemestres(uc_aprobadas: number, uc_requeridas: number, uc_promedio: number): number {
    if (uc_aprobadas >= uc_requeridas) {
        return 0;
    }
    const remainingUc = uc_requeridas - uc_aprobadas;
    return Math.ceil(remainingUc / uc_promedio);
}

export function getUC(materias: IMateriasObject, codigos: string[]): number{
    let uc = 0;
    let uniqueArray = Array.from(new Set(codigos));
        uniqueArray.forEach((codigo) => {
            uc += materias[codigo].uc
        })
    return uc;
}