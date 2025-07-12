package models

import (
	"Server/config"
	"context"
	"log"
)

type Nucleo struct {
	Id     int    `json:"id"`
	Nombre string `json:"nombre"`
}

func GetAllNucleos() ([]Nucleo, error) {
	query := `
	SELECT 
		id, 
		nombre 
	FROM Nucleo;`

	rows, err := config.PsqlDB.Query(context.Background(), query)
	if err != nil {
		log.Printf("\n\nError getting Nucleos: %v", err)
		return nil, err
	}
	defer rows.Close()

	var nucleos []Nucleo
	for rows.Next() {
		var n Nucleo
		err := rows.Scan(&n.Id, &n.Nombre)
		if err != nil {
			log.Printf("Error fetching Nucleos: %v", err)
			return nucleos, err
		}
		nucleos = append(nucleos, n)
	}
	return nucleos, nil

}
