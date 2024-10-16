package main

import (
	"barberTime/routes"
	"log"
	"net/http"

	"github.com/gorilla/handlers"
)

func main() {
	r := routes.ConfigurarRotas()

	// Configurar CORS para permitir todas as origens, métodos e cabeçalhos
	headers := handlers.AllowedHeaders([]string{"X-Requested-With", "Content-Type", "Authorization"})
	methods := handlers.AllowedMethods([]string{"GET", "POST", "PUT", "DELETE", "OPTIONS"})
	origins := handlers.AllowedOrigins([]string{"*"}) // Permitir todas as origens

	log.Println("Servidor iniciado na porta 8080")
	log.Fatal(http.ListenAndServe(":8080", handlers.CORS(origins, headers, methods)(r)))
}
