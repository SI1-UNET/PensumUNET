package models

type Materia struct {
	Codigo      string `json:"codigo"`
	Id_carrera  int    `json:"id_carrera"`
	Id_semestre int    `json:"id_semestre"`
	Electiva    int    `json:"electiva"`
	Id_nucleo   int    `json:"id_nucleo"`
}
