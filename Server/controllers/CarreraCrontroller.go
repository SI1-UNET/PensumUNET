package controllers

import (
	m "Server/models"
	"context"
	"errors"
	"fmt"
	"os"
	"strconv"

	"github.com/jackc/pgx/v5/pgxpool"
)

func GetCarreras(dbpool *pgxpool.Pool) ([]m.Carrera, error) {
	var carreras []m.Carrera

	rows, err := dbpool.Query(context.Background(), "SELECT id, nombre, uc_totales FROM carrera")
	if err != nil {
		rows.Close()
		return carreras, errors.New("Error leyendo la tabla carrera, error = " + err.Error())
	}
	defer rows.Close()

	for rows.Next() {
		var temp m.Carrera
		err := rows.Scan(&temp.Id, &temp.Nombre, &temp.Uc_totales)

		if err != nil {
			fmt.Fprint(os.Stderr, "Error leyendo columna de la tabla carrera, error = "+err.Error())
			continue
		}

		carreras = append(carreras, temp)
	}

	return carreras, nil
}

func GetCarrera(dbpool *pgxpool.Pool, id int) (m.Carrera, error) {
	var carrera m.Carrera
	err := dbpool.QueryRow(context.Background(), "SELECT id, nombre, uc_totales FROM carrera WHERE id = $1 LIMIT 1", id).Scan(&carrera.Id, &carrera.Nombre, &carrera.Uc_totales)
	if err != nil {
		return carrera, errors.New("No existe el nucleo con id = " + strconv.Itoa(id))
	}

	return carrera, nil
}
