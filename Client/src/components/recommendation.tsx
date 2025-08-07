import { useRef } from "preact/hooks";
import type { IMateriasObject } from "../schemas/materias";
import html2canvas from 'html2canvas';
import Close from "../assets/close.svg";

type RecomendationWindowProps = {
  materias: IMateriasObject
  codigo_sel: string[];
  codigos_recomendadas: string[];
  electivas_vistas: number;
  electivas_recomendadas: number;
  uc_aprobadas: number;
  semestres_restantes: number;
  intensivo: boolean;
  ShowRecomendation: boolean;
  setShowRecomendation: (value: boolean) => void;
};

export const RecomendationWindow= ({materias, codigo_sel, codigos_recomendadas, electivas_recomendadas, electivas_vistas,uc_aprobadas,semestres_restantes, intensivo, ShowRecomendation, setShowRecomendation }: RecomendationWindowProps) => {
  
  const windowRef = useRef<HTMLDivElement | null>(null)

  let uc_totales: number = 0;
  
  codigos_recomendadas.forEach(materia =>(
    uc_totales += materias[materia].uc
  ))

const handleCapture = async () => {
  if (windowRef.current) {
    const canvas = await html2canvas(windowRef.current, { allowTaint: true });
    const dataURL = canvas.toDataURL("image/png");

    const link = document.createElement('a');
    link.href = dataURL;
    link.download = 'screenshot.png';
    link.click();
  }
}
  
  return (
    <div className="bg-black/50 w-full h-full fixed inset-0 z-10 flex items-center justify-center">
      <div className="flex flex-col w-45/100 max-h-8/10 bg-white justify-between border-3 gap-3 p-1 border-primary rounded-xl">
      <button className="flex justify-center mt-3 mr-3 self-end cursor-pointer"
       onClick={() => setShowRecomendation(!ShowRecomendation)}>
        <img src={Close.src} alt="close" className="m-2 w-6 h-6"/>
      </button>
      <div className="overflow-y-scroll scrollbar-thin scrollbar-thumb-primary scrollbar-track-secondary">
        <div ref={windowRef} className="flex flex-col w-full p-8 pt-0 ">
          <div className="flex w-full justify-between">
            <div className="flex flex-col w-45/100 gap-2">
              <div className="flex flex-col gap-2 mb-4 ">
                <h2 className="text-primary font-dm-sans font-bold text-xl">
                    Materias Seleccionadas
                </h2>
                {codigo_sel.map(materia => (
                  <p className="text-primary">
                    {materia} - {materias[materia].nombre}
                  </p>
                ))}
              </div>
              <p>
                <span className="text-primary font-bold mr-2">
                  Electivas Vistas:
                </span>
                    {electivas_vistas}
                </p>
                <p>
                  <span className="text-primary font-bold mr-2">
                    Unidades Credito totales:
                  </span>
                    {uc_aprobadas}
                </p>
            </div>
            <div className="border-r-1 border-primary"/>
            <div className="flex flex-col w-45/100 gap-2">
              <div className="flex flex-col gap-2 mb-4">
                <h2 className="text-primary font-dm-sans font-bold text-xl">
                  Materias Recomendadas
                </h2>
                {codigos_recomendadas.map(materia =>(
                  (!materias[materia].electiva ? 
                  <p className="text-accent-100 font-medium">
                    {materia} - {materias[materia].nombre}: {materias[materia].uc} UC
                  </p>
                  : null)
                ))}
              </div>
                <p>
                  <span className="text-primary font-bold mr-2">
                    Electivas Recomendadas:
                  </span>
                    {electivas_recomendadas}
                </p>
                <p>
                  <span className="text-primary font-bold mr-2">
                    Unidades Credito recomendadas:
                  </span>
                    {uc_totales}
                </p>

            </div>         
          </div>
          <div className="flex w-full justify-between pt-4 mt-4 border-t-1 border-primary">
              <div className="flex flex-col w-45/100 gap-2">
                {!intensivo &&
                  <p>
                    <span className="text-primary font-bold mr-2">
                      Semestres restantes con <br/>
                      carga similar:
                    </span>
                      {semestres_restantes}
                  </p>
                }
              </div>
              <p className="w-45/100">
                <span className="text-primary font-bold mr-2">
                  UC aprobadas con la recomendación:
                </span>
                  {uc_aprobadas + uc_totales}
              </p>
          </div>
          
        </div>
      </div>
      <button className="bg-primary rounded-2xl p-2 text-white h-[50px] w-[200px] m-8 border-3 border-primary cursor-pointer hover:bg-white hover:text-primary active:bg-primary active:text-white active:scale-95  " onClick={handleCapture}>
        Descargar resumen
      </button>
      </div>
    </div>
  )
} 