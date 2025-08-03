import { useRef } from "preact/hooks";
import type { IMateriasObject } from "../schemas/materias";
import html2canvas from 'html2canvas';
import Close from "../assets/close.svg";

type RecomendationWindowProps = {
  materias: IMateriasObject
  codigo_sel: string[];
  codigos_recomendadas: string[];
  electivas: number;
  ShowRecomendation: boolean;
  setShowRecomendation: (value: boolean) => void;
};

export const RecomendationWindow= ({materias, codigo_sel, codigos_recomendadas, electivas, ShowRecomendation, setShowRecomendation }: RecomendationWindowProps) => {
  
  const windowRef = useRef()

  let uc_totales: number = 0;
  
  codigos_recomendadas.forEach(materia =>(
    uc_totales += materias[materia].uc
  ))

const handleCapture = async () =>{
   const canvas = await html2canvas(windowRef.current, { allowTaint: true });
    const dataURL = canvas.toDataURL("image/png");

    const link = document.createElement('a');
    link.href = dataURL;
    link.download = 'screenshot.png';
    link.click();
}
  
  return (
    <div className="bg-black/50 w-full h-full fixed inset-0 z-10 flex items-center justify-center">
      <div className="flex flex-col w-45/100 h-7/10 bg-white justify-between border-3 gap-3 border-primary rounded-xl">
      <button className="flex justify-center mt-3 mr-3 self-end "
       onClick={() => setShowRecomendation(!ShowRecomendation)}>
        <img src={Close.src} alt="close" className="m-2 w-6 h-6"/>
      </button>
        <div ref={windowRef} className="flex w-full justify-between p-8 pt-0">
          <div className="flex flex-col w-45/100 gap-2">
            <h2 className="text-primary font-DmSans font-semibold">
                Materias Seleccionadas
            </h2>
            {codigo_sel.map(materia => (
              <p className="text-primary">
                {materia} - {materias[materia].nombre}
              </p>
            ))}
          </div>
          <div className="flex flex-col w-45/100 gap-2">
            <div className="flex flex-col gap-2">
              <h2 className="text-primary font-DmSans font-semibold">
                Materias Recomendadas
            </h2>
              {codigos_recomendadas.map(materia =>(
                <p className="text-accent-100">
                  {materia} - {materias[materia].nombre}: {materias[materia].uc} UC
                </p>
              ))}
            </div>
            <div>
              <p>
                <span className="text-primary font-bold mr-2">
                  Electivas seleccionadas:
                </span>
                  {electivas}
              </p>
            </div>
            <div>
              <p>
                <span className="text-primary font-bold mr-2">
                  Unidades Credito totales:
                </span>
                  {uc_totales}
              </p>
            </div> 

          </div>
          
        </div>
        <button className="bg-primary rounded-2xl text-white h-[50px] w-[200px] m-8 border-3 border-primary hover:bg-white hover:text-primary active:bg-primary active:text-white  " onClick={handleCapture}>Descargar resumen</button>
      </div>
    </div>
  )
} 