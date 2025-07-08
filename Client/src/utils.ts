import * as types from "./types"; // Adjust path if types.ts is elsewhere

export default function transformar_info ( materiasJson: string, prelaciones_matJson: string, prelaciones_ucJson: string, semestresJson: string, departamentosJson: string, info_materiasJson: string): [types.Node[], types.Edge[]] {
    const arr_infoMat: types.InfoMateria[] = JSON.parse(info_materiasJson);
    const arr_mat: types.Materia[] = JSON.parse(materiasJson);
    const arr_preMat: types.PrelacionMaterias[] = JSON.parse(prelaciones_matJson);
    const arr_preUc: types.PrelacionUc[] = JSON.parse(prelaciones_ucJson); // Unused, but kept for completeness
    const arr_sem: types.Semestre[] = JSON.parse(semestresJson);
    const arr_dep: types.Departamento[] = JSON.parse(departamentosJson); // Unused, but kept for completeness

    // arr_temp seems unused, can be removed
    // const arr_temp: number[] = Array(10).fill(0);

    const maxSemestre = Math.max(...arr_sem.map(s => s.num_semestre));
    const contadorMateriasPorSemestre: number[] = new Array(maxSemestre + 1).fill(0);

    const nodos: types.Node[] = arr_mat.map(m => {
        const semestreEncontrado = arr_sem.find((s) => s.id === m.id_semestre);
        if (!semestreEncontrado) {
            console.warn(`Semestre con id ${m.id_semestre} no encontrado para la materia ${m.codigo}.`);
            return null;
        }

        const numSemestre = semestreEncontrado.num_semestre;

        const infoMateria = arr_infoMat.find((i) => i.codigo === m.codigo);

        if (!infoMateria) {
            console.warn(`Información para la materia ${m.codigo} no encontrada.`);
            return null;
        }

        if (numSemestre <= 0 || numSemestre > maxSemestre) { // Adjusted condition for validity
            console.warn(`Número de semestre inválido (${numSemestre}) para la materia ${m.codigo}.`);
            return null;
        }

        // Increment count for the current semester
        contadorMateriasPorSemestre[numSemestre]++;

        // The Y position should be relative to the count * (node height + ySpacing)
        // The X position should be relative to the semester * (node width + xSpacing)
        const yPos = (contadorMateriasPorSemestre[numSemestre] - 1);
        const xPos = (numSemestre - 1);


        return {
            id: m.codigo,
            content: infoMateria.nombre,
            x: xPos,
            y: yPos,
            // If you want to add tooltip, you'd fetch the department name here:
            // const departamento = arr_dep.find(d => d.id === infoMateria.id_departamento);
            // tooltip: `<strong>Departamento:</strong> ${departamento?.nombre || 'N/A'}<br>`
        };
    }).filter((n): n is types.Node => n !== null); // Filter out nulls and assert type

    // --- Corrected Edge Logic ---
    // Create a temporary map to consolidate 'to' nodes for each 'from' node
    const tempEdges: { [fromId: string]: string[] } = {};

    arr_preMat.forEach(p => {
        // 'p.codigo_mat' is the prerequisite (the 'from' node)
        // 'p.codigo_mat_prela' is the course that requires the prerequisite (the 'to' node)
        if (!tempEdges[p.codigo_mat]) {
            tempEdges[p.codigo_mat] = [];
        }
        // Add the target if it's not already in the list
        if (!tempEdges[p.codigo_mat].includes(p.codigo_mat_prela)) {
            tempEdges[p.codigo_mat].push(p.codigo_mat_prela);
        }
    });

    // Convert the map into the final Edge array format
    const aristas: types.Edge[] = Object.keys(tempEdges).map(fromId => ({
        from: fromId,
        to: tempEdges[fromId],
    }));

    return [nodos, aristas];
};
