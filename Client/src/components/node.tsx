import { Handle, Position } from "@xyflow/react";

type Materia = {
  nombre: string;
  uc: number;

};

type CustomMateriaNodeProps = {
  materia: Materia;
  codigo: string;
  materiasSelected?: string[];
  vistas?: string[];
  materiasRecomendadas?: string[];
  handleMateriaClick?: (codigo: string) => void;
};

export const MateriaNode = ({
  data: {
    materia,
    codigo,
    materiasSelected = [],
    vistas = [],
    materiasRecomendadas = [],
    handleMateriaClick = () => {},
  },
}: { data: CustomMateriaNodeProps }) => {
  const borderClass = materiasSelected.includes(codigo)
    ? "border-primary outline-3 outline-primary outline-offset-6"
    : vistas.includes(codigo)
    ? "border-primary-100"
    : materiasRecomendadas.includes(codigo)
    ? "border-accent-100"
    : "border-secondary";

  const bgClass = materiasSelected.includes(codigo)
    ? "bg-primary"
    : vistas.includes(codigo)
    ? "bg-primary-100"
    : materiasRecomendadas.includes(codigo)
    ? "bg-accent-100"
    : "bg-secondary";

  const textClass = materiasSelected.includes(codigo)
    ? "text-primary"
    : vistas.includes(codigo)
    ? "text-primary-100"
    : materiasRecomendadas.includes(codigo)
    ? "text-accent-100"
    : "text-secondary";

  return (
    <div
      className={`flex relative justify-between rounded-lg w-[300px] border-3 text-white text-sm cursor-pointer active:scale-98 ${borderClass}`}
      onClick={() => handleMateriaClick(codigo)}
    >
      <Handle type="target" position={Position.Top} />
      <span className={`w-full p-2 ${bgClass}`}>{materia.nombre}</span>
      <span className={`flex items-center justify-center font-bold min-w-[50px] py-1 text-center ${textClass}`}>
        {materia.uc} UC
      </span>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
};

