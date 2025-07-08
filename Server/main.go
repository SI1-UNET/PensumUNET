package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"os"
	"strconv"
	c "Server/controllers"

	"net/http"
	"github.com/gorilla/mux"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/joho/godotenv"
)

var dbpool *pgxpool.Pool

func main() {
	err := godotenv.Load()
	dbpool, err := pgxpool.New(context.Background(), os.Getenv("DATABASE_URL"))
	if err != nil {
		fmt.Fprintf(os.Stderr, "Unable to create connection pool: %v\n", err)
		os.Exit(1)
	}
	defer dbpool.Close()

	router := mux.NewRouter()

	// --------------------------------------------------------------
	router.HandleFunc("/departamentos",
		func(w http.ResponseWriter, r *http.Request) {
			w.Header().Set("Content-Type", "application/json")

			out, err :=  c.GetDepartamentos(dbpool)
			if err != nil {
				fmt.Fprintf(os.Stderr, "Query failed: %v\n", err)
				return
			}

			fmt.Println(r.URL)
			json.NewEncoder(w).Encode(out)
		}).Methods("GET")

	router.HandleFunc("/departamentos/{id}",
		func(w http.ResponseWriter, r *http.Request) {
			w.Header().Set("Content-Type", "application/json")
			params := mux.Vars(r)
			idp, _ := params["id"]
			id, err := strconv.Atoi(idp)
			if err != nil {
				w.WriteHeader(404)
				fmt.Fprintf(os.Stderr, "id no valida")
				return
			}

			out, err := c.GetDepartamento(dbpool, id)
			if err != nil {
				w.WriteHeader(404)
				fmt.Fprintf(os.Stderr, "Query failed: %v\n", err)
				return
			}

			fmt.Println(r.URL)
			json.NewEncoder(w).Encode(out)
		}).Methods("GET")
	// --------------------------------------------------------------
	router.HandleFunc("/nucleos",
		func(w http.ResponseWriter, r *http.Request) {
			w.Header().Set("Content-Type", "application/json")

			out, err := c.GetNucleos(dbpool)
			if err != nil {
				fmt.Fprintf(os.Stderr, "Query failed: %v\n", err)
				return
			}

			fmt.Println(r.URL)
			json.NewEncoder(w).Encode(out)
		}).Methods("GET")

	router.HandleFunc("/nucleos/{id}",
		func(w http.ResponseWriter, r *http.Request) {
			w.Header().Set("Content-Type", "application/json")
			params := mux.Vars(r)
			idp, _ := params["id"]
			id, err := strconv.Atoi(idp)
			if err != nil {
				w.WriteHeader(404)
				fmt.Fprintf(os.Stderr, "id no valida")
				return
			}

			out, err := c.GetNucleo(dbpool, id)
			if err != nil {
				w.WriteHeader(404)
				fmt.Fprintf(os.Stderr, "Query failed: %v\n", err)
				return
			}

			fmt.Println(r.URL)
			json.NewEncoder(w).Encode(out)
		}).Methods("GET")
	// --------------------------------------------------------------
	router.HandleFunc("/carreras",
		func(w http.ResponseWriter, r *http.Request) {
			w.Header().Set("Content-Type", "application/json")

			out, err := c.GetCarreras(dbpool)
			if err != nil {
				fmt.Fprintf(os.Stderr, "Query failed: %v\n", err)
				return
			}

			fmt.Println(r.URL)
			json.NewEncoder(w).Encode(out)
		}).Methods("GET")

	router.HandleFunc("/carreras/{id}",
		func(w http.ResponseWriter, r *http.Request) {
			w.Header().Set("Content-Type", "application/json")
			params := mux.Vars(r)
			idp, _ := params["id"]
			id, err := strconv.Atoi(idp)
			if err != nil {
				w.WriteHeader(404)
				fmt.Fprintf(os.Stderr, "id no valida")
				return
			}

			out, err := c.GetCarrera(dbpool, id)
			if err != nil {
				w.WriteHeader(404)
				fmt.Fprintf(os.Stderr, "Query failed: %v\n", err)
				return
			}

			fmt.Println(r.URL)
			json.NewEncoder(w).Encode(out)
		}).Methods("GET")
	// --------------------------------------------------------------
	router.HandleFunc("/semestres",
		func(w http.ResponseWriter, r *http.Request) {
			w.Header().Set("Content-Type", "application/json")

			out, err := c.GetSemestres(dbpool)
			if err != nil {
				fmt.Fprintf(os.Stderr, "Query failed: %v\n", err)
				return
			}

			fmt.Println(r.URL)
			json.NewEncoder(w).Encode(out)
		}).Methods("GET")

	router.HandleFunc("/semestres/{id}",
		func(w http.ResponseWriter, r *http.Request) {
			w.Header().Set("Content-Type", "application/json")
			params := mux.Vars(r)
			idp, _ := params["id"]
			id, err := strconv.Atoi(idp)
			if err != nil {
				w.WriteHeader(404)
				fmt.Fprintf(os.Stderr, "id no valida")
				return
			}

			out, err := c.GetSemestre(dbpool, id)
			if err != nil {
				w.WriteHeader(404)
				fmt.Fprintf(os.Stderr, "Query failed: %v\n", err)
				return
			}

			fmt.Println(r.URL)
			json.NewEncoder(w).Encode(out)
		}).Methods("GET")
	// --------------------------------------------------------------
	router.HandleFunc("/infoMaterias",
		func(w http.ResponseWriter, r *http.Request) {
			w.Header().Set("Content-Type", "application/json")

			out, err := c.GetInfoMaterias(dbpool)
			if err != nil {
				fmt.Fprintf(os.Stderr, "Query failed: %v\n", err)
				return
			}

			fmt.Println(r.URL)
			json.NewEncoder(w).Encode(out)
		}).Methods("GET")

	router.HandleFunc("/infoMaterias/{codigo}",
		func(w http.ResponseWriter, r *http.Request) {
			w.Header().Set("Content-Type", "application/json")
			params := mux.Vars(r)
			codigo, _ := params["codigo"]

			out, err := c.GetInfoMateria(dbpool, codigo)
			if err != nil {
				w.WriteHeader(404)
				fmt.Fprintf(os.Stderr, "Query failed: %v\n", err)
				return
			}

			fmt.Println(r.URL)
			json.NewEncoder(w).Encode(out)
		}).Methods("GET")
	// --------------------------------------------------------------
	router.HandleFunc("/materias",
		func(w http.ResponseWriter, r *http.Request) {
			w.Header().Set("Content-Type", "application/json")

			out, err := c.GetMaterias(dbpool)
			if err != nil {
				fmt.Fprintf(os.Stderr, "Query failed: %v\n", err)
				return
			}

			fmt.Println(r.URL)
			json.NewEncoder(w).Encode(out)
		}).Methods("GET")

	router.HandleFunc("/materias/{codigo}/{carrera}",
		func(w http.ResponseWriter, r *http.Request) {
			w.Header().Set("Content-Type", "application/json")
			params := mux.Vars(r)
			codigo, _ := params["codigo"]
			carrera, _ := strconv.Atoi(params["carrera"])

			out, err := c.GetMateria(dbpool, codigo, carrera)
			if err != nil {
				w.WriteHeader(404)
				fmt.Fprintf(os.Stderr, "Query failed: %v\n", err)
				return
			}

			fmt.Println(r.URL)
			json.NewEncoder(w).Encode(out)
		}).Methods("GET")

	router.HandleFunc("/materias/{carrera}",
		func(w http.ResponseWriter, r *http.Request) {
			w.Header().Set("Content-Type", "application/json")
			params := mux.Vars(r)
			// carrera, _ := params["carrera"]
			carrera, _ := strconv.Atoi(params["carrera"])

			out, err := c.GetMateriasCarrera(dbpool, carrera)
			if err != nil {
				w.WriteHeader(404)
				fmt.Fprintf(os.Stderr, "Query failed: %v\n", err)
				return
			}

			fmt.Println(r.URL)
			json.NewEncoder(w).Encode(out)
		}).Methods("GET")
	// --------------------------------------------------------------
	router.HandleFunc("/prelacionMaterias",
		func(w http.ResponseWriter, r *http.Request) {
			w.Header().Set("Content-Type", "application/json")

			out, err := c.GetPrelacionMaterias(dbpool)
			if err != nil {
				fmt.Fprintf(os.Stderr, "Query failed: %v\n", err)
				return
			}

			fmt.Println(r.URL)
			json.NewEncoder(w).Encode(out)
		}).Methods("GET")

	router.HandleFunc("/prelacionMaterias/{codigo}/{carrera}",
		func(w http.ResponseWriter, r *http.Request) {
			w.Header().Set("Content-Type", "application/json")
			params := mux.Vars(r)
			codigo, _ := params["codigo"]
			// carrera, _ := params["carrera"]

			// out, err := c.GetPrelacionMateria(dbpool, codigo, carrera)
			out, err := c.GetPrelacionMateria(dbpool, codigo)
			if err != nil {
				w.WriteHeader(404)
				fmt.Fprintf(os.Stderr, "Query failed: %v\n", err)
				return
			}

			fmt.Println(r.URL)
			json.NewEncoder(w).Encode(out)
		}).Methods("GET")
	// --------------------------------------------------------------
	router.HandleFunc("/prelacionUc",
		func(w http.ResponseWriter, r *http.Request) {
			w.Header().Set("Content-Type", "application/json")

			out, err := c.GetPrelacionUcs(dbpool)
			if err != nil {
				fmt.Fprintf(os.Stderr, "Query failed: %v\n", err)
				return
			}

			fmt.Println(r.URL)
			json.NewEncoder(w).Encode(out)
		}).Methods("GET")

	router.HandleFunc("/prelacionUc/{codigo}/{carrera}",
		func(w http.ResponseWriter, r *http.Request) {
			w.Header().Set("Content-Type", "application/json")
			params := mux.Vars(r)
			codigo, _ := params["codigo"]
			// carrera, _ := params["carrera"]
			carrera, _ := strconv.Atoi(params["carrera"])

			out, err := c.GetPrelacionUc(dbpool, codigo, carrera)
			if err != nil {
				w.WriteHeader(404)
				fmt.Fprintf(os.Stderr, "Query failed: %v\n", err)
				return
			}

			fmt.Println(r.URL)
			json.NewEncoder(w).Encode(out)
		}).Methods("GET")
	// --------------------------------------------------------------


	fmt.Println("Servidor iniciado en el puerto :8000")
	log.Fatal(http.ListenAndServe(":8000", router))

}
