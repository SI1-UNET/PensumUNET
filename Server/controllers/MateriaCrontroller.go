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

func GetMaterias(dbpool *pgxpool.Pool) ([]m.Materia, error) {
	var materias []m.Materia

	rows, err := dbpool.Query(context.Background(), "SELECT codigo, id_carrera , id_semestre, electiva, id_nucleo FROM materia")
	if err != nil {
		rows.Close()
		return materias, errors.New("Error leyendo la tabla materia, error = " + err.Error())
	}
	defer rows.Close()

	for rows.Next() {
		var temp m.Materia
		err := rows.Scan(&temp.Codigo, &temp.Id_carrera, &temp.Id_semestre, &temp.Electiva, &temp.Id_nucleo)

		if err != nil {
			fmt.Fprint(os.Stderr, "Error leyendo columna de la tabla materia, error = "+err.Error())
			continue
		}

		materias = append(materias, temp)
	}

	return materias, nil
}

func GetMateria(dbpool *pgxpool.Pool, codigo string, id_carrera int) (m.Materia, error) {
	var materia m.Materia
	err := dbpool.QueryRow(context.Background(), "SELECT codigo, id_carrera , id_semestre, electiva, id_nucleo FROM materia WHERE codigo = $1 AND id_carrera = $2 LIMIT 1", codigo, id_carrera).Scan(&materia.Codigo, &materia.Id_carrera, &materia.Id_semestre, &materia.Electiva, &materia.Id_nucleo)
	if err != nil {
		return materia, errors.New("No existe la materia con codigo = " + codigo + " y id_carrera = " + strconv.Itoa(id_carrera))
	}

	return materia, nil
}


func GetMateriasCarrera(dbpool *pgxpool.Pool, id_carrera int) ([]m.Materia, error) {
	var materias []m.Materia

	rows, err := dbpool.Query(context.Background(), "SELECT codigo, id_carrera , id_semestre, electiva, id_nucleo FROM materia WHERE id_carrera = $1", id_carrera)
	if err != nil {
		rows.Close()
		return materias, errors.New("Error leyendo la tabla materia, error = " + err.Error())
	}
	defer rows.Close()

	for rows.Next() {
		var temp m.Materia
		err := rows.Scan(&temp.Codigo, &temp.Id_carrera, &temp.Id_semestre, &temp.Electiva, &temp.Id_nucleo)

		if err != nil {
			fmt.Fprint(os.Stderr, "Error leyendo columna de la tabla materia, error = "+err.Error())
			continue
		}

		materias = append(materias, temp)
	}

	return materias, nil
}
