package models

type Carrera struct {
	Id         int    `json:"id"`
	Nombre     string `json:"nombre"`
	Uc_totales int    `json:"uc_totales"`
}
