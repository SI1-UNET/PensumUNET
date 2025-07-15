package routes

import (
	"Server/controllers"
	"net/http"

	"github.com/gorilla/mux"
)

func CarrerasRoutes() http.Handler {
	r := mux.NewRouter()

	r.HandleFunc("/courses/all", controllers.GetAllCarreras).Methods("GET")

	return r
}
