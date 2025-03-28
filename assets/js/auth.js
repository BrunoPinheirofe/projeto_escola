const BASE_URL = "http://localhost:3001";
const API_URL = `${BASE_URL}/users`;

document.getElementById("login-form").addEventListener("submit", function(event) {
    event.preventDefault();
    const usuario = document.getElementById("username").value.trim();
    const senha = document.getElementById("password").value.trim();

    if (!usuario || !senha) {
        alert("Usuário e senha são obrigatórios");
        return false;
    }
    else{
        window.location.href = "../../cadastro-aluno.html";
    }

        });
    
    
