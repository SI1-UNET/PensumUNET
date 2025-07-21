package models

import (
	"Server/config"
	"context"
	"log"

	"github.com/jackc/pgx/v5"
)

type Materia struct {
	Codigo        string    `json:"codigo"`
	Nombre        string    `json:"nombre"`
	Info          string    `json:"info"`
	Uc            int       `json:"uc"`
	Horas_estudio string    `json:"horas_estudio"`
	Electiva      bool      `json:"electiva"`
	Correquisito  bool      `json:"correquisito"`
	Id_carrera    int       `json:"id_carrera"`
	Departamento  string    `json:"departamento"`
	Nucleo        string    `json:"nucleo"`
	Semestre      int       `json:"semestre"`
	UC_requeridas *int      `json:"uc_requeridas"`
	Prelaciones   []*string `json:"prelaciones"`
	Debloqueables []*string `json:"desbloqueables"`
}

func GetAllMaterias() ([]Materia, error) {
	query := `
	SELECT 
		m.codigo, 
		m.nombre, 
		m.info, 
		m.uc, 
		m.horas_estudio,
		m.electiva,
		m.correquisito,
		d.nombre,
		n.nombre,
		s.semestre,
		uc.min_uc,
		ARRAY_AGG(DISTINCT prl.codigo_prel) AS prelaciones,
		ARRAY_AGG(DISTINCT des.codigo_mat) AS debloqueables
	FROM materia m
	JOIN departamento d ON m.id_departamento = d.id
	JOIN nucleo n ON m.id_nucleo = n.id
	JOIN semestre_mat_carrera s ON m.codigo = s.codigo_materia
	LEFT JOIN prelacion_uc uc ON m.codigo = uc.codigo_mat
	LEFT JOIN prelacion_mat prl ON m.codigo = prl.codigo_mat
	LEFT JOIN prelacion_mat des ON m.codigo = des.codigo_prel
	GROUP BY s.semestre, m.codigo, d.nombre, n.nombre, uc.min_uc;`

	rows, err := config.PsqlDB.Query(context.Background(), query)
	if err != nil {
		log.Printf("\n\nError getting Materias: %v", err)
		return nil, err
	}
	defer rows.Close()

	var materias []Materia
	for rows.Next() {
		var m Materia
		err := rows.Scan(&m.Codigo, &m.Nombre, &m.Info, &m.Uc, &m.Horas_estudio, &m.Electiva, &m.Correquisito, &m.Departamento, &m.Nucleo, &m.Semestre, &m.UC_requeridas, &m.Prelaciones, &m.Debloqueables)
		if err != nil {
			log.Printf("Error fetching Materias: %v", err)
			return materias, err
		}
		materias = append(materias, m)
	}
	return materias, nil

}

func (m *Materia) GetAllMateriasByCarrera(db *pgx.Conn) ([]Materia, error) {
	query := `
	SELECT 
		m.codigo, 
		m.nombre, 
		m.info, 
		m.uc, 
		m.horas_estudio,
		m.electiva,
		m.correquisito,
		d.nombre,
		n.nombre,
		s.semestre,
		uc.min_uc,
		ARRAY_AGG(DISTINCT prl.codigo_prel) AS prelaciones,
		ARRAY_AGG(DISTINCT des.codigo_mat) AS debloqueables
	FROM materia m
	JOIN departamento d ON m.id_departamento = d.id
	JOIN nucleo n ON m.id_nucleo = n.id
	JOIN semestre_mat_carrera s ON m.codigo = s.codigo_materia
	LEFT JOIN prelacion_uc uc ON m.codigo = uc.codigo_mat
	LEFT JOIN prelacion_mat prl ON s.codigo_materia = prl.codigo_mat AND prl.id_carrera = @id_carrera
	LEFT JOIN prelacion_mat des ON s.codigo_materia = des.codigo_prel AND des.id_carrera = @id_carrera
	WHERE s.id_carrera = @id_carrera
	GROUP BY s.semestre, m.codigo, d.nombre, n.nombre, uc.min_uc;`

	rows, err := config.PsqlDB.Query(context.Background(), query, pgx.NamedArgs{"id_carrera": m.Id_carrera})
	if err != nil {
		log.Printf("\n\nError getting Materias: %v", err)
		return nil, err
	}
	defer rows.Close()

	var materias []Materia
	for rows.Next() {
		var m Materia
		err := rows.Scan(&m.Codigo, &m.Nombre, &m.Info, &m.Uc, &m.Horas_estudio, &m.Electiva, &m.Correquisito, &m.Departamento, &m.Nucleo, &m.Semestre, &m.UC_requeridas, &m.Prelaciones, &m.Debloqueables)
		if err != nil {
			log.Printf("Error fetching Materias: %v", err)
			return materias, err
		}
		materias = append(materias, m)
	}
	return materias, nil

}

func (m *Materia) GetMateriasDeDepartamento(db *pgx.Conn) (*[]Materia, error) {
	query := `
	SELECT 
		m.codigo, 
		m.nombre, 
		m.info, 
		m.uc, 
		m.horas_estudio,
		m.electiva,
		d.nombre,
		n.nombre,
		s.semestre,
		uc.min_uc,
		ARRAY_AGG(prl.codigo_prel) AS prelaciones
	FROM materia m
	JOIN departamento d ON m.id_departamento = d.id
	JOIN nucleo n ON m.id_nucleo = n.id
	JOIN semestre_mat_carrera s ON m.codigo = s.codigo_materia
	LEFT JOIN prelacion_uc uc ON m.codigo = uc.codigo_mat
	LEFT JOIN prelacion_mat prl ON m.codigo = prl.codigo_mat
	WHERE LIKE d.name = @id_departamento 
	GROUP BY s.semestre, m.codigo, d.nombre, n.nombre, uc.min_uc;`

	rows, err := config.PsqlDB.Query(context.Background(), query, pgx.NamedArgs{"id_departamento": m.Departamento})
	if err != nil {
		log.Printf("\n\nError getting Materia: %v", err)
		return nil, err
	}
	defer rows.Close()

	var materias []Materia
	for rows.Next() {
		var m Materia
		err := rows.Scan(&m.Codigo, &m.Nombre, &m.Info, &m.Uc, &m.Horas_estudio, &m.Electiva, &m.Departamento, &m.Nucleo, &m.Semestre, &m.UC_requeridas, &m.Prelaciones, &m.Debloqueables)
		if err != nil {
			log.Printf("Error fetching Materias: %v", err)
			return &materias, err
		}
		materias = append(materias, m)
	}
	return &materias, nil

}
