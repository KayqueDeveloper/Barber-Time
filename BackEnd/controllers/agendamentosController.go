package controllers

import (
	db "barberTime/database"
	"barberTime/models"
	"database/sql"
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"

	"github.com/gorilla/mux"
)

// Listar todos os agendamentos
func ListarAgendamentos(w http.ResponseWriter, r *http.Request) {
	db, err := db.Conectar()
	if err != nil {
		http.Error(w, "Erro ao conectar com o banco de dados", http.StatusInternalServerError)
		return
	}
	defer db.Close()

	rows, err := db.Query("SELECT id, cliente_id, funcionario_id, servico_id, data_agendamento, hora_agendamento, status, criado_em FROM barbearia.agendamentos")
	if err != nil {
		http.Error(w, "Erro ao buscar dados", http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	var agendamentos []models.Agendamento
	for rows.Next() {
		var agendamento models.Agendamento
		err := rows.Scan(&agendamento.ID, &agendamento.ClienteID, &agendamento.FuncionarioID, &agendamento.ServicoID, &agendamento.DataAgendamento, &agendamento.HoraAgendamento, &agendamento.Status, &agendamento.CriadoEm)
		if err != nil {
			http.Error(w, "Erro ao escanear dados", http.StatusInternalServerError)
			return
		}
		agendamentos = append(agendamentos, agendamento)
	}

	json.NewEncoder(w).Encode(agendamentos)
}

// Buscar um agendamento específico por ID
func BuscarAgendamento(w http.ResponseWriter, r *http.Request) {
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

	var agendamento models.Agendamento
	err = db.QueryRow("SELECT id, cliente_id, funcionario_id, servico_id, data_agendamento, hora_agendamento, status, criado_em FROM barbearia.agendamentos WHERE id = $1", id).Scan(
		&agendamento.ID, &agendamento.ClienteID, &agendamento.FuncionarioID, &agendamento.ServicoID, &agendamento.DataAgendamento, &agendamento.HoraAgendamento, &agendamento.Status, &agendamento.CriadoEm)

	if err == sql.ErrNoRows {
		http.Error(w, "Agendamento não encontrado", http.StatusNotFound)
		return
	} else if err != nil {
		http.Error(w, "Erro ao buscar agendamento", http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(agendamento)
}

// Criar um novo agendamento
func CriarAgendamento(w http.ResponseWriter, r *http.Request) {
	var agendamento models.Agendamento
	err := json.NewDecoder(r.Body).Decode(&agendamento)
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

	err = db.QueryRow(
		"INSERT INTO barbearia.agendamentos (cliente_id, funcionario_id, servico_id, data_agendamento, hora_agendamento, status, criado_em) VALUES ($1, $2, $3, $4, $5, $6, NOW()) RETURNING id",
		agendamento.ClienteID, agendamento.FuncionarioID, agendamento.ServicoID, agendamento.DataAgendamento, agendamento.HoraAgendamento, agendamento.Status,
	).Scan(&agendamento.ID)

	if err != nil {
		http.Error(w, "Erro ao criar agendamento", http.StatusInternalServerError)
		fmt.Println(err)
		return
	}

	json.NewEncoder(w).Encode(agendamento)
}

// Atualizar um agendamento existente
func AtualizarAgendamento(w http.ResponseWriter, r *http.Request) {
	params := mux.Vars(r)
	id, err := strconv.Atoi(params["id"])
	if err != nil {
		http.Error(w, "ID inválido", http.StatusBadRequest)
		return
	}

	var agendamento models.Agendamento
	err = json.NewDecoder(r.Body).Decode(&agendamento)
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

	_, err = db.Exec(
		"UPDATE barbearia.agendamentos SET cliente_id = $1, funcionario_id = $2, servico_id = $3, data_agendamento = $4, hora_agendamento = $5, status = $6 WHERE id = $7",
		agendamento.ClienteID, agendamento.FuncionarioID, agendamento.ServicoID, agendamento.DataAgendamento, agendamento.HoraAgendamento, agendamento.Status, id,
	)

	if err != nil {
		http.Error(w, "Erro ao atualizar agendamento", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusNoContent)
}

// Excluir um agendamento
func ExcluirAgendamento(w http.ResponseWriter, r *http.Request) {
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

	_, err = db.Exec("DELETE FROM barbearia.agendamentos WHERE id = $1", id)
	if err != nil {
		http.Error(w, "Erro ao excluir agendamento", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusNoContent)
}
