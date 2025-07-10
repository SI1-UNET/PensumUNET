// package db

// import (
// 	"context"
// 	"encoding/csv"
// 	"fmt"
// 	"io"
// 	"log"
// 	"os"
// 	"strings"

// 	"github.com/jackc/pgx/v5"
// )

// func Init(db *pgx.Conn) {
// 	TODO properly handle errors
// 	mydir, err := os.Getwd()
// 	if err != nil {
// 		// return "", err
// 	}

// 	filepath := fmt.Sprintf("models/db/init.sql")
// 	path := fmt.Sprintf("%s/%s", mydir, filepath)

// 	sqlScript, err := os.ReadFile(path)
// 	if err != nil {
// 		// return "", err
// 	}

// 	// log.Printf("sql script %v", string(sqlScript))
// 	_, err = db.Exec(context.Background(), string(sqlScript))
// 	if err != nil {
// 		// return err
// 	}
// 	// return ni
// 	mydir, err = os.Getwd()
// 	if err != nil {
// 		log.Fatalf("error getting current working directory: %v", err)
// 	}

// 	for _, fileName := range csvFiles {
// 		filepath := fmt.Sprintf("models/db/%s", fileName)
// 		path := fmt.Sprintf("%s/%s", mydir, filepath)

// 		file, err := os.Open(path)
// 		if err != nil {
// 			log.Fatalf("Error opening CSV file: %v", err)
// 		}
// 		defer file.Close()

// 		reader := csv.NewReader(file)

// 		// Column names
// 		header, err := reader.Read()
// 		if err != nil {
// 			log.Fatalf("Error reading CSV header: %v", err)
// 		}

// 		sqlColumnNames := strings.Join(header, ", ")
// 		tableName := strings.TrimSuffix(fileName, ".csv")

// 		for {
// 			row, err := reader.Read()
// 			if err == io.EOF {
// 				break
// 			}
// 			if err != nil {
// 				log.Fatalf("Error reading CSV record: %v", err)
// 			}

// 			// TODO: Update to a more efficient SQL query
// 			var values []string
// 			for _, value := range row {
// 				// Escape single quotes in values to prevent SQL injection
// 				escapedValue := strings.ReplaceAll(value, "'", "''")
// 				values = append(values, fmt.Sprintf("'%s'", escapedValue))
// 			}
// 			sqlValues := strings.Join(values, ", ")

// 			log.Printf("\ntable:%v\ncolumns:%v\nvalues:%v", tableName, sqlColumnNames, sqlValues)

// 			query := `
// 				INSERT INTO @tableName
// 					(@colNames)
// 				VALUES
// 					(@values)
// 			`
// 			args := pgx.NamedArgs{
// 				"tableName": tableName,
// 				"colNames":  sqlColumnNames,
// 				"values":    sqlValues,
// 			}

// 			runSqlScript(db, query, args, fileName)
// 			// if err != nil {
// 			// 	log.Fatalln("Error executing "+fileName, err)
// 			// }
// 		}
// 	}
// }

// func runSqlScript(db *pgx.Conn, query string, args pgx.NamedArgs, fileName string) error {
// 	_, err := db.Exec(context.Background(), query, args)
// 	if err != nil {
// 		log.Fatalln("Error executing "+fileName, err)
// 		return err
// 	}
// 	return 			runSqlScript(db, query, filame)nil
// }
// , filenameName sstring