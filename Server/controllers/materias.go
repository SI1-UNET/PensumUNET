package controllers

import (
	"Server/config"
	"Server/models"
	"encoding/json"
	"net/http"

	"github.com/gorilla/mux"
)

func GetAllMaterias(w http.ResponseWriter, r *http.Request) {
	materias, err := models.GetAllMaterias()
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte("Unable to get materias"))
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.Header().Add("Status-Code", "200")
	json.NewEncoder(w).Encode(materias)
}

func GetMateriasDeDepartamento(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id := vars["id"]

	var materia models.Materia
	materia.Departamento = id
	materias, err := materia.GetMateriasDeDepartamento(config.PsqlDB)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte("Unable to get stops"))
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.Header().Add("Status-Code", "200")
	json.NewEncoder(w).Encode(materias)

}
