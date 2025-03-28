document.addEventListener('DOMContentLoaded', function() {
    const alunoForm = document.getElementById('aluno-form');

    if (alunoForm) {
        alunoForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            // Get form values
            const nome = document.getElementById('nome').value.trim();
            const dataNascimento = document.getElementById('data-nascimento').value;
            const cpf = document.getElementById('cpf').value.trim();
            const endereco = document.getElementById('endereco').value.trim();
            const telefone = document.getElementById('telefone').value.trim();
            const email = document.getElementById('email').value.trim();
            
            // Validate form
            if (!validateForm(nome, dataNascimento, cpf, endereco)) {
                return false;
            }
            
            // Create student object
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
            
            // Save student to localStorage
            saveAluno(aluno);
            
            // Reset form
            alunoForm.reset();
            
            // Show success message
            alert('Aluno cadastrado com sucesso!');
        });
        
        // Add CPF formatting
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
        
        // Add phone formatting
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
        
        // Validate CPF format (xxx.xxx.xxx-xx)
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
    
    function saveAluno(aluno) {
        // Get existing students or initialize empty array
        const alunos = JSON.parse(localStorage.getItem('alunos') || '[]');
        
        // Add new student
        alunos.push(aluno);
        
        // Save back to localStorage
        localStorage.setItem('alunos', JSON.stringify(alunos));
    }
    
    function generateId() {
        // Simple ID generation
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }
});
