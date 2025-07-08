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

func GetNucleos(dbpool *pgxpool.Pool) ([]m.Nucleo, error) {
	var nucleos []m.Nucleo

	rows, err := dbpool.Query(context.Background(), "SELECT id, nombre, id_departamento FROM nucleo")
	if err != nil {
		rows.Close()
		return nucleos, errors.New("Error leyendo la tabla nucleo, error = " + err.Error())
	}
	defer rows.Close()

	for rows.Next() {
		var temp m.Nucleo
		err := rows.Scan(&temp.Id, &temp.Nombre, &temp.Id_departamento)

		if err != nil {
			fmt.Fprint(os.Stderr, "Error leyendo columna de la tabla nucleo, error = "+err.Error())
			continue
		}

		nucleos = append(nucleos, temp)
	}

	return nucleos, nil
}

func GetNucleo(dbpool *pgxpool.Pool, id int) (m.Nucleo, error) {
	var nucleo m.Nucleo
	err := dbpool.QueryRow(context.Background(), "SELECT id, nombre, id_departamento FROM nucleo WHERE id = $1 LIMIT 1", id).Scan(&nucleo.Id, &nucleo.Nombre, &nucleo.Id_departamento)
	if err != nil {
		return nucleo, errors.New("No existe el nucleo con id = " + strconv.Itoa(id))
	}

	return nucleo, nil
}
