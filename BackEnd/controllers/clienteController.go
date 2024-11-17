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

	// Lendo os parâmetros de paginação e pesquisa
	pageParam := r.URL.Query().Get("page")
	limitParam := r.URL.Query().Get("limit")
	search := r.URL.Query().Get("search")

	// Configuração de paginação padrão
	page, err := strconv.Atoi(pageParam)
	if err != nil || page < 1 {
		page = 1
	}
	limit, err := strconv.Atoi(limitParam)
	if err != nil || limit < 1 {
		limit = 1000 // Define o número de clientes por página (ajuste conforme necessário)
	}

	// Offset para calcular a posição inicial da página
	offset := (page - 1) * limit

	// Query com filtro de pesquisa e paginação
	query := "SELECT id, nome, telefone, email, criado_em, cpf, cep, rua, bairro, cidade, estado FROM barbearia.clientes WHERE nome ILIKE '%' || $1 || '%' ORDER BY nome LIMIT $2 OFFSET $3"
	rows, err := db.Query(query, search, limit, offset)
	if err != nil {
		http.Error(w, "Erro ao buscar dados", http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	// Construindo a lista de clientes
	var clientes []models.Cliente
	for rows.Next() {
		var cliente models.Cliente
		err := rows.Scan(&cliente.ID, &cliente.Nome, &cliente.Telefone, &cliente.Email, &cliente.CriadoEm, &cliente.Cpf, &cliente.Cep, &cliente.Rua, &cliente.Bairro, &cliente.Cidade, &cliente.Estado)
		if err != nil {
			http.Error(w, "Erro ao escanear dados", http.StatusInternalServerError)
			return
		}
		clientes = append(clientes, cliente)
	}

	// Contagem total de clientes para a paginação
	var totalClientes int
	err = db.QueryRow("SELECT COUNT(*) FROM barbearia.clientes WHERE nome ILIKE '%' || $1 || '%'", search).Scan(&totalClientes)
	if err != nil {
		http.Error(w, "Erro ao contar clientes", http.StatusInternalServerError)
		return
	}

	// Cálculo do número total de páginas
	totalPages := (totalClientes + limit - 1) / limit // Arredonda para cima

	// Criação da resposta com clientes e informações de paginação
	response := map[string]interface{}{
		"clientes":    clientes,
		"totalPages":  totalPages,
		"currentPage": page,
	}

	// Enviar resposta em JSON
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
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
	err = db.QueryRow("SELECT id, nome, telefone, email, criado_em, cpf, cep, rua, bairro, cidade, estado FROM barbearia.clientes WHERE id = $1", id).Scan(
		&cliente.ID, &cliente.Nome, &cliente.Telefone, &cliente.Email, &cliente.CriadoEm, &cliente.Cpf, &cliente.Cep, &cliente.Rua, &cliente.Bairro, &cliente.Cidade, &cliente.Estado)

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

	err = db.QueryRow("INSERT INTO barbearia.clientes (nome, telefone, email, criado_em, cpf, cep, rua, bairro, cidade, estado) VALUES ($1, $2, $3, NOW(), $4, $5, $6, $7, $8, $9) RETURNING id",
		cliente.Nome, cliente.Telefone, cliente.Email, cliente.Cpf, cliente.Cep, cliente.Rua, cliente.Bairro, cliente.Cidade, cliente.Estado).Scan(&cliente.ID)

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

	_, err = db.Exec("UPDATE barbearia.clientes SET nome = $1, telefone = $2, email = $3, cpf = $4, cep = $5, rua = $6, bairro = $7, cidade = $8, estado = $9 WHERE id = $10",
		cliente.Nome, cliente.Telefone, cliente.Email, cliente.Cpf, cliente.Cep, cliente.Rua, cliente.Bairro, cliente.Cidade, cliente.Estado, id)

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
