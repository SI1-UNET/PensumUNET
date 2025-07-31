import Logo from "../assets/UNET.png"

export const Navbar = () =>{
  return(
      <nav class="flex relative justify-between w-full">
        <div class="flex items-center gap-2 py-2 ms-20">
          <img src={Logo.src} width={70} height={70} alt="UNET Logo" />
          <h1 class="font-league-gothic tracking-tight font-medium text-primary text-5xl">Tu Pensum UNET</h1>
        </div>
        <div class="flex gap-10 self-end text-primary me-20">
          <button class="border-3  border-b-0 border-primary border-x-primary rounded-t-[10px] w-[200px] py-2 relative z-3 hover:bg-primary hover:text-white group">
            Carreras
            <div class="absolute w-full bottom-0 h-[3px] bg-white group-hover:hidden"/>
          </button>
          <button class="border-3  border-b-0 border-primary border-x-primary rounded-t-[10px] w-[200px] py-2 relative z-3 hover:bg-primary hover:text-white group">
            Modalidad
            <div class="absolute w-full bottom-0 h-[3px] bg-white group-hover:hidden"/>
          </button>
        </div>
        <div class="absolute w-full bottom-0 h-[3px] bg-primary " />
      </nav>
  )
}