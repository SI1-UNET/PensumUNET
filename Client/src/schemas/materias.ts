	export interface IMaterias {
  codigo:        string,    
	nombre:        string,    
	info:          string,    
	uc:            number,     
	horas_estudio: string,    
	electiva:      boolean,      
	departamento:  string,   
	nucleo:        string,    
	semestre:      number,      
	uc_requeridas: number | null,
	prelaciones:   string[] | [],
	desbloqueables: string[] | []
  }

	export interface IMateriasBySemester {
  [semester: number]: IMaterias[];
}

export interface IMateriasObject {
	[codigo: string]: {
		nombre: string;
		info: string;
		uc: number;
		horas_estudio: string;
		electiva: boolean;
		departamento: string;
		nucleo: string;
		semestre: number;
		uc_requeridas: number | null;
		prelaciones: string[] | [];
		desbloqueables: string[] | []
	};
}

export interface IMateriasBest {
		codigo: string;
		desbloqueables: number;
		uc: number; // Optional, if you want to include uc in the best path
	
}