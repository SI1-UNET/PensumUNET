package routes

import (
	"Server/controllers"
	"net/http"

	"github.com/gorilla/mux"
)

func MateriasRoutes() http.Handler {
	r := mux.NewRouter()

	r.HandleFunc("/materias/{id}/all", controllers.GetMateriasDeCarrera).Methods("GET")
	r.HandleFunc("/materias/departamento/{name}", controllers.GetMateriasDeDepartamento).Methods("GET")
	r.HandleFunc("/materias/all", controllers.GetAllMaterias).Methods("GET")

	return r
}
