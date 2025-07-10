package routes

import (
	"fmt"
	"net/http"

	"github.com/gorilla/mux"
)

func Init(router *mux.Router) {
	api := router.PathPrefix("").Subrouter()

	//Middlewares
	router.Use(corsMiddleware)

	// Rest API routes
	api.PathPrefix("/materias").Handler(MateriasRoutes())

	// Health check
	router.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprintf(w, "Ryuk is the best dog!\n")
	})

}

func corsMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization, hx-request, hx-current-url")
		w.Header().Set("Access-Control-Allow-Credentials", "true")
		w.Header().Set("Access-Control-Max-Age", "86400")

		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusNoContent)
			return
		}

		next.ServeHTTP(w, r)
	})
}
