package controllers

import (
	"Server/models"
	"encoding/json"
	"net/http"
)

func GetAllNucleos(w http.ResponseWriter, r *http.Request) {
	materias, err := models.GetAllNucleos()
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte("Unable to get Nucleos"))
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.Header().Add("Status-Code", "200")
	json.NewEncoder(w).Encode(materias)
}
