package controllers

import (
	"Server/models"
	"encoding/json"
	"net/http"
)

func GetAllCarreras(w http.ResponseWriter, r *http.Request) {
	carreras, err := models.GetAllCarreras()
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte("Unable to get Carreras"))
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.Header().Add("Status-Code", "200")
	json.NewEncoder(w).Encode(carreras)
}
