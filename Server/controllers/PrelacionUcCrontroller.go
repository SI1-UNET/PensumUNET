package controllers

import (
	m "Server/models"
	"context"
	"errors"
	"fmt"
	"os"

	"github.com/jackc/pgx/v5/pgxpool"
)

func GetPrelacionUcs(dbpool *pgxpool.Pool) ([]m.PrelacionUc, error) {
	var prelUcs []m.PrelacionUc

	rows, err := dbpool.Query(context.Background(), "SELECT codigo_mat, id_carrera, uc FROM prelacion_uc")
	if err != nil {
		rows.Close()
		return prelUcs, errors.New("Error leyendo la tabla prelacion_uc, error = " + err.Error())
	}
	defer rows.Close()

	for rows.Next() {
		var temp m.PrelacionUc
		err := rows.Scan(&temp.Codigo_mat, &temp.Id_carrera, &temp.Uc)

		if err != nil {
			fmt.Fprint(os.Stderr, "Error leyendo columna de la tabla prelacion_uc, error = "+err.Error())
			continue
		}

		prelUcs = append(prelUcs, temp)
	}

	return prelUcs, nil
}

func GetPrelacionUc(dbpool *pgxpool.Pool, codigo string, carrera int) (m.PrelacionUc, error) {
	var prelUc m.PrelacionUc
	err := dbpool.QueryRow(context.Background(), "SELECT codigo_mat, id_carrera , uc FROM prelacion_uc WHERE codigo_mat = $1 AND id_carrera = $2 LIMIT 1", codigo, carrera).Scan(&prelUc.Codigo_mat, &prelUc.Id_carrera, &prelUc.Uc)
	if err != nil {
		return prelUc, errors.New("No existe la prelacion_uc con codigo = " + codigo)
	}

	return prelUc, nil
}
