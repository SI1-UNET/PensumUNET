export function getRemainingSemestres(uc_aprobadas: number, uc_requeridas: number, uc_promedio: number): number {
    if (uc_aprobadas >= uc_requeridas) {
        return 0;
    }
    const remainingUc = uc_requeridas - uc_aprobadas;
    return Math.ceil(remainingUc / uc_promedio);
}