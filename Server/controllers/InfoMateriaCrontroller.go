package controllers

import (
	m "Server/models"
	"context"
	"errors"
	"fmt"
	"os"

	"github.com/jackc/pgx/v5/pgxpool"
)

func GetInfoMaterias(dbpool *pgxpool.Pool) ([]m.InfoMateria, error) {
	var infos []m.InfoMateria

	rows, err := dbpool.Query(context.Background(), "SELECT codigo, nombre, info, uc, horas_estudio, id_departamento FROM info_materia")
	if err != nil {
		rows.Close()
		return infos, errors.New("Error leyendo la tabla info_materia, error = " + err.Error())
	}
	defer rows.Close()

	for rows.Next() {
		var temp m.InfoMateria
		err := rows.Scan(&temp.Codigo, &temp.Nombre, &temp.Info, &temp.Uc, &temp.Horas_estudio, &temp.Id_departamento)

		if err != nil {
			fmt.Fprint(os.Stderr, "Error leyendo columna de la tabla info_materia, error = "+err.Error())
			continue
		}

		infos = append(infos, temp)
	}

	return infos, nil
}

func GetInfoMateria(dbpool *pgxpool.Pool, codigo string) (m.InfoMateria, error) {
	var info_materia m.InfoMateria
	err := dbpool.QueryRow(context.Background(), "SELECT codigo, nombre, info, uc, horas_estudio, id_departamento FROM info_materia WHERE codigo = $1 LIMIT 1", codigo).Scan(&info_materia.Codigo, &info_materia.Nombre, &info_materia.Info, &info_materia.Uc, &info_materia.Horas_estudio, &info_materia.Id_departamento)
	if err != nil {
		return info_materia, errors.New("No existe la info_materia con codigo = " + codigo)
	}

	return info_materia, nil
}
