package models

type InfoMateria struct {
	Codigo          string `json:"codigo"`
	Nombre          string `json:"nombre"`
	Info            string `json:"info"`
	Uc              int    `json:"uc"`
	Horas_estudio   int    `json:"horas_estudio"`
	Id_departamento int    `json:"id_departamento"`
}
