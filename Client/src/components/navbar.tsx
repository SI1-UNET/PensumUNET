import { useState } from "preact/hooks";
import Logo from "../assets/UNET.png"
import type { ICarrera } from "../schemas/materias";

type Props = {
  carreras: ICarrera[];
}


export const Navbar = ({carreras}: Props) =>{
  const [modalidadOpen, setModalidadOpen] = useState(false);
  const [carrerasOpen, setCarrerasOpen] = useState(false)

  let parts, lastPart: string, lastPartAux, middle: string, currentCarrera, carreraNombre;


  const currentPath = window.location.pathname;
  
    parts = currentPath.split("/").filter(Boolean);
    lastPart = parts[parts.length - 1];
    lastPartAux = parts[parts.length - 1];
    middle = parts.slice(0, -1).join("/");
  if(lastPart != "help"){
    currentCarrera = carreras.find(carrera => String(carrera.id) === lastPart);
    carreraNombre = currentCarrera!.nombre ;
  }
  else{
    carreraNombre = "Ayuda"
    lastPart = "1"
    
  }

  

  const handleModalidad = () =>{
    setModalidadOpen(!modalidadOpen)
    setCarrerasOpen(false)
  }

  const handleCarreras = () =>{
    setCarrerasOpen(!carrerasOpen)
    setModalidadOpen(false)
  }

  return(
      <nav className="flex relative justify-between w-full">
        <a href="/" className="flex items-center gap-2 py-2 ms-20 cursor-pointer ">
          <img src={Logo.src} width={70} height={70} alt="UNET Logo" />
          <h1 className="font-league-gothic tracking-tight font-medium text-primary text-5xl">Tú Pensum UNET</h1>
        </a>
         <h2 className="text-primary font-dm-sans tracking-tight text-3xl font-semibold self-center ">
            {carreraNombre}
          </h2>
        <div className="flex gap-10 self-end text-primary me-20">
          
          {lastPartAux != "help" ?
          <div className="relative">
            <button 
              className="border-3  border-b-0 border-primary border-x-primary rounded-t-[10px] w-[250px] py-2 relative z-3 hover:bg-primary hover:text-white group"
              onClick={handleCarreras}>  
              Carreras
              <div className="absolute w-full bottom-0 h-[3px] bg-white group-hover:hidden"/>
            </button>
            {carrerasOpen &&
                <div className="w-full flex flex-col absolute top-full border-3 border-primary border-t-0 z-3">
                  {carreras.map((carrera) => (
                    <a href={`/${middle}/${carrera.id}`} className="py-2 text-center odd:bg-white  not-odd:bg-secondary-100 hover:bg-primary-100 hover:text-white" key={carrera.id}>
                      {carrera.nombre}
                    </a>
                  ))}
                </div>

              }
          </div>
          : null
        }
         
          <div className="relative">
            <button 
              className="border-3 border-b-0 border-primary border-x-primary rounded-t-[10px] w-[250px] py-2 relative z-3 hover:bg-primary hover:text-white group cursor-pointer"
              onClick={handleModalidad}>
              Modalidad
              <div className="absolute w-full bottom-0 h-[3px] bg-white group-hover:hidden"/>
              
            </button>
            {modalidadOpen &&
                <div className="w-full flex flex-col absolute top-full border-3 border-primary border-t-0 z-3 ">
                  <a href={`/carreras/${lastPart}`} className="py-2 text-center bg-white hover:bg-primary-100 hover:text-white" >Información de Materia</a>
                  <a href={`/carreras/planificador/${lastPart}`} className="py-2 text-center bg-secondary-100 hover:bg-primary-100 hover:text-white">Planificador</a>
                </div>

              }
          </div>
        </div>
        <div className="absolute w-full bottom-0 h-[3px] bg-primary " />
      </nav>
  )
}