package routes

import (
	"Server/controllers"
	"net/http"

	"github.com/gorilla/mux"
)

func NucleosRoutes() http.Handler {
	r := mux.NewRouter()

	r.HandleFunc("/nucleos/all", controllers.GetAllDepartamento).Methods("GET")

	return r
}
