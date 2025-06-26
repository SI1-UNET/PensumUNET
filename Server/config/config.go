package config

import (
	"context"
	"fmt"
	"log"
	"os"

	"github.com/gorilla/websocket"
	"github.com/jackc/pgx/v5"
	"github.com/joho/godotenv"
)

var (
	PsqlDB = ConnectPsqlDB()
)

func ConnectPsqlDB() *pgx.Conn {
	err := godotenv.Load(".env")
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	connection, err := pgx.Connect(context.Background(), os.Getenv("DATABASE_URL"))
	if err != nil {
		fmt.Fprintf(os.Stderr, "\nUnable to connect to database: %v\n", err)
		os.Exit(1)
	}

	return connection
}

var WsUpgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	// configure CORS
}
