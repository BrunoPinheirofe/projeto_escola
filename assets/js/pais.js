document.addEventListener('DOMContentLoaded', function() {
    const paisForm = document.getElementById('pais-form');
    const alunoSelect = document.getElementById('aluno-relacionado');
    
    if (alunoSelect) {
        populateAlunosDropdown();
    }
    
    if (paisForm) {
        paisForm.addEventListener('submit', function(event) {
            event.preventDefault();

            const nome = document.getElementById('nome').value.trim();
            const cpf = document.getElementById('cpf').value.trim();
            const telefone = document.getElementById('telefone').value.trim();
            const email = document.getElementById('email').value.trim();
            const endereco = document.getElementById('endereco').value.trim();
            const alunoId = document.getElementById('aluno-relacionado').value;
            const parentesco = document.getElementById('parentesco').value;
            
            if (!validateForm(nome, cpf, telefone, email, endereco, alunoId)) {
                return false;
            }
            
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
            
            savePai(pai);
            
            alert('Pai/Responsável cadastrado com sucesso!');
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
    
    function populateAlunosDropdown() {
        const alunos = JSON.parse(localStorage.getItem('alunos') || '[]');
        
        while (alunoSelect.options.length > 1) {
            alunoSelect.remove(1);
        }
        
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
        const pais = JSON.parse(localStorage.getItem('pais') || '[]');
        
        pais.push(pai);
        
        localStorage.setItem('pais', JSON.stringify(pais));
    }
    
    function generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }
});
