document.addEventListener('DOMContentLoaded', function() {
    const paisForm = document.getElementById('pais-form');
    const alunoSelect = document.getElementById('aluno-relacionado');
    
    // Populate students dropdown if it exists
    if (alunoSelect) {
        populateAlunosDropdown();
    }
    
    if (paisForm) {
        paisForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            // Get form values
            const nome = document.getElementById('nome').value.trim();
            const cpf = document.getElementById('cpf').value.trim();
            const telefone = document.getElementById('telefone').value.trim();
            const email = document.getElementById('email').value.trim();
            const endereco = document.getElementById('endereco').value.trim();
            const alunoId = document.getElementById('aluno-relacionado').value;
            const parentesco = document.getElementById('parentesco').value;
            
            // Validate form
            if (!validateForm(nome, cpf, telefone, email, endereco, alunoId)) {
                return false;
            }
            
            // Create parent object
            const pai = {
                id: generateId(),
                nome,
                cpf,
                telefone,
                email,
                endereco,
                alunoId,
                parentesco,
                dataRegistro: new Date().toISOString()
            };
            
            // Save parent to localStorage
            savePai(pai);
            
            // Reset form
            paisForm.reset();
            
            // Show success message
            alert('Pai/Responsável cadastrado com sucesso!');
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
    
    function populateAlunosDropdown() {
        // Get existing students from localStorage
        const alunos = JSON.parse(localStorage.getItem('alunos') || '[]');
        
        // Clear existing options except the placeholder
        while (alunoSelect.options.length > 1) {
            alunoSelect.remove(1);
        }
        
        // Add student options
        alunos.forEach(aluno => {
            const option = document.createElement('option');
            option.value = aluno.id;
            option.textContent = aluno.nome;
            alunoSelect.appendChild(option);
        });
    }
    
    function validateForm(nome, cpf, telefone, email, endereco, alunoId) {
        if (!nome) {
            alert('Nome é obrigatório');
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
        
        if (!telefone) {
            alert('Telefone é obrigatório');
            return false;
        }
        
        if (!email) {
            alert('Email é obrigatório');
            return false;
        }
        
        // Validate email format
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            alert('Email inválido');
            return false;
        }
        
        if (!endereco) {
            alert('Endereço é obrigatório');
            return false;
        }
        
        if (!alunoId) {
            alert('Selecione um aluno relacionado');
            return false;
        }
        
        return true;
    }
    
    function savePai(pai) {
        // Get existing parents or initialize empty array
        const pais = JSON.parse(localStorage.getItem('pais') || '[]');
        
        // Add new parent
        pais.push(pai);
        
        // Save back to localStorage
        localStorage.setItem('pais', JSON.stringify(pais));
    }
    
    function generateId() {
        // Simple ID generation
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }
});
