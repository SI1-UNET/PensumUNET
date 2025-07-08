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

func GetDepartamentos(dbpool *pgxpool.Pool) ([]m.Departamento, error) {
	var departamentos []m.Departamento

	rows, err := dbpool.Query(context.Background(), "SELECT id, nombre FROM departamento")
	if err != nil {
		rows.Close()
		return departamentos, errors.New("Error leyendo la tabla departamento, error = " + err.Error())
	}
	defer rows.Close()

	for rows.Next() {
		var temp m.Departamento
		err := rows.Scan(&temp.Id, &temp.Nombre)

		if err != nil {
			fmt.Fprint(os.Stderr, "Error leyendo columna de la tabla departamento, error = "+err.Error())
			continue
		}

		departamentos = append(departamentos, temp)
	}

	return departamentos, nil
}

func GetDepartamento(dbpool *pgxpool.Pool, id int) (m.Departamento, error) {
	var departamento m.Departamento
	err := dbpool.QueryRow(context.Background(), "SELECT id, nombre FROM departamento WHERE id = $1 LIMIT 1", id).Scan(&departamento.Id, &departamento.Nombre)
	if err != nil {
		return departamento, errors.New("No existe el departamento con id = " + strconv.Itoa(id))
	}

	return departamento, nil
}

