import { useState } from "preact/hooks";
import Logo from "../assets/UNET.png"
import type { ICarrera } from "../schemas/materias";

type Props = {
  carreras: ICarrera[];
}


export const Navbar = ({carreras}: Props) =>{
  const [modalidadOpen, setModalidadOpen] = useState(false);
  const [carrerasOpen, setCarrerasOpen] = useState(false)

    const currentPath = window.location.pathname;
    const parts = currentPath.split("/").filter(Boolean);
    const lastPart = parts[parts.length - 1];
    const middle = parts.slice(0, -1).join("/");

    const currentCarrera = carreras.find(carrera => String(carrera.id) === lastPart);
    const carreraNombre = currentCarrera!.nombre ;

  const handleModalidad = () =>{
    setModalidadOpen(!modalidadOpen)
    setCarrerasOpen(false)
  }

  const handleCarreras = () =>{
    setCarrerasOpen(!carrerasOpen)
    setModalidadOpen(false)
  }

  return(
      <nav class="flex relative justify-between w-full">
        <a href="/" class="flex items-center gap-2 py-2 ms-20 cursor-pointer ">
          <img src={Logo.src} width={70} height={70} alt="UNET Logo" />
          <h1 class="font-league-gothic tracking-tight font-medium text-primary text-5xl">Tu Pensum UNET</h1>
        </a>
         <h2 class="text-primary font-dm-sans tracking-tight text-3xl font-semibold self-center ">
            {carreraNombre}
          </h2>
        <div class="flex gap-10 self-end text-primary me-20">
          <div class="relative">
            <button 
              class="border-3  border-b-0 border-primary border-x-primary rounded-t-[10px] w-[250px] py-2 relative z-3 hover:bg-primary hover:text-white group"
              onClick={handleCarreras}>  
              Carreras
              <div class="absolute w-full bottom-0 h-[3px] bg-white group-hover:hidden"/>
            </button>
            {carrerasOpen &&
                <div class="w-full flex flex-col absolute top-full border-3 border-primary border-t-0 z-3">
                  {carreras.map((carrera) => (
                    <a href={`/${middle}/${carrera.id}`} class="py-2 text-center odd:bg-white  not-odd:bg-secondary-100" key={carrera.id}>
                      {carrera.nombre}
                    </a>
                  ))}
                </div>

              }
          </div>
         
          <div class="relative">
            <button 
              class="border-3 border-b-0 border-primary border-x-primary rounded-t-[10px] w-[250px] py-2 relative z-3 hover:bg-primary hover:text-white group cursor-pointer"
              onClick={handleModalidad}>
              Modalidad
              <div class="absolute w-full bottom-0 h-[3px] bg-white group-hover:hidden"/>
              
            </button>
            {modalidadOpen &&
                <div class="w-full flex flex-col absolute top-full border-3 border-primary border-t-0 z-3">
                  <a href={`/carreras/${lastPart}`} class="py-2 text-center bg-white" >Información de Materia</a>
                  <a href={`/carreras/planificador/${lastPart}`} class="py-2 text-center bg-secondary-100">Planificador</a>
                </div>

              }
          </div>
        </div>
        <div class="absolute w-full bottom-0 h-[3px] bg-primary " />
      </nav>
  )
}