import { useEffect, useRef, useState } from "preact/hooks";
import type { IMateriasBest, IMateriasBySemester, IMateriasObject } from "../schemas/materias"
import { getBestPath, getDesbloqueablesDeMateria, getPrelacionesDeMateria } from "../utils/graph";
import { getMateriasBySemester } from "../utils/classifiers";

type Props = {
  materias: IMateriasObject
}

export const GraphInfo= ({materias}: Props) =>{
  
  const materiasBySemester = getMateriasBySemester(materias);

  const [materiaPrel, setMateriaPrel] = useState<string | null>(null);
  const [desbloqueables, setDesbloqueables] = useState<string[]>([]);
  const [prelaciones, setPrelaciones] = useState<string[]>([]);
  const [materiaHover, setMateriaHover] = useState<string | null>(null);
  
  const handleMateriaClick = (codigo: string) => {
    let materiaPrelArray = [] as string[];
    let materiaDesArray =[] as string[];
    if(codigo == materiaPrel) {
      setMateriaPrel(null);
      setPrelaciones([]);
      setDesbloqueables([]);
    }
    else {
      setMateriaPrel(codigo);
      
      getPrelacionesDeMateria(materias, codigo, materiaPrelArray);
      setPrelaciones(materiaPrelArray);
      console.log(materiaPrelArray)
      getDesbloqueablesDeMateria(materias, codigo, materiaDesArray);
      setDesbloqueables(materiaDesArray);
      
    }
};

  return(
    <div class="flex gap-32 h-full overflow-x-scroll px-8">
      {Object.entries(materiasBySemester).map(([semester, materiasList]: [string, IMateriasObject[]]) => (
        <div class="flex flex-col p-2 py-6" key={semester}>
          <h2 class="font-DmSans text-secondary text-2xl mb-3">Semestre {semester}</h2>
          <ul class="flex flex-col gap-8">
           {Object.entries(materiasList).map(
            ([codigo, materia]: [string, IMateriasObject]) => (
              <div class="flex relative"> 
              <li class={`flex relative justify-between rounded-lg w-[300px] border-3 text-white text-sm cursor-pointer 
                ${
                  materiaPrel == null 
                  ? "border-primary" 
                  : materiaPrel === codigo 
                  ? "border-primary outline-3 outline-primary outline-offset-6" 
                  : prelaciones.includes(codigo)  
                  ? "border-primary-100"
                  : desbloqueables.includes(codigo)
                  ? "border-accent"
                  : "border-secondary"
                  }
                  `}
               key={codigo} 
               onClick={() => handleMateriaClick(codigo)}
               onMouseEnter={() => setMateriaHover(codigo)}
               onMouseLeave={() => setMateriaHover(null)}
               >
                <span class={`w-full  p-2
                  ${materiaPrel == null 
                  ? "bg-primary" 
                  : materiaPrel === codigo 
                  ? "bg-primary"
                  : prelaciones.includes(codigo)  
                  ? "bg-primary-100"
                  : desbloqueables.includes(codigo)
                  ? "bg-accent"
                  : "bg-secondary"
                  }
                `}> {materia.nombre}</span>
                <span class={`flex items-center justify-center  font-bold w-[60px] py-1 text-center
                  ${
                  materiaPrel == null 
                  ? "text-primary"
                  : materiaPrel === codigo 
                  ? "text-primary"
                  : prelaciones.includes(codigo) 
                  ? "text-primary-100"
                  : desbloqueables.includes(codigo)
                  ? "text-accent"
                  : "text-secondary"
                  }
                  `}>{materia.uc} UC</span>

                  {materiaHover === codigo && 
                  <div class="flex absolute flex-col w-full top-full bg-white  border-3 border-black text-black z-3 rounded-lg rounded-tl-none">
                    <div class="bg-black text-white p-2">
                      {materia.departamento}
                    </div>
                    <div class="p-2">
                      <p>
                        <span class="font-bold">Codigo:</span> {codigo}
                      </p>
                      <p>
                        <span class="font-bold">Info:</span> {materia.info.split("/").map((line, idx) => (
                          <span key={idx}>
                            {line}
                            {idx < materia.info.split("/").length - 1 && <br />}
                          </span>
                        ))}
                      </p>
                      <p>
                        <span class="font-bold">Nucleo:</span> {materia.nucleo}
                      </p>
                      <p>
                        <span class="font-bold">UC Requeridas:</span> {materia.uc_requeridas} 
                      </p>
                       <p>
                        <span class="font-bold">Electiva:</span> {materia.electiva ? "Si" : "No"} 
                      </p>
                    </div>
                  </div>
                  }


              </li>
              
              </div>
            ))}
          </ul>
        </div>
      ))}
    </div>

  )

}

