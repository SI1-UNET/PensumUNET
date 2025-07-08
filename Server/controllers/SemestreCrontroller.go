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

func GetSemestres(dbpool *pgxpool.Pool) ([]m.Semestre, error) {
	var semestres []m.Semestre

	rows, err := dbpool.Query(context.Background(), "SELECT id, semestre, num_semestre FROM semestre")
	if err != nil {
		rows.Close()
		return semestres, errors.New("Error leyendo la tabla semestre, error = " + err.Error())
	}
	defer rows.Close()

	for rows.Next() {
		var temp m.Semestre
		err := rows.Scan(&temp.Id, &temp.Semestre)

		if err != nil {
			fmt.Fprint(os.Stderr, "Error leyendo columna de la tabla semestre, error = "+err.Error())
			continue
		}

		semestres = append(semestres, temp)
	}

	return semestres, nil
}

func GetSemestre(dbpool *pgxpool.Pool, id int) (m.Semestre, error) {
	var semestre m.Semestre
	err := dbpool.QueryRow(context.Background(), "SELECT id, semestre, num_semestre FROM semestre WHERE id = $1 LIMIT 1", id).Scan(&semestre.Id, &semestre.Semestre)
	if err != nil {
		return semestre, errors.New("No existe el nucleo con id = " + strconv.Itoa(id))
	}

	return semestre, nil
}
