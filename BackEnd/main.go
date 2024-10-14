package main

import (
	"barberTime/routes"
	"log"
	"net/http"
)

func main() {
	r := routes.ConfigurarRotas()

	log.Println("Servidor iniciado na porta 8080")
	log.Fatal(http.ListenAndServe(":8080", r))
}
