package models

import (
	"Server/config"
	"context"
	"log"
)

type Departamento struct {
	Id     int    `json:"id"`
	Nombre string `json:"nombre"`
}

func GetAllDepartamento() ([]Departamento, error) {
	query := `
	SELECT 
		id, 
		nombre 
	FROM Departamento;`

	rows, err := config.PsqlDB.Query(context.Background(), query)
	if err != nil {
		log.Printf("\n\nError getting Departamentos: %v", err)
		return nil, err
	}
	defer rows.Close()

	var departamentos []Departamento
	for rows.Next() {
		var d Departamento
		err := rows.Scan(&d.Id, &d.Nombre)
		if err != nil {
			log.Printf("Error fetching Departamentos: %v", err)
			return departamentos, err
		}
		departamentos = append(departamentos, d)
	}
	return departamentos, nil

}