export const GraphPlanner= ({materias}: Props) =>{
  
  const materiasBySemester = getMateriasBySemester(materias);

  const [materiasSelected, setMateriasSelected] = useState<string[]>([]);
  const [materiasRecomendadas, setMateriasRecomendadas] = useState<string[]>([]);
  const [vistas, setVistas] = useState<string[]>([]);
  const [intensivo, setIntensivo] = useState<boolean>(false)
  const [maximasUC, setMaximasUC] = useState<number>(0);
  const [uc, setUC] = useState<number>(0);
  const [electivaRecomendadas, setElectivaRecomendadas] = useState<number>(0);
 

  const handleMateriaClick = (codigo: string) => {
    let materiasVistas = [] as string[];

    if(materiasSelected.includes(codigo)) {
      setMateriasSelected(prev => prev.filter(item => item !== codigo));
      getPrelacionesDeMateria(materias, codigo, materiasVistas);
      setVistas(prev => {
          let result = [...prev];
          for (const vista of materiasVistas) {
            const idx = result.indexOf(vista);
            if (idx !== -1) {
              result.splice(idx, 1); 
            }
          }
          return result;
        });
    }
    else {
      setMateriasSelected(prev => [...prev, codigo]);
      
      getPrelacionesDeMateria(materias, codigo, materiasVistas);
      setVistas(prev => [...prev, ...materiasVistas]);
   
      
    }
};

  const handlePlanner = () => {
    let materiasBestCode: string[] = [];
    const materiasBestArray: IMateriasBest[]  = getBestPath(materias, materiasSelected, maximasUC, uc)
    materiasBestArray.forEach((materia) => {
      materiasBestCode.push(materia.codigo);
    })
    let electivas = 0 
    materiasBestCode.map((codigo) => {
      if(materias[codigo].electiva) {
        electivas++;
      }})
    setElectivaRecomendadas(electivas);
    setMateriasRecomendadas(materiasBestCode);
  }

  return(
    <div class="flex relative gap-32 h-full overflow-x-scroll px-8">
      
      {Object.entries(materiasBySemester).map(([semester, materiasList]: [string, IMateriasObject[]]) => (
        <div  class="flex flex-col p-2 py-6" key={semester}>
          <h2 class="font-DmSans text-secondary text-2xl mb-3">Semestre {semester}</h2>
          <ul class="flex flex-col gap-8">
           {Object.entries(materiasList).map(
            ([codigo, materia]: [string, IMateriasObject]) => (
              materia.electiva 
              ? null 
              :
              <li class={`flex relative justify-between rounded-lg w-[300px] border-3 text-white text-sm cursor-pointer 
                ${
                  materiasSelected.includes(codigo) 
                  ? "border-primary outline-3 outline-primary outline-offset-6" 
                  : vistas.includes(codigo) 
                  ? "border-primary-100" 
                  : materiasRecomendadas.includes(codigo)  
                  ? "border-accent-100"
                  : "border-secondary"
                  }
                  `}
           
                key={codigo} 
                onClick={() => handleMateriaClick(codigo)}
               >
                <span class={`w-full  p-2
                  ${
                  materiasSelected.includes(codigo)
                  ? "bg-primary"
                  : vistas.includes(codigo)  
                  ? "bg-primary-100" 
                  : materiasRecomendadas.includes(codigo)  
                  ? "bg-accent-100"
                  : "bg-secondary"
                  }
                `}> {materia.nombre}</span>
                <span class={`flex items-center justify-center  font-bold w-[60px] py-1 text-center
                  ${
                   materiasSelected.includes(codigo) 
                  ? "text-primary" 
                  : vistas.includes(codigo) 
                  ? "text-primary-100" 
                  : materiasRecomendadas.includes(codigo)  
                  ? "text-accent-100"
                  : "text-secondary"
                  }
                  `}>{materia.uc} UC</span>
              </li>
              
      
            ))}
            {  parseInt(semester)== 10 &&
            <li class={`flex relative justify-between rounded-lg w-[300px] border-3 text-white text-sm cursor-pointer 
                ${
                  electivaRecomendadas > 0  
                  ? "border-accent-100"
                  : "border-secondary"
                  }
                  `}
               >
                <span class={`w-full px-2 py-6 
                  ${
                  electivaRecomendadas > 0
                  ? "bg-accent-100"
                  : "bg-secondary"
                  }
                `}>
                  Electivas Recomendadas
                </span>
                <span class={`flex items-center justify-center  font-bold w-[60px] py-1 text-center
                  ${
                  electivaRecomendadas > 0
                  ? "text-accent-100"
                  : "text-secondary"
                  }
                  `}>{electivaRecomendadas}</span>
              </li>
            }
          </ul>
        </div>
      ))}

      <button class="fixed right-12 bottom-54 flex justify-between rounded-lg w-[250px] border-3 border-primary bg-white text-white cursor-pointer"
        onClick={() => setIntensivo(!intensivo)}>
        <span class="w-full p-2 bg-primary"> 
          Intensivo 
        </span>
        <span class="flex items-center justify-center font-bold min-w-[50px] text-center text-primary" >
          {intensivo ? "Si" : "No"}
        </span>
      </button>
      <div class="fixed right-12 bottom-40 flex justify-between rounded-lg w-[250px] border-3 border-primary text-white cursor-pointer bg-white">
        <span class="w-full p-2 bg-primary">
          Maximas UC a cursar
        </span>
        <input
          type="number"
          min="0"
          class="flex items-center justify-center font-bold w-[50px] text-center text-primary  border-none outline-none appearance-none"
          style={{
            WebkitAppearance: "none",
            MozAppearance: "textfield",
          }}
          value={maximasUC}
          onChange={e => setMaximasUC(Number(e.currentTarget.value))}
        />
      </div>
      <div class="fixed right-12 bottom-26 flex justify-between rounded-lg w-[250px] border-3 border-primary text-white cursor-pointer bg-white">
        <span class="w-full p-2 bg-primary">
          UC aprobadas
        </span>
        <input
          type="number"
          min="0"
          class="flex items-center justify-center font-bold w-[50px] text-center text-primary  border-none outline-none appearance-none"
          style={{
            WebkitAppearance: "none",
            MozAppearance: "textfield",
          }}
          value={uc}
          onChange={e => setUC(Number(e.currentTarget.value))}
        />
      </div>
      <button class="fixed right-12 p-2 bg-primary bottom-12 flex justify-between rounded-lg w-[250px] border-3 border-primary text-white cursor-pointer text-center"
        onClick={handlePlanner}
      >
          <p class="w-full text-center">Calcular</p>
      </button>
    </div>

  )

}