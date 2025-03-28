document.addEventListener('DOMContentLoaded', function() {
    const turmaForm = document.getElementById('turma-form');
    const listaDisciplinas = document.getElementById('lista-disciplinas');
    const tabelaTurmas = document.getElementById('tabela-turmas');
    
    // Load data
    populateDisciplinas();
    loadTurmas();
    
    if (turmaForm) {
        turmaForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            // Get form values
            const nome = document.getElementById('nome').value.trim();
            const anoLetivo = document.getElementById('ano-letivo').value.trim();
            const turno = document.getElementById('turno').value;
            const serie = document.getElementById('serie').value;
            
            // Get selected disciplinas
            const disciplinasSelecionadas = [];
            document.querySelectorAll('#lista-disciplinas input[type="checkbox"]:checked').forEach(checkbox => {
                disciplinasSelecionadas.push(checkbox.value);
            });
            
            // Validate form
            if (!validateForm(nome, anoLetivo, disciplinasSelecionadas)) {
                return false;
            }
            
            // Create turma object
            const turma = {
                id: generateId(),
                nome,
                anoLetivo,
                turno,
                serie,
                disciplinas: disciplinasSelecionadas,
                dataRegistro: new Date().toISOString()
            };
            
            // Save turma to localStorage
            saveTurma(turma);
            
            // Reset form
            turmaForm.reset();
            
            // Reload turmas table
            loadTurmas();
            
            // Show success message
            alert('Turma cadastrada com sucesso!');
        });
    }
    
    function populateDisciplinas() {
        if (!listaDisciplinas) return;
        
        // Get existing disciplinas from localStorage
        const disciplinas = JSON.parse(localStorage.getItem('disciplinas') || '[]');
        
        // Clear existing options
        listaDisciplinas.innerHTML = '';
        
        // Add disciplina checkboxes
        disciplinas.forEach(disciplina => {
            const div = document.createElement('div');
            div.innerHTML = `
                <input type="checkbox" id="disc-${disciplina.id}" name="disciplinas[]" value="${disciplina.id}">
                <label for="disc-${disciplina.id}">${disciplina.nome} (${disciplina.codigo}) - Prof. ${disciplina.professor}</label>
            `;
            listaDisciplinas.appendChild(div);
        });
        
        // If no disciplinas, show message
        if (disciplinas.length === 0) {
            listaDisciplinas.innerHTML = '<p>Nenhuma disciplina cadastrada. <a href="cadastro-disciplina.html">Cadastrar disciplinas</a></p>';
        }
    }
    
    function loadTurmas() {
        if (!tabelaTurmas) return;
        
        // Get existing turmas from localStorage
        const turmas = JSON.parse(localStorage.getItem('turmas') || '[]');
        
        // Clear existing rows
        const tbody = tabelaTurmas.querySelector('tbody');
        tbody.innerHTML = '';
        
        // Add turma rows
        turmas.forEach(turma => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${turma.nome}</td>
                <td>${turma.anoLetivo}</td>
                <td>${getTurnoName(turma.turno)}</td>
                <td>${turma.serie}º Ano</td>
                <td>
                    <button class="edit-btn" data-id="${turma.id}">Editar</button>
                    <button class="delete-btn" data-id="${turma.id}">Excluir</button>
                </td>
            `;
            tbody.appendChild(tr);
        });
        
        // Add event listeners to buttons
        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                editTurma(btn.dataset.id);
            });
        });
        
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                deleteTurma(btn.dataset.id);
            });
        });
    }
    
    function validateForm(nome, anoLetivo, disciplinasSelecionadas) {
        if (!nome) {
            alert('Nome da turma é obrigatório');
            return false;
        }
        
        if (!anoLetivo) {
            alert('Ano letivo é obrigatório');
            return false;
        }
        
        if (isNaN(anoLetivo) || parseInt(anoLetivo) < 2022 || parseInt(anoLetivo) > 2030) {
            alert('Ano letivo deve ser um número entre 2022 e 2030');
            return false;
        }
        
        if (disciplinasSelecionadas.length === 0) {
            alert('Selecione pelo menos uma disciplina');
            return false;
        }
        
        return true;
    }
    
    function saveTurma(turma) {
        // Get existing turmas or initialize empty array
        const turmas = JSON.parse(localStorage.getItem('turmas') || '[]');
        
        // Check if updating or adding new
        const index = turmas.findIndex(t => t.id === turma.id);
        if (index !== -1) {
            turmas[index] = turma;
        } else {
            turmas.push(turma);
        }
        
        // Save back to localStorage
        localStorage.setItem('turmas', JSON.stringify(turmas));
    }
    
    function editTurma(id) {
        // Get existing turmas
        const turmas = JSON.parse(localStorage.getItem('turmas') || '[]');
        
        // Find turma
        const turma = turmas.find(t => t.id === id);
        if (!turma) {
            alert('Turma não encontrada');
            return;
        }
        
        // Fill form with turma data
        document.getElementById('nome').value = turma.nome;
        document.getElementById('ano-letivo').value = turma.anoLetivo;
        document.getElementById('turno').value = turma.turno;
        document.getElementById('serie').value = turma.serie;
        
        // Check disciplina checkboxes
        document.querySelectorAll('#lista-disciplinas input[type="checkbox"]').forEach(checkbox => {
            checkbox.checked = turma.disciplinas.includes(checkbox.value);
        });
    }
    
    function deleteTurma(id) {
        if (!confirm('Tem certeza que deseja excluir esta turma?')) {
            return;
        }
        
        // Get existing turmas
        const turmas = JSON.parse(localStorage.getItem('turmas') || '[]');
        
        // Remove turma
        const updatedTurmas = turmas.filter(t => t.id !== id);
        
        // Save back to localStorage
        localStorage.setItem('turmas', JSON.stringify(updatedTurmas));
        
        // Reload turmas table
        loadTurmas();
    }
    
    function generateId() {
        // Simple ID generation
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }
    
    function getTurnoName(turno) {
        const turnos = {
            'matutino': 'Matutino',
            'vespertino': 'Vespertino',
            'noturno': 'Noturno',
            'integral': 'Integral'
        };
        return turnos[turno] || turno;
    }
});
