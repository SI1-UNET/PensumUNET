package main

import (
	"fmt"
	"net/http"
	"time"

	"Server/config"
	"Server/models"
	"Server/routes"

	"github.com/gorilla/mux"
)

func main() {

	models.DropDB(config.PsqlDB)
	models.InitDB(config.PsqlDB)
	models.LoadSampleData(config.PsqlDB)

	router := mux.NewRouter()
	routes.Init(router)

	srv := &http.Server{
		Addr:         "localhost:8080",
		WriteTimeout: time.Second * 15,
		ReadTimeout:  time.Second * 15,
		IdleTimeout:  time.Second * 60,
		Handler:      router,
	}

	if err := srv.ListenAndServe(); err != nil {
		fmt.Println(err)
	}
}
