package db

import (
	"database/sql"
	"log"

	_ "github.com/lib/pq"
)

func Conectar() (*sql.DB, error) {
	connStr := "user=postgres password=12345678 dbname=postgres sslmode=disable"
	db, err := sql.Open("postgres", connStr)
	if err != nil {
		log.Fatal(err)
		return nil, err
	}
	return db, nil
}
