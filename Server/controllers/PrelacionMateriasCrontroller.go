package controllers

import (
	m "Server/models"
	"context"
	"errors"
	"fmt"
	"os"

	"github.com/jackc/pgx/v5/pgxpool"
)

func GetPrelacionMaterias(dbpool *pgxpool.Pool) ([]m.PrelacionMaterias, error) {
	var prelacionesMat []m.PrelacionMaterias

	rows, err := dbpool.Query(context.Background(), "SELECT codigo_mat, codigo_mat_prela, id_carrera FROM prelacion_materias")
	if err != nil {
		rows.Close()
		return prelacionesMat, errors.New("Error leyendo la tabla prelacion_materia, error = " + err.Error())
	}
	defer rows.Close()

	for rows.Next() {
		var temp m.PrelacionMaterias
		err := rows.Scan(&temp.Codigo_mat, &temp.Codigo_mat_prela, &temp.Id_carrera)

		if err != nil {
			fmt.Fprint(os.Stderr, "Error leyendo columna de la tabla prelacion_materias, error = "+err.Error())
			continue
		}

		prelacionesMat = append(prelacionesMat, temp)
	}

	return prelacionesMat, nil
}

func GetPrelacionMateria(dbpool *pgxpool.Pool, codigo string) ([]m.PrelacionMaterias, error) {
	var prelacionesMat []m.PrelacionMaterias

	rows, err := dbpool.Query(context.Background(), "SELECT codigo_mat, codigo_mat_prela, id_carrera FROM prelacion_materias WHERE codigo_mat = $1", codigo)
	if err != nil {
		rows.Close()
		return prelacionesMat, errors.New("Error leyendo la tabla prelacion_materia, error = " + err.Error())
	}
	defer rows.Close()

	for rows.Next() {
		var temp m.PrelacionMaterias
		err := rows.Scan(&temp.Codigo_mat, &temp.Codigo_mat_prela, &temp.Id_carrera)

		if err != nil {
			fmt.Fprint(os.Stderr, "Error leyendo columna de la tabla prelacion_materias, error = "+err.Error())
			continue
		}

		prelacionesMat = append(prelacionesMat, temp)
	}

	return prelacionesMat, nil
}

func GetPrelacionMateriaA(dbpool *pgxpool.Pool, codigo string, carrera int ) ([]m.PrelacionMaterias, error) {
	var prelacionesMat []m.PrelacionMaterias

	rows, err := dbpool.Query(context.Background(), "SELECT codigo_mat, codigo_mat_prela, id_carrera FROM prelacion_materias WHERE codigo_mat = $1 AND id_carrera = $2", codigo, carrera)
	if err != nil {
		rows.Close()
		return prelacionesMat, errors.New("Error leyendo la tabla prelacion_materia, error = " + err.Error())
	}
	defer rows.Close()

	for rows.Next() {
		var temp m.PrelacionMaterias
		err := rows.Scan(&temp.Codigo_mat, &temp.Codigo_mat_prela, &temp.Id_carrera)

		if err != nil {
			fmt.Fprint(os.Stderr, "Error leyendo columna de la tabla prelacion_materias, error = "+err.Error())
			continue
		}

		prelacionesMat = append(prelacionesMat, temp)
	}

	return prelacionesMat, nil
}
