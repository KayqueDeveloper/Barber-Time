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

	rows, err := db.Query("SELECT id, nome, especialidade, telefone, criado_em FROM barbearia.funcionarios")
	if err != nil {
		http.Error(w, "Erro ao buscar dados", http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	var funcionarios []models.Funcionario
	for rows.Next() {
		var funcionario models.Funcionario
		err := rows.Scan(&funcionario.ID, &funcionario.Nome, &funcionario.Especialidade, &funcionario.Telefone, &funcionario.CriadoEm)
		if err != nil {
			http.Error(w, "Erro ao escanear dados", http.StatusInternalServerError)
			return
		}
		funcionarios = append(funcionarios, funcionario)
	}

	json.NewEncoder(w).Encode(funcionarios)
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
	err = db.QueryRow("SELECT id, nome, especialidade, telefone, criado_em FROM barbearia.funcionarios WHERE id = $1", id).Scan(
		&funcionario.ID, &funcionario.Nome, &funcionario.Especialidade, &funcionario.Telefone, &funcionario.CriadoEm)

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

	err = db.QueryRow("INSERT INTO barbearia.funcionarios (nome, especialidade, telefone, criado_em) VALUES ($1, $2, $3, NOW()) RETURNING id",
		funcionario.Nome, funcionario.Especialidade, funcionario.Telefone).Scan(&funcionario.ID)

	if err != nil {
		http.Error(w, "Erro ao criar funcionário", http.StatusInternalServerError)
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

	_, err = db.Exec("UPDATE barbearia.funcionarios SET nome = $1, especialidade = $2, telefone = $3 WHERE id = $4",
		funcionario.Nome, funcionario.Especialidade, funcionario.Telefone, id)

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
