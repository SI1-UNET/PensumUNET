	export interface IMaterias {
  codigo:        string,    
	nombre:        string,    
	info:          string,    
	uc:            number,     
	horas_estudio: string,    
	electiva:      boolean, 
	correquisito: boolean,     
	departamento:  string,   
	nucleo:        string,    
	semestre:      number,      
	uc_requeridas: number,
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
		correquisito: boolean,
		departamento: string;
		nucleo: string;
		semestre: number;
		uc_requeridas: number;
		prelaciones: string[] | [];
		desbloqueables: string[] | []
	};
}

export interface IMateriasBest {
		codigo: string;
		nombre: string;
		desbloqueables: number;
		uc: number; 
		uc_min: number;
	
}