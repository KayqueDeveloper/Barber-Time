package controllers

import (
	db "barberTime/database"
	"encoding/json"
	"net/http"
)

// Obter agendamentos por mês
func AgendamentosPorMes(w http.ResponseWriter, r *http.Request) {
	db, err := db.Conectar()
	if err != nil {
		http.Error(w, "Erro ao conectar com o banco de dados", http.StatusInternalServerError)
		return
	}
	defer db.Close()

	rows, err := db.Query("SELECT EXTRACT(MONTH FROM data_agendamento) AS mes, COUNT(*) AS quantidade FROM barbearia.agendamentos GROUP BY mes ORDER BY mes")
	if err != nil {
		http.Error(w, "Erro ao buscar dados", http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	var agendamentosPorMes []struct {
		Mes        int `json:"mes"`
		Quantidade int `json:"quantidade"`
	}
	for rows.Next() {
		var agendamento struct {
			Mes        int `json:"mes"`
			Quantidade int `json:"quantidade"`
		}
		err := rows.Scan(&agendamento.Mes, &agendamento.Quantidade)
		if err != nil {
			http.Error(w, "Erro ao escanear dados", http.StatusInternalServerError)
			return
		}
		agendamentosPorMes = append(agendamentosPorMes, agendamento)
	}

	json.NewEncoder(w).Encode(agendamentosPorMes)
}

// Obter serviços mais populares
func ServicosMaisPopulares(w http.ResponseWriter, r *http.Request) {
	db, err := db.Conectar()
	if err != nil {
		http.Error(w, "Erro ao conectar com o banco de dados", http.StatusInternalServerError)
		return
	}
	defer db.Close()

	rows, err := db.Query("SELECT nome, COUNT(*) AS quantidade FROM barbearia.servicos s JOIN barbearia.agendamentos a ON s.id = a.servico_id GROUP BY s.id ORDER BY quantidade DESC LIMIT 5")
	if err != nil {
		http.Error(w, "Erro ao buscar dados", http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	var servicosMaisPopulares []struct {
		Nome       string `json:"nome"`
		Quantidade int    `json:"quantidade"`
	}
	for rows.Next() {
		var servico struct {
			Nome       string `json:"nome"`
			Quantidade int    `json:"quantidade"`
		}
		err := rows.Scan(&servico.Nome, &servico.Quantidade)
		if err != nil {
			http.Error(w, "Erro ao escanear dados", http.StatusInternalServerError)
			return
		}
		servicosMaisPopulares = append(servicosMaisPopulares, servico)
	}

	json.NewEncoder(w).Encode(servicosMaisPopulares)
}

// Obter funcionários mais ativos
func FuncionariosMaisAtivos(w http.ResponseWriter, r *http.Request) {
	db, err := db.Conectar()
	if err != nil {
		http.Error(w, "Erro ao conectar com o banco de dados", http.StatusInternalServerError)
		return
	}
	defer db.Close()

	rows, err := db.Query("SELECT f.nome, COUNT(a.id) AS agendamentos FROM barbearia.funcionarios f LEFT JOIN barbearia.agendamentos a ON f.id = a.funcionario_id GROUP BY f.id ORDER BY agendamentos DESC LIMIT 5")
	if err != nil {
		http.Error(w, "Erro ao buscar dados", http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	var funcionariosMaisAtivos []struct {
		Nome         string `json:"nome"`
		Agendamentos int    `json:"agendamentos"`
	}
	for rows.Next() {
		var funcionario struct {
			Nome         string `json:"nome"`
			Agendamentos int    `json:"agendamentos"`
		}
		err := rows.Scan(&funcionario.Nome, &funcionario.Agendamentos)
		if err != nil {
			http.Error(w, "Erro ao escanear dados", http.StatusInternalServerError)
			return
		}
		funcionariosMaisAtivos = append(funcionariosMaisAtivos, funcionario)
	}

	json.NewEncoder(w).Encode(funcionariosMaisAtivos)
}
