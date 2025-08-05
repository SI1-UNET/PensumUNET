import React, { useEffect, useRef, useState } from "react";
import type { IMateriasBest, IMateriasBySemester, IMateriasObject } from "../schemas/materias"
import { getBestPath, getBestPathIntesivo, getDesbloqueablesDeMateria, getPrelacionesDeMateria } from "../utils/graph";
import { getMateriasBySemester } from "../utils/classifiers";
import { getRemainingSemestres, getUC } from "../utils/misc";
import { RecomendationWindow } from "./recommendation";
import { set } from "zod/v4";
import { MateriaNode } from "./node";

type PropsInfo = {
  materias: IMateriasObject
}

type PropsPlanner = PropsInfo & {
  uc_total: number
}

export const GraphInfo= ({materias}: PropsInfo) =>{
  
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
    <div className="flex gap-32 h-full overflow-x-scroll px-8">
      {Object.entries(materiasBySemester).map(([semester, materiasList]) =>
       (
        <div className="flex flex-col p-2 py-6" key={semester}>
          <h2 className="font-dm-sans text-secondary text-3xl mb-4">Semestre {semester}</h2>
          <ul className="flex flex-col gap-8">
           {Object.entries(materiasList as IMateriasObject).map(
            ([codigo, materia]) => (
              <div className="flex relative"> 
              <li className={`flex relative justify-between rounded-lg w-[300px] border-3 text-white text-sm cursor-pointer  
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
                <span className={`w-full  p-2
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
                <span className={`flex items-center justify-center  font-bold w-[60px] py-1 text-center
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
                  <div className="flex absolute flex-col w-full top-full bg-white  border-3 border-black text-black z-3 rounded-lg rounded-tl-none">
                    <div className="bg-black text-white p-2">
                      {materia.departamento}
                    </div>
                    <div className="p-2">
                      <p>
                        <span className="font-bold">Codigo:</span> {codigo}
                      </p>
                      <p>
                        {/* @ts-ignore*/}
                        <span className="font-bold">Info:</span> {materia.info.split("/").map((line, idx) => (
                          <span key={idx}>
                            {line}
                            {/* @ts-ignore*/}
                            {idx < materia.info.split("/").length - 1 && <br />}
                          </span>
                        ))}
                      </p>
                      <p>
                        <span className="font-bold">Nucleo:</span> {materia.nucleo}
                      </p>
                      <p>
                        <span className="font-bold">UC Requeridas:</span> {materia.uc_requeridas} 
                      </p>
                       <p>
                        <span className="font-bold">Electiva:</span> {materia.electiva ? "Si" : "No"} 
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

export const GraphPlanner= ({materias, uc_total}: PropsPlanner) =>{
  
  const materiasBySemester = getMateriasBySemester(materias);

  const [materiasSelected, setMateriasSelected] = useState<string[]>([]);
  const [materiasRecomendadas, setMateriasRecomendadas] = useState<string[]>([]);
  const [vistas, setVistas] = useState<string[]>([]);
  const [intensivo, setIntensivo] = useState<boolean>(false)
  const [maximasUC, setMaximasUC] = useState<number>(0);
  const [uc, setUC] = useState<number>(0);
  const [electivaRecomendadas, setElectivaRecomendadas] = useState<number>(0);
  const [electivasVistas, setElectivasVistas ] = useState<number>(0);
  const [semestresRestantes, setSemestresRestantes] = useState<number>(0);
  const [recommendationDone, setRecommentadionDone] = useState<boolean>(false)  
  const [showRecomendation, setShowRecomendation] = useState<boolean>(false);

 

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
    let uc_aprobadas =getUC(materias, [...materiasSelected, ...vistas]) + electivasVistas*2
    setUC(uc_aprobadas);

    if(!intensivo || (intensivo && maximasUC <= 10)){
    const materiasBestArray: IMateriasBest[]  = !intensivo ? getBestPath(materias, materiasSelected, maximasUC, uc_aprobadas) : getBestPathIntesivo(materias, materiasSelected, maximasUC, uc_aprobadas)
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
    setSemestresRestantes(getRemainingSemestres(getUC(materias, [...materiasSelected, ...vistas])+ electivasVistas*2 , uc_total ,maximasUC));
    setRecommentadionDone(true);
  }
  else{
    alert("El maximo de UC a cursar en un intensivo es 10UC")
  }
  }

  const nodeTypes = {
  materia: MateriaNode,
};

function materiasToNodes(
  materiasList: IMateriasObject,
  materiasSelected: string[],
  vistas: string[],
  materiasRecomendadas: string[],
  handleMateriaClick: (codigo: string) => void
) {
  return Object.entries(materiasList)
    .filter(([_, materia]) => !materia.electiva)
    .map(([codigo, materia], idx) => ({
      id: codigo,
      type: "materia",
      position: { x: 0, y: idx * 100 }, // Stack vertically
      data: {
        materia,
        codigo,
        materiasSelected,
        vistas,
        materiasRecomendadas,
        handleMateriaClick,
      },
    }));
}

  return(
    <div className="flex relative gap-32 h-full overflow-x-scroll px-8">
      
      {(Object.entries(materiasBySemester) as [string, IMateriasObject][]).map(([semester, materiasList]) => (
        <div  className="flex flex-col p-2 py-6" key={semester}>
          <h2 className="font-dm-sans text-secondary text-3xl mb-4">Semestre {semester}</h2>
          <ul className="flex flex-col gap-8">
           {Object.entries(materiasList).map(
            ([codigo, materia]) => (
              materia.electiva 
              ? null 
              :
              <li className={`flex relative justify-between rounded-lg w-[300px] border-3 text-white text-sm cursor-pointer active:scale-98
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
                <span className={`w-full  p-2
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
                <span className={`flex items-center justify-center  font-bold min-w-[50px] py-1 text-center
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
            <>
            <li className={`flex relative justify-between rounded-lg w-[300px] border-3 text-white text-sm cursor-pointer 
                ${
                  electivaRecomendadas > 0  
                  ? "border-accent-100"
                  : "border-secondary"
                  }
                  `}
               >
                <span className={`w-full px-2 py-6 
                  ${
                  electivaRecomendadas > 0
                  ? "bg-accent-100"
                  : "bg-secondary"
                  }
                `}>
                  Electivas Recomendadas
                </span>
                <span className={`flex items-center justify-center  font-bold min-w-[50px] py-1 text-center
                  ${
                  electivaRecomendadas > 0
                  ? "text-accent-100"
                  : "text-secondary"
                  }
                  `}>{electivaRecomendadas}
                </span>
                </li>
                <li className={`flex relative justify-between rounded-lg w-[300px] border-3 text-white text-sm cursor-pointer 
                ${
                  electivasVistas > 0  
                  ? "border-primary outline-3 outline-primary outline-offset-6" 
                  : "border-secondary"
                  }
                  `}
               >
                <span className={`w-full px-2 py-6 
                  ${
                  electivasVistas > 0
                  ? "bg-primary"
                  : "bg-secondary"
                  }
                `}>
                  Electivas Vistas
                </span>
                <input 
                  type="number"
                  min="0"
                  max="10"
                  className={`flex items-center justify-center font-bold min-w-[50px] py-1 text-center border-none outline-none
                    ${
                    electivasVistas > 0
                    ? "text-primary"
                    : "text-secondary"
                    }
                    `}
                    value={electivasVistas}
                    onChange={e => setElectivasVistas(Number(e.currentTarget.value))}
                  />
                
                  
              </li>
              </>
            }
          </ul>
        </div>
      ))}
  
      { recommendationDone &&
        <button 
          className="fixed left-12 bottom-6 bg-primary rounded-lg text-white h-[50px] w-[245px] border-3 border-primary cursor-pointer hover:bg-white hover:text-primary active:bg-primary active:text-white active:scale-95"
          onClick={() => setShowRecomendation(!showRecomendation)}
          >
            Mostrar Resumen
        </button>
      }
    
      <button className="fixed right-12 bottom-40 flex justify-between rounded-lg w-[245px] border-3 border-primary bg-white text-white cursor-pointer"
        onClick={() => setIntensivo(!intensivo)}>
        <span className="w-full p-2 bg-primary"> 
          Intensivo 
        </span>
        <span className="flex items-center justify-center font-bold min-w-[50px] text-center text-primary" >
          {intensivo ? "Si" : "No"}
        </span>
      </button>
      <div className="fixed right-12 bottom-26 flex justify-between rounded-lg w-[245px] border-3 border-primary text-white cursor-pointer bg-white">
        <span className="w-full p-2 bg-primary">
          Maximas UC a cursar
        </span>
        <input
          type="number"
          min="0"
          className="flex items-center justify-center font-bold w-[50px] text-center text-primary  border-none outline-none appearance-none"
          style={{
            WebkitAppearance: "none",
            MozAppearance: "textfield",
          }}
          value={maximasUC}
          onChange={e => setMaximasUC(Number(e.currentTarget.value))}
        />
      </div>
      <button className="fixed right-12 p-2 bg-primary bottom-12 flex justify-between rounded-lg w-[245px] border-3 border-primary text-white cursor-pointer text-center"
        onClick={handlePlanner}
      >
          <p className="w-full text-center">Calcular</p>
      </button>
      {showRecomendation &&
      <RecomendationWindow 
        materias={materias} 
        codigo_sel={materiasSelected} 
        codigos_recomendadas={materiasRecomendadas} 
        electivas_recomendadas={electivaRecomendadas}
        electivas_vistas={electivasVistas} 
        uc_aprobadas={uc}
        semestres_restantes={semestresRestantes}
        intensivo={intensivo}
        ShowRecomendation={showRecomendation}
        setShowRecomendation={setShowRecomendation}/>
      }
      </div>

  )

}