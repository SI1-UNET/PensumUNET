package routes

import (
	"Server/controllers"
	"net/http"

	"github.com/gorilla/mux"
)

func MateriasRoutes() http.Handler {
	r := mux.NewRouter()

	r.HandleFunc("/materias/all", controllers.GetAllMaterias).Methods("GET")
	r.HandleFunc("/materias/{id}/all", controllers.GetAllMaterias).Methods("GET")
	r.HandleFunc("/materias/departamento/{name}", controllers.GetMateriasDeDepartamento).Methods("GET")

	return r
}
