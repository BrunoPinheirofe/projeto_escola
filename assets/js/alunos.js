document.addEventListener('DOMContentLoaded', function() {
    const alunoForm = document.getElementById('aluno-form');

    if (alunoForm) {
        alunoForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            const nome = document.getElementById('nome').value.trim();
            const dataNascimento = document.getElementById('data-nascimento').value;
            const cpf = document.getElementById('cpf').value.trim();
            const endereco = document.getElementById('endereco').value.trim();
            const telefone = document.getElementById('telefone').value.trim();
            const email = document.getElementById('email').value.trim();
            
            if (!validateForm(nome, dataNascimento, cpf, endereco)) {
                return false;
            }
            
            const aluno = {
                id: generateId(),
                nome,
                dataNascimento,
                cpf,
                endereco,
                telefone,
                email,
                dataRegistro: new Date().toISOString()
            };
            
            
            saveAluno(aluno);
            
            
            alunoForm.reset();
        
            alert('Aluno cadastrado com sucesso!');
        });
        
        const cpfInput = document.getElementById('cpf');
        if (cpfInput) {
            cpfInput.addEventListener('input', function() {
                let value = cpfInput.value.replace(/\D/g, '');
                if (value.length > 11) {
                    value = value.slice(0, 11);
                }
                if (value.length > 9) {
                    cpfInput.value = `${value.slice(0, 3)}.${value.slice(3, 6)}.${value.slice(6, 9)}-${value.slice(9)}`;
                } else if (value.length > 6) {
                    cpfInput.value = `${value.slice(0, 3)}.${value.slice(3, 6)}.${value.slice(6)}`;
                } else if (value.length > 3) {
                    cpfInput.value = `${value.slice(0, 3)}.${value.slice(3)}`;
                } else {
                    cpfInput.value = value;
                }
            });
        }
        
    
        const telefoneInput = document.getElementById('telefone');
        if (telefoneInput) {
            telefoneInput.addEventListener('input', function() {
                let value = telefoneInput.value.replace(/\D/g, '');
                if (value.length > 11) {
                    value = value.slice(0, 11);
                }
                if (value.length > 10) {
                    telefoneInput.value = `(${value.slice(0, 2)}) ${value.slice(2, 7)}-${value.slice(7)}`;
                } else if (value.length > 6) {
                    telefoneInput.value = `(${value.slice(0, 2)}) ${value.slice(2, 6)}-${value.slice(6)}`;
                } else if (value.length > 2) {
                    telefoneInput.value = `(${value.slice(0, 2)}) ${value.slice(2)}`;
                } else {
                    telefoneInput.value = value;
                }
            });
        }
    }
    
    function validateForm(nome, dataNascimento, cpf, endereco) {
        if (!nome) {
            alert('Nome é obrigatório');
            return false;
        }
        
        if (!dataNascimento) {
            alert('Data de nascimento é obrigatória');
            return false;
        }
        
        if (!cpf) {
            alert('CPF é obrigatório');
            return false;
        }
        
        if (!cpf.match(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/)) {
            alert('CPF inválido. Utilize o formato XXX.XXX.XXX-XX');
            return false;
        }
        
        if (!endereco) {
            alert('Endereço é obrigatório');
            return false;
        }
        
        return true;
    }
    
});
