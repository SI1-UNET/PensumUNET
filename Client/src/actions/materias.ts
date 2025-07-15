import { defineAction } from 'astro:actions';
import { z } from 'astro:content';
import { getSecret } from 'astro:env/server';
import type { IMaterias, IMateriasBySemester, IMateriasObject } from '../schemas/materias';
import { de } from 'zod/v4/locales';

const SERVER_ADDRESS = getSecret("SERVER_ADDRESS")

export const materias = {
    get: defineAction({
        input: z.object({
            name: z.string(),
        }),
        handler: async (input,context) => {
            try {
              const res = await fetch(`http://${SERVER_ADDRESS}/materias/departamento/${name}`,{
                  method: "GET",
                  headers: context.request.headers
              });

              if (!res.ok) {
                  throw new Error(`Error fetching thesis data: ${res.statusText}`);
              }
              return res.json();
            
          } catch (error) {
              throw new Error(`Error fetching thesis data: ${error}`);
          }
        }
    }),
    getAllMateriasByCarrera : defineAction({
        input: z.object({
            id: z.string(),
        }),
        handler: async (input,context) => {
            try {
              const res = await fetch(`http://${SERVER_ADDRESS}/materias/${input.id}/all`,{
                  method: "GET",
                  headers: context.request.headers
              });

              if (!res.ok) {
                  throw new Error(`Error fetching thesis data: ${res.statusText}`);
              }
              return res.json();
            
          } catch (error) {
              throw new Error(`Error fetching thesis data: ${error}`);
          }
        }
    }),
    getAll: defineAction({
       handler: async (input, context) => {
            const res = await fetch(`http://${SERVER_ADDRESS}/materias/all`, {
                method: "GET",
                headers: context.request.headers
            });
            
            if (!res.ok) {
                throw new Error(`Error fetching thesis data: ${res.statusText}`);
            }

            const materias = await res.json();

            const materiasObj = Object.assign({}, ...(materias as IMaterias[]).map(materia=> ({
                [materia.codigo]: {
                    nombre: materia.nombre,
                    info: materia.info,
                    uc: materia.uc,
                    horas: materia.horas_estudio,
                    electiva: materia.electiva,
                    nucleo: materia.nucleo,
                    departamento: materia.departamento,
                    semestre: materia.semestre,
                    uc_requeridas: (materia.uc_requeridas) ? materia.uc_requeridas : 0,
                    prelaciones: materia.prelaciones,
                    desbloqueables: materia.desbloqueables
                }
                })));

            // const resData = await res.json() as IMaterias[];

            // let data = {} as IMateriasBySemester

            // for (const materia of resData ) {
            //     if (!data[materia.semestre]) {
            //         data[materia.semestre] = [];
            //     }
            //    data[materia.semestre].push(materia);
            // }


            return materiasObj as IMateriasObject;
        }
    })
}