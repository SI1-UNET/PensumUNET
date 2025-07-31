package models

import (
	"Server/config"
	"context"
	"log"
)

type Carrera struct {
	Id       int    `json:"id"`
	Nombre   string `json:"nombre"`
	Uc_total int    `json:"uc_total"`
}

func GetAllCarreras() ([]Carrera, error) {
	query := `
	SELECT 
		*
	FROM carreras;`

	rows, err := config.PsqlDB.Query(context.Background(), query)
	if err != nil {
		log.Printf("\n\nError getting Carreras: %v", err)
		return nil, err
	}
	defer rows.Close()

	var carreras []Carrera
	for rows.Next() {
		var c Carrera
		err := rows.Scan(&c.Id, &c.Nombre, &c.Uc_total)
		if err != nil {
			log.Printf("Error fetching Carreras: %v", err)
			return carreras, err
		}
		carreras = append(carreras, c)
	}
	return carreras, nil

}
