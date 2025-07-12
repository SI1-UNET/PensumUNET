package routes

import (
	"Server/controllers"
	"net/http"

	"github.com/gorilla/mux"
)

func DepartamentosRoutes() http.Handler {
	r := mux.NewRouter()

	r.HandleFunc("/departamentos/all", controllers.GetAllDepartamento).Methods("GET")

	return r
}
