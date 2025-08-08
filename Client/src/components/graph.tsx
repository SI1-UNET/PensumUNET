import { useEffect, useMemo, useRef, useState } from "preact/hooks";
import type { IMateriasBest, IMateriasBySemester, IMateriasObject } from "../schemas/materias"
import { getBestPath, getBestPathIntesivo, getDesbloqueablesDeMateria, getMissingMateria, getPrelacionesDeMateria } from "../utils/graph";
import { getMateriasBySemester } from "../utils/classifiers";
import { getRemainingSemestres, getUC } from "../utils/misc";
import { RecomendationWindow } from "./recommendation";
import { set } from "zod/v4";
import { MateriaNode } from "./node";
import { Background, Controls, MiniMap, ReactFlow } from "@xyflow/react";
import { json } from "zod/v4-mini";
// import * as d3 from "d3";

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
  const [desbloqueablesDirectas, setDesbloqueablesDirectas] = useState<string[]>([])
  const [prelaciones, setPrelaciones] = useState<string[]>([]);
  const [prelacionesDirectas, setPrelacionesDirectas] = useState<string[]>([]);
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
      setPrelacionesDirectas(materias[codigo].prelaciones)
      console.log(materiaPrelArray)
      getDesbloqueablesDeMateria(materias, codigo, materiaDesArray);
      setDesbloqueables(materiaDesArray);
      setDesbloqueablesDirectas(materias[codigo].desbloqueables)
      
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
                  : prelacionesDirectas.includes(codigo)
                  ? "border-primary outline-x"
                  : prelaciones.includes(codigo)  
                  ? "border-primary-100"
                  : desbloqueablesDirectas.includes(codigo)
                  ? "border-accent-100 outline-x-green " 
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
                  : materiaPrel === codigo || prelacionesDirectas.includes(codigo)
                  ? "bg-primary"
                  : prelaciones.includes(codigo)  
                  ? "bg-primary-100"
                  : desbloqueablesDirectas.includes(codigo)
                  ? "bg-accent-100"
                  : desbloqueables.includes(codigo)
                  ? "bg-accent"
                  : "bg-secondary"
                  }
                `}> {materia.nombre}</span>
                <span className={`flex items-center justify-center  font-bold w-[60px] py-1 text-center
                  ${
                  materiaPrel == null 
                  ? "text-primary"
                  : materiaPrel === codigo || prelacionesDirectas.includes(codigo)
                  ? "text-primary"
                  : prelaciones.includes(codigo) 
                  ? "text-primary-100"
                  : desbloqueablesDirectas.includes(codigo)
                  ? "text-accent-100"
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

  useEffect(() => {
    const carrera = window.location.pathname.split('/').pop();
    if(localStorage.getItem('carrera') == carrera ){
      const materias_seleccionadas = localStorage.getItem('materias_seleccionadas');
      setMateriasSelected(materias_seleccionadas ? JSON.parse(materias_seleccionadas) : []);
      const vistas = localStorage.getItem('vistas');
      setVistas(vistas ? JSON.parse(vistas) : []);
    }
  }, []);

  const handleMateriaClick = (codigo: string) => {
    let materias_vistas = [] as string[];
    
    if(materiasSelected.includes(codigo)) {
      setMateriasSelected(prev => prev.filter(item => item !== codigo));
      getPrelacionesDeMateria(materias, codigo, materias_vistas);
      setVistas(prev => {
          let result = [...prev];
          for (const vista of materias_vistas) {
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
      getPrelacionesDeMateria(materias, codigo, materias_vistas);
      setVistas(prev => [...prev, ...materias_vistas]);
    }
};

  const handlePlanner = () => {
    let materiasBestCode: string[] = [];
    let uc_aprobadas =getUC(materias, [...materiasSelected, ...vistas]) + electivasVistas*2
    setUC(uc_aprobadas);
    let materias_visitadas = [] as string[]
    let materias_olvidadas = [] as string[]
   
    materiasSelected.forEach(codigo => {
      getMissingMateria(materias, codigo, materiasSelected, materias_olvidadas, materias_visitadas);
      
    });

    materias_olvidadas = materias_olvidadas.filter(codigo =>
        !(
          materias[codigo].desbloqueables.every(desbloqueable =>
            materias_visitadas.includes(desbloqueable)
          )
        )
      );

    let materias_a_evaluar = materiasSelected.concat(materias_olvidadas)
    setMateriasSelected(materias_a_evaluar)

    if(!intensivo || (intensivo && maximasUC <= 10)){
    const materiasBestArray: IMateriasBest[]  = !intensivo ? getBestPath(materias, materias_a_evaluar, maximasUC, uc_aprobadas) : getBestPathIntesivo(materias, materias_a_evaluar, maximasUC, uc_aprobadas)
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
    setSemestresRestantes(getRemainingSemestres(getUC(materias, [...materias_a_evaluar, ...vistas])+ electivasVistas*2 , uc_total ,maximasUC));
    setRecommentadionDone(true);
    localStorage.setItem('materias_seleccionadas', JSON.stringify(materiasSelected))
    localStorage.setItem('vistas', JSON.stringify(vistas))
  }
  else{
    alert("El maximo de UC a cursar en un intensivo es 10UC")
  }
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


// export const GraphInfoD3 = ({ materias }: PropsInfo) => {
    
//   const materiasBySemester = getMateriasBySemester(materias) || {};
  
//   const [materiaPrel, setMateriaPrel] = useState<string | null>(null);
//   const [desbloqueables, setDesbloqueables] = useState<string[]>([]);
//   const [prelaciones, setPrelaciones] = useState<string[]>([]);
//   const [materiaHover, setMateriaHover] = useState<string | null>(null);
  
//   const handleMateriaClick = (codigo: string) => {
//     let materiaPrelArray = [] as string[];
//     let materiaDesArray =[] as string[];
//     if(codigo == materiaPrel) {
//       setMateriaPrel(null);
//       setPrelaciones([]);
//       setDesbloqueables([]);
//     }
//     else {
//       setMateriaPrel(codigo);
      
//       getPrelacionesDeMateria(materias, codigo, materiaPrelArray);
//       setPrelaciones(materiaPrelArray);
//       console.log(materiaPrelArray)
//       getDesbloqueablesDeMateria(materias, codigo, materiaDesArray);
//       setDesbloqueables(materiaDesArray);
      
//     }
// };


//   const containerRef = useRef<HTMLDivElement>(null);
//   const [nodePositions, setNodePositions] = useState<{ [codigo: string]: { x: number; y: number } }>({});
//   const svgRef = useRef<SVGSVGElement>(null);

//   const edges: { from: string; to: string }[] = [];
//   Object.entries(materias).forEach(([codigo, materia]) => {
//     if (materia.prelaciones) {
//       materia.prelaciones.forEach((prel: string) => {
//         edges.push({ from: prel, to: codigo });
//       });
//     }
//   });

//   useEffect(() => {
//   if (!containerRef.current) return;
//   const positions: { [codigo: string]: { x: number; y: number; left: number; right: number; top: number; bottom: number; width: number; height: number } } = {};
//   Object.keys(materias).forEach((codigo) => {
//     const el = document.getElementById(`materia-node-${codigo}`);
//     if (el && containerRef.current) {
//       const rect = el.getBoundingClientRect();
//       const containerRect = containerRef.current.getBoundingClientRect();
//       positions[codigo] = {
//         x: rect.left - containerRect.left + rect.width / 2,
//         y: rect.top - containerRect.top + rect.height / 2,
//         left: rect.left - containerRect.left,
//         right: rect.right - containerRect.left,
//         top: rect.top - containerRect.top,
//         bottom: rect.bottom - containerRect.top,
//         width: rect.width,
//         height: rect.height,
//       };
//     }
//   });
//   setNodePositions(positions);
// }, [materias, materiasBySemester]);

// useEffect(() => {
//   if (!svgRef.current) return;
//   const svg = d3.select(svgRef.current);
//   svg.selectAll("g.arrow").remove();

//   const edgesByTarget: { [to: string]: { from: string }[] } = {};
//   edges.forEach(edge => {
//     if (!edgesByTarget[edge.to]) edgesByTarget[edge.to] = [];
//     edgesByTarget[edge.to].push(edge);
//   });

//   Object.entries(edgesByTarget).forEach(([to, incomingEdges]) => {
//     const target = nodePositions[to];
//     if (!target) return;


//     const leftEdges = incomingEdges.filter(edge => {
//       const from = nodePositions[edge.from];
//       return from && from.right < target.left;
//     });
//     const otherEdges = incomingEdges.filter(edge => {
//       const from = nodePositions[edge.from];
//       return !from || from.right >= target.left;
//     });

//     if (leftEdges.length > 0) {
//       const sourceYs = leftEdges
//         .map(edge => nodePositions[edge.from]?.top + nodePositions[edge.from]?.height / 2)
//         .filter(y => y !== undefined) as number[];
//       if (sourceYs.length > 0) {
//         const busY = sourceYs.reduce((a, b) => a + b, 0) / sourceYs.length;
//         const BUS_MARGIN = 30;
//         const busX = target.left - BUS_MARGIN;

//         svg.append("g")
//           .attr("class", "arrow")
//           .append("line")
//           .attr("x1", busX)
//           .attr("y1", Math.min(...sourceYs))
//           .attr("x2", busX)
//           .attr("y2", Math.max(...sourceYs))
//           .attr("stroke", "#6891b4")
//           .attr("stroke-width", 1.5);

//         svg.append("g")
//           .attr("class", "arrow")
//           .append("line")
//           .attr("x1", busX)
//           .attr("y1", busY)
//           .attr("x2", target.left)
//           .attr("y2", target.top + target.height / 2)
//           .attr("stroke", "#6891b4")
//           .attr("stroke-width", 1.5)
//           .attr("marker-end", "url(#arrowhead-merged)");

//         leftEdges.forEach((edge) => {
//           const from = nodePositions[edge.from];
//           if (!from) return;
//           const x1 = from.right;
//           const y1 = from.top + from.height / 2;
//           svg.append("g")
//             .attr("class", "arrow")
//             .append("polyline")
//             .attr("points", `${x1},${y1} ${busX},${y1}`)
//             .attr("fill", "none")
//             .attr("stroke", "#6891b4")
//             .attr("stroke-width", 1.5);
//         });
//       }
//     }

//     otherEdges.forEach(edge => {
//   const from = nodePositions[edge.from];
//   if (!from) return;

//   const ARROW_MARGIN = 8;
//   const HORIZONTAL_OFFSET = 100;

//   const x1 = from.right + ARROW_MARGIN;
//   const y1 = from.top + from.height / 2;

//   const x4 = target.left - ARROW_MARGIN;
//   const y4 = target.top + target.height / 2;

//   const x2 = x1 + HORIZONTAL_OFFSET;
//   const y2 = y1;
//   const x3 = x2;
//   const y3 = y4;

//   svg.append("g")
//     .attr("class", "arrow")
//     .append("polyline")
//     .attr("points", `${x1},${y1} ${x2},${y2} ${x3},${y3} ${x4},${y4}`)
//     .attr("fill", "none")
//     .attr("stroke", "#6891b4")
//     .attr("stroke-width", 1.5)
//     .attr("marker-end", "url(#arrowhead-merged)");
// });
//   });

//   // Add a single marker definition for merged arrows
//   svg.append("defs").append("marker")
//     .attr("id", "arrowhead-merged")
//     .attr("markerWidth", 10)
//     .attr("markerHeight", 7)
//     .attr("refX", 10)
//     .attr("refY", 3.5)
//     .attr("orient", "auto")
//     .attr("markerUnits", "strokeWidth")
//     .append("polygon")
//     .attr("points", "0 0, 10 3.5, 0 7")
//     .attr("fill", "#6891b4");

// }, [nodePositions, edges]);



//   return (
//     <div className="relative" ref={containerRef}>
//      <svg
//         ref={svgRef}
//         className="absolute top-0 left-0 w-full h-full pointer-events-none z-0"
//       ></svg>

//       <div className="flex gap-32 h-full overflow-x-scroll px-8">
//         {Object.entries(getMateriasBySemester(materias)).map(([semester, materiasList]: [string, IMateriasObject[]]) => (
//           <div className="flex flex-col p-2 py-6" key={semester}>
//             <h2 className="font-dm-sans text-secondary text-3xl mb-4">Semestre {semester}</h2>
//              <ul className="flex flex-col gap-8">
//            {Object.entries(materiasList as IMateriasObject).map(
//             ([codigo, materia]) => (
//               <div className="flex relative"> 
//               <li 
//               id={`materia-node-${codigo}`}
//               className={`flex relative justify-between rounded-lg w-[300px] border-3 text-white text-sm cursor-pointer  
//                 ${
//                   materiaPrel == null 
//                   ? "border-primary" 
//                   : materiaPrel === codigo 
//                   ? "border-primary outline-3 outline-primary outline-offset-6" 
//                   : prelaciones.includes(codigo)  
//                   ? "border-primary-100"
//                   : desbloqueables.includes(codigo)
//                   ? "border-accent"
//                   : "border-secondary"
//                   }
//                   `}
//                key={codigo} 
//                onClick={() => handleMateriaClick(codigo)}
//                onMouseEnter={() => setMateriaHover(codigo)}
//                onMouseLeave={() => setMateriaHover(null)}
//                >
//                 <span className={`w-full  p-2
//                   ${materiaPrel == null 
//                   ? "bg-primary" 
//                   : materiaPrel === codigo 
//                   ? "bg-primary"
//                   : prelaciones.includes(codigo)  
//                   ? "bg-primary-100"
//                   : desbloqueables.includes(codigo)
//                   ? "bg-accent"
//                   : "bg-secondary"
//                   }
//                 `}> {materia.nombre}</span>
//                 <span className={`flex items-center justify-center  font-bold w-[60px] py-1 text-center
//                   ${
//                   materiaPrel == null 
//                   ? "text-primary"
//                   : materiaPrel === codigo 
//                   ? "text-primary"
//                   : prelaciones.includes(codigo) 
//                   ? "text-primary-100"
//                   : desbloqueables.includes(codigo)
//                   ? "text-accent"
//                   : "text-secondary"
//                   }
//                   `}>{materia.uc} UC</span>

//                   {materiaHover === codigo && 
//                   <div className="flex absolute flex-col w-full top-full bg-white  border-3 border-black text-black z-3 rounded-lg rounded-tl-none">
//                     <div className="bg-black text-white p-2">
//                       {materia.departamento}
//                     </div>
//                     <div className="p-2">
//                       <p>
//                         <span className="font-bold">Codigo:</span> {codigo}
//                       </p>
//                       <p>
//                         {/* @ts-ignore*/}
//                         <span className="font-bold">Info:</span> {materia.info.split("/").map((line, idx) => (
//                           <span key={idx}>
//                             {line}
//                             {/* @ts-ignore*/}
//                             {idx < materia.info.split("/").length - 1 && <br />}
//                           </span>
//                         ))}
//                       </p>
//                       <p>
//                         <span className="font-bold">Nucleo:</span> {materia.nucleo}
//                       </p>
//                       <p>
//                         <span className="font-bold">UC Requeridas:</span> {materia.uc_requeridas} 
//                       </p>
//                        <p>
//                         <span className="font-bold">Electiva:</span> {materia.electiva ? "Si" : "No"} 
//                       </p>
//                     </div>
//                   </div>
//                   }
//               </li>
              
//               </div>
//             ))}
//           </ul>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };