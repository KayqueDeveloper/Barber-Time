package controllers

import (
	db "barberTime/database"
	"barberTime/models"
	"database/sql"
	"encoding/json"
	"net/http"
	"strconv"

	"github.com/gorilla/mux"
)

// Listar todos os clientes
func ListarClientes(w http.ResponseWriter, r *http.Request) {
	db, err := db.Conectar()
	if err != nil {
		http.Error(w, "Erro ao conectar com o banco de dados", http.StatusInternalServerError)
		return
	}
	defer db.Close()

	rows, err := db.Query("SELECT id, nome, telefone, email, criado_em FROM barbearia.clientes")
	if err != nil {
		http.Error(w, "Erro ao buscar dados", http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	var clientes []models.Cliente
	for rows.Next() {
		var cliente models.Cliente
		err := rows.Scan(&cliente.ID, &cliente.Nome, &cliente.Telefone, &cliente.Email, &cliente.CriadoEm)
		if err != nil {
			http.Error(w, "Erro ao escanear dados", http.StatusInternalServerError)
			return
		}
		clientes = append(clientes, cliente)
	}

	json.NewEncoder(w).Encode(clientes)
}

// Buscar um cliente específico por ID
func BuscarCliente(w http.ResponseWriter, r *http.Request) {
	params := mux.Vars(r)
	id, err := strconv.Atoi(params["id"])
	if err != nil {
		http.Error(w, "ID inválido", http.StatusBadRequest)
		return
	}

	db, err := db.Conectar()
	if err != nil {
		http.Error(w, "Erro ao conectar com o banco de dados", http.StatusInternalServerError)
		return
	}
	defer db.Close()

	var cliente models.Cliente
	err = db.QueryRow("SELECT id, nome, telefone, email, criado_em FROM barbearia.clientes WHERE id = $1", id).Scan(
		&cliente.ID, &cliente.Nome, &cliente.Telefone, &cliente.Email, &cliente.CriadoEm)

	if err == sql.ErrNoRows {
		http.Error(w, "Cliente não encontrado", http.StatusNotFound)
		return
	} else if err != nil {
		http.Error(w, "Erro ao buscar cliente", http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(cliente)
}

// Criar um novo cliente
func CriarCliente(w http.ResponseWriter, r *http.Request) {
	var cliente models.Cliente
	err := json.NewDecoder(r.Body).Decode(&cliente)
	if err != nil {
		http.Error(w, "Dados inválidos", http.StatusBadRequest)
		return
	}

	db, err := db.Conectar()
	if err != nil {
		http.Error(w, "Erro ao conectar com o banco de dados", http.StatusInternalServerError)
		return
	}
	defer db.Close()

	err = db.QueryRow("INSERT INTO barbearia.clientes (nome, telefone, email, criado_em) VALUES ($1, $2, $3, NOW()) RETURNING id",
		cliente.Nome, cliente.Telefone, cliente.Email).Scan(&cliente.ID)

	if err != nil {
		http.Error(w, "Erro ao criar cliente", http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(cliente)
}

// Atualizar um cliente existente
func AtualizarCliente(w http.ResponseWriter, r *http.Request) {
	params := mux.Vars(r)
	id, err := strconv.Atoi(params["id"])
	if err != nil {
		http.Error(w, "ID inválido", http.StatusBadRequest)
		return
	}

	var cliente models.Cliente
	err = json.NewDecoder(r.Body).Decode(&cliente)
	if err != nil {
		http.Error(w, "Dados inválidos", http.StatusBadRequest)
		return
	}

	db, err := db.Conectar()
	if err != nil {
		http.Error(w, "Erro ao conectar com o banco de dados", http.StatusInternalServerError)
		return
	}
	defer db.Close()

	_, err = db.Exec("UPDATE barbearia.clientes SET nome = $1, telefone = $2, email = $3 WHERE id = $4",
		cliente.Nome, cliente.Telefone, cliente.Email, id)

	if err != nil {
		http.Error(w, "Erro ao atualizar cliente", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusNoContent)
}

// Excluir um cliente
func ExcluirCliente(w http.ResponseWriter, r *http.Request) {
	params := mux.Vars(r)
	id, err := strconv.Atoi(params["id"])
	if err != nil {
		http.Error(w, "ID inválido", http.StatusBadRequest)
		return
	}

	db, err := db.Conectar()
	if err != nil {
		http.Error(w, "Erro ao conectar com o banco de dados", http.StatusInternalServerError)
		return
	}
	defer db.Close()

	_, err = db.Exec("DELETE FROM barbearia.clientes WHERE id = $1", id)
	if err != nil {
		http.Error(w, "Erro ao excluir cliente", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusNoContent)
}
