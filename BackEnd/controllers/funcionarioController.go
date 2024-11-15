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

func ListarFuncionarios(w http.ResponseWriter, r *http.Request) {
	db, err := db.Conectar()
	if err != nil {
		http.Error(w, "Erro ao conectar com o banco de dados", http.StatusInternalServerError)
		return
	}
	defer db.Close()

	// Lendo os parâmetros de paginação, pesquisa e filtro de cargo
	pageParam := r.URL.Query().Get("page")
	limitParam := r.URL.Query().Get("limit")
	search := r.URL.Query().Get("search")
	cargo := r.URL.Query().Get("cargo") // Novo parâmetro de filtro para cargo

	page, err := strconv.Atoi(pageParam)
	if err != nil || page < 1 {
		page = 1
	}
	limit, err := strconv.Atoi(limitParam)
	if err != nil || limit < 1 {
		limit = 5 // Limite de funcionários por página
	}

	offset := (page - 1) * limit

	// Construindo a query com filtro de cargo, se presente
	query := "SELECT id, nome, especialidade, telefone, cargo, cpf, salario FROM barbearia.funcionarios WHERE nome ILIKE '%' || $1 || '%'"

	// Adicionando o filtro de cargo à query, se o parâmetro cargo for fornecido
	var rows *sql.Rows
	if cargo != "" {
		query += " AND LOWER(cargo) = LOWER($2)" // Usando LOWER para comparação insensível a caso
		query += " ORDER BY nome LIMIT $3 OFFSET $4"
		rows, err = db.Query(query, search, cargo, limit, offset)
	} else {
		query += " ORDER BY nome LIMIT $2 OFFSET $3"
		rows, err = db.Query(query, search, limit, offset)
	}

	if err != nil {
		http.Error(w, "Erro ao buscar dados: "+err.Error(), http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	var funcionarios []models.Funcionario
	for rows.Next() {
		var funcionario models.Funcionario
		err := rows.Scan(&funcionario.ID, &funcionario.Nome, &funcionario.Especialidade, &funcionario.Telefone, &funcionario.Cargo, &funcionario.Cpf, &funcionario.Salario)
		if err != nil {
			http.Error(w, "Erro ao escanear dados", http.StatusInternalServerError)
			return
		}
		funcionarios = append(funcionarios, funcionario)
	}

	// Contando o total de funcionários com o filtro de pesquisa e cargo
	var totalFuncionarios int
	if cargo != "" {
		err = db.QueryRow("SELECT COUNT(*) FROM barbearia.funcionarios WHERE nome ILIKE '%' || $1 || '%' AND LOWER(cargo) = LOWER($2)", search, cargo).Scan(&totalFuncionarios)
	} else {
		err = db.QueryRow("SELECT COUNT(*) FROM barbearia.funcionarios WHERE nome ILIKE '%' || $1 || '%'", search).Scan(&totalFuncionarios)
	}

	if err != nil {
		http.Error(w, "Erro ao contar funcionários: "+err.Error(), http.StatusInternalServerError)
		return
	}

	totalPages := (totalFuncionarios + limit - 1) / limit

	// Montando a resposta JSON
	response := map[string]interface{}{
		"funcionarios": funcionarios,
		"totalPages":   totalPages,
		"currentPage":  page,
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

// Buscar um funcionário específico por ID
func BuscarFuncionario(w http.ResponseWriter, r *http.Request) {
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

	var funcionario models.Funcionario
	err = db.QueryRow("SELECT id, nome, especialidade, telefone, criado_em, cargo, cpf, salario FROM barbearia.funcionarios WHERE id = $1", id).Scan(
		&funcionario.ID, &funcionario.Nome, &funcionario.Especialidade, &funcionario.Telefone, &funcionario.CriadoEm, &funcionario.Cargo, &funcionario.Cpf, &funcionario.Salario)

	if err == sql.ErrNoRows {
		http.Error(w, "Funcionário não encontrado", http.StatusNotFound)
		return
	} else if err != nil {
		http.Error(w, "Erro ao buscar funcionário", http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(funcionario)
}

// Criar um novo funcionário
func CriarFuncionario(w http.ResponseWriter, r *http.Request) {
	var funcionario models.Funcionario
	err := json.NewDecoder(r.Body).Decode(&funcionario)
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

	err = db.QueryRow("INSERT INTO barbearia.funcionarios (nome, especialidade, telefone, criado_em, cargo, cpf, salario) VALUES ($1, $2, $3, NOW(), $4, $5, $6) RETURNING id",
		funcionario.Nome, funcionario.Especialidade, funcionario.Telefone, funcionario.Cargo, funcionario.Cpf, funcionario.Salario).Scan(&funcionario.ID)

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(funcionario)
}

// Atualizar um funcionário existente
func AtualizarFuncionario(w http.ResponseWriter, r *http.Request) {
	params := mux.Vars(r)
	id, err := strconv.Atoi(params["id"])
	if err != nil {
		http.Error(w, "ID inválido", http.StatusBadRequest)
		return
	}

	var funcionario models.Funcionario
	err = json.NewDecoder(r.Body).Decode(&funcionario)
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

	_, err = db.Exec("UPDATE barbearia.funcionarios SET nome = $1, especialidade = $2, telefone = $3, cargo = $5, cpf = $6, salario = $7 WHERE id = $4",
		funcionario.Nome, funcionario.Especialidade, funcionario.Telefone, id, funcionario.Cargo, funcionario.Cpf, funcionario.Salario)

	if err != nil {
		http.Error(w, "Erro ao atualizar funcionário", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusNoContent)
}

// Excluir um funcionário
func ExcluirFuncionario(w http.ResponseWriter, r *http.Request) {
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

	_, err = db.Exec("DELETE FROM barbearia.funcionarios WHERE id = $1", id)
	if err != nil {
		http.Error(w, "Erro ao excluir funcionário", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusNoContent)
}
