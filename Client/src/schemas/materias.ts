	export interface IMaterias {
  codigo:         string,    
	nombre:         string,    
	info:           string,    
	uc:             number,     
	horas_estudio:  string,    
	electiva:       boolean,  
	departamento:   string,   
	nucleo:         string,    
	semestre:       number,      
	uc_requeridas:  number,
	correquisito:   string | null,
	prelaciones:    string[] | [],
	desbloqueables: string[] | []
  }

	export interface IMateriasBySemester {
  [semester: number]: IMateriasObject;
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
		uc_requeridas: number;
		correquisito: string | null,
		prelaciones: string[] | [];
		desbloqueables: string[] | []
	};
}

export interface IMateriasBest {
		codigo: string;
		nombre: string;
		desbloqueables: number;
		correquisito: boolean;
		codigo_correquisito: string | null;
		uc: number; 
		uc_min: number;
	
}