package models

import (
	"context"
	"fmt"
	"log"
	"os"

	"github.com/jackc/pgx/v5"
)

func DropDB(db *pgx.Conn) {
	sqlScript, err := getSqlScript("drop.sql")
	if err != nil {
		log.Fatalln("Error reading drop.sql", err)
	}
	err = runSqlScript(db, sqlScript)
	if err != nil {
		log.Fatalln("Error executing drop.sql", err)
	}
}

func InitDB(db *pgx.Conn) {
	tableScripts := []string{
		"init.sql",
	}

	executeSqlScripts(db, tableScripts)
}

func LoadSampleData(db *pgx.Conn) {

	infoScripts := []string{
		"sample_data.sql",
		"tables/materias.sql",
		"tables/prelaciones_uc.sql",
		"tables/prelaciones_mat.sql",
		"tables/prelaciones_corr.sql",
		"tables/semestre_mat_carrera.sql",
	}

	for _, fileName := range infoScripts {
		sqlScript, err := getSqlScript(fileName)
		if err != nil {
			log.Fatalln("Error reading sample data", err)
		}
		err = runSqlScript(db, sqlScript)
		if err != nil {
			log.Fatalln("Error executing sample data", err)
		}
	}
}

func getSqlScript(fileName string) (string, error) {

	mydir, err := os.Getwd()
	if err != nil {
		return "", err
	}

	filepath := fmt.Sprintf("models/schemas/%s", fileName)
	path := fmt.Sprintf("%s/%s", mydir, filepath)

	sqlScript, err := os.ReadFile(path)
	if err != nil {
		return "", err
	}

	return string(sqlScript), nil
}

func runSqlScript(db *pgx.Conn, sqlScript string) error {
	_, err := db.Exec(context.Background(), sqlScript)
	if err != nil {
		return err
	}
	return nil
}

func executeSqlScripts(db *pgx.Conn, sqlScripts []string) {
	for _, fileName := range sqlScripts {
		sqlScript, err := getSqlScript(fileName)
		if err != nil {
			log.Fatalln("Error reading "+fileName, err)
		}
		err = runSqlScript(db, sqlScript)
		if err != nil {
			log.Fatalln("Error executing "+fileName, err)
		}
	}
}

// func InitCSV() {
// 	// csvFiles := []string{
// 	// 	"carreras.csv",
// 	// 	"departmanentos.csv",
// 	// 	"materias.csv",
// 	// 	"nucleos.csv",
// 	// 	"prelMAT.csv",
// 	// 	"prelUC.csv",
// 	// 	"semestres.csv"}

// 	_, err := readCSVFile("materias.csv")
// 	if err != nil {
// 		fmt.Println("Error reading CSV:", err)
// 	}

// }

// func readCSVFile(csvfile string) ([][]string, error) {
// 	mydir, err := os.Getwd()
// 	if err != nil {
// 		return nil, fmt.Errorf("error getting current working directory: %w", err)
// 	}

// 	filepath := fmt.Sprintf("db/%s", csvfile)
// 	path := fmt.Sprintf("%s/%s", mydir, filepath)

// 	file, err := os.Open(path)
// 	if err != nil {
// 		return nil, fmt.Errorf("error opening CSV file %s: %w", path, err)
// 	}
// 	defer file.Close()
// 	fmt.Printf("Reading CSV file: %s\n", path)
// 	reader := csv.NewReader(file)
// 	records, err := reader.ReadAll()
// 	if err != nil {
// 		return nil, fmt.Errorf("error reading CSV file %s: %w", path, err)
// 	}
// 	for _, record := range records {
// 		fmt.Println(record)
// 	}

// 	return records, nil
// }
