package models

type PrelacionMaterias struct {
	Codigo_mat       string `json:"codigo_mat"`
	Codigo_mat_prela string `json:"codigo_mat_prela"`
	Id_carrera       int    `json:"id_carrera"`
}
