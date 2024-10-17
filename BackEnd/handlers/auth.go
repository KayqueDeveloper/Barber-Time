package handlers

import (
    "encoding/json"
    "net/http"
)

// Estrutura para o corpo da requisição de login
type LoginRequest struct {
    Email string `json:"email"`
    Senha string `json:"senha"`
}

// Handler para login
func LoginHandler(w http.ResponseWriter, r *http.Request) {
    var creds LoginRequest
    err := json.NewDecoder(r.Body).Decode(&creds)
    if err != nil {
        http.Error(w, "Dados inválidos", http.StatusBadRequest)
        return
    }

    // Exemplo simples de validação (substitua pela verificação real no banco de dados)
    if creds.Email == "admin@email.com" && creds.Senha == "admin123" {
        w.WriteHeader(http.StatusOK)
        w.Write([]byte("Login bem-sucedido"))
    } else {
        http.Error(w, "Credenciais inválidas", http.StatusUnauthorized)
    }
}
