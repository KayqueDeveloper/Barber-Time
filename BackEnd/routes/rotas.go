package routes

import (
	"barberTime/controllers"

	"github.com/gorilla/mux"
)

func ConfigurarRotas() *mux.Router {
	r := mux.NewRouter()

	// Rotas de Clientes
	r.HandleFunc("/clientes", controllers.ListarClientes).Methods("GET")
	r.HandleFunc("/clientes/{id}", controllers.BuscarCliente).Methods("GET")
	r.HandleFunc("/clientes", controllers.CriarCliente).Methods("POST")
	r.HandleFunc("/clientes/{id}", controllers.AtualizarCliente).Methods("PUT")
	r.HandleFunc("/clientes/{id}", controllers.ExcluirCliente).Methods("DELETE")

	// Rotas de Funcionários
	r.HandleFunc("/funcionarios", controllers.ListarFuncionarios).Methods("GET")
	r.HandleFunc("/funcionarios/{id}", controllers.BuscarFuncionario).Methods("GET")
	r.HandleFunc("/funcionarios", controllers.CriarFuncionario).Methods("POST")
	r.HandleFunc("/funcionarios/{id}", controllers.AtualizarFuncionario).Methods("PUT")
	r.HandleFunc("/funcionarios/{id}", controllers.ExcluirFuncionario).Methods("DELETE")

	// Rotas de Serviços
	r.HandleFunc("/servicos", controllers.ListarServicos).Methods("GET")
	r.HandleFunc("/servicos/{id}", controllers.BuscarServico).Methods("GET")
	r.HandleFunc("/servicos", controllers.CriarServico).Methods("POST")
	r.HandleFunc("/servicos/{id}", controllers.AtualizarServico).Methods("PUT")
	r.HandleFunc("/servicos/{id}", controllers.ExcluirServico).Methods("DELETE")

	// Rotas de Agendamentos
	r.HandleFunc("/agendamentos", controllers.ListarAgendamentos).Methods("GET")
	r.HandleFunc("/agendamentos/{id}", controllers.BuscarAgendamento).Methods("GET")
	r.HandleFunc("/agendamentos", controllers.CriarAgendamento).Methods("POST")
	r.HandleFunc("/agendamentos/{id}", controllers.AtualizarAgendamento).Methods("PUT")
	r.HandleFunc("/agendamentos/{id}", controllers.ExcluirAgendamento).Methods("DELETE")

	// Rotas de Configurações
	r.HandleFunc("/configuracoes", controllers.BuscarConfiguracao).Methods("GET")
	r.HandleFunc("/configuracoes", controllers.AtualizarConfiguracao).Methods("PUT")

	return r
}
