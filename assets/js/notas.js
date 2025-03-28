document.addEventListener('DOMContentLoaded', function() {
    const notasForm = document.getElementById('notas-form');
    const turmaSelect = document.getElementById('turma');
    const disciplinaSelect = document.getElementById('disciplina');
    const carregarAlunosBtn = document.getElementById('carregar-alunos');
    const tabelaNotas = document.getElementById('tabela-notas');
    
    // Initialize selects
    if (turmaSelect) {
        populateTurmaSelect();
    }
    
    // Add event listeners
    if (turmaSelect) {
        turmaSelect.addEventListener('change', function() {
            populateDisciplinaSelect();
        });
    }
    
    if (carregarAlunosBtn) {
        carregarAlunosBtn.addEventListener('click', function() {
            loadAlunosTable();
        });
    }
    
    if (notasForm) {
        notasForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            // Get selected values
            const turmaId = turmaSelect.value;
            const disciplinaId = disciplinaSelect.value;
            const bimestre = document.getElementById('bimestre').value;
            
            // Get notas data from form
            const notasData = [];
            
            document.querySelectorAll('#tabela-notas tbody tr').forEach(row => {
                const alunoId = row.dataset.alunoId;
                const nota = row.querySelector('.nota-input').value;
                const frequencia = row.querySelector('.freq-input').value;
                const observacao = row.querySelector('.obs-input').value;
                
                notasData.push({
                    alunoId,
                    nota: parseFloat(nota),
                    frequencia: parseFloat(frequencia),
                    observacao
                });
            });
            
            // Validate form
            if (!validateForm(turmaId, disciplinaId, notasData)) {
                return false;
            }
            
            // Create notas object
            const notasEntry = {
                id: generateId(),
                turmaId,
                disciplinaId,
                bimestre,
                notas: notasData,
                dataRegistro: new Date().toISOString()
            };
            
            // Save notas to localStorage
            saveNotas(notasEntry);
            
            // Show success message
            alert('Notas registradas com sucesso!');
        });
    }
    
    function populateTurmaSelect() {
        // Get existing turmas from localStorage
        const turmas = JSON.parse(localStorage.getItem('turmas') || '[]');
        
        // Clear existing options except the placeholder
        while (turmaSelect.options.length > 1) {
            turmaSelect.remove(1);
        }
        
        // Add turma options
        turmas.forEach(turma => {
            const option = document.createElement('option');
            option.value = turma.id;
            option.textContent = `${turma.nome} - ${turma.serie}º Ano (${turma.anoLetivo})`;
            turmaSelect.appendChild(option);
        });
    }
    
    function populateDisciplinaSelect() {
        const turmaId = turmaSelect.value;
        
        // Clear existing options except the placeholder
        while (disciplinaSelect.options.length > 1) {
            disciplinaSelect.remove(1);
        }
        
        if (!turmaId) {
            return;
        }
        
        // Get selected turma
        const turmas = JSON.parse(localStorage.getItem('turmas') || '[]');
        const turma = turmas.find(t => t.id === turmaId);
        
        if (!turma) {
            return;
        }
        
        // Get disciplinas for the selected turma
        const allDisciplinas = JSON.parse(localStorage.getItem('disciplinas') || '[]');
        const turmaDisciplinas = allDisciplinas.filter(d => turma.disciplinas.includes(d.id));
        
        // Add disciplina options
        turmaDisciplinas.forEach(disciplina => {
            const option = document.createElement('option');
            option.value = disciplina.id;
            option.textContent = `${disciplina.nome} (${disciplina.codigo}) - Prof. ${disciplina.professor}`;
            disciplinaSelect.appendChild(option);
        });
    }
    
    function loadAlunosTable() {
        const turmaId = turmaSelect.value;
        const disciplinaId = disciplinaSelect.value;
        const bimestre = document.getElementById('bimestre').value;
        
        if (!turmaId || !disciplinaId) {
            alert('Selecione uma turma e uma disciplina');
            return;
        }
        
        // Get students
        const alunos = JSON.parse(localStorage.getItem('alunos') || '[]');
        
        // Get existing notas if any
        const allNotas = JSON.parse(localStorage.getItem('notas') || '[]');
        const existingNotas = allNotas.find(n => 
            n.turmaId === turmaId && 
            n.disciplinaId === disciplinaId && 
            n.bimestre === bimestre
        );
        
        // Clear table
        const tbody = tabelaNotas.querySelector('tbody');
        tbody.innerHTML = '';
        
        // Add rows for each student
        alunos.forEach(aluno => {
            const tr = document.createElement('tr');
            tr.dataset.alunoId = aluno.id;
            
            // Find existing nota for this student
            let existingNota = null;
            if (existingNotas) {
                existingNota = existingNotas.notas.find(n => n.alunoId === aluno.id);
            }
            
            tr.innerHTML = `
                <td>${aluno.nome}</td>
                <td>
                    <input type="number" class="nota-input" min="0" max="10" step="0.1" 
                           value="${existingNota ? existingNota.nota : ''}" required>
                </td>
                <td>
                    <input type="number" class="freq-input" min="0" max="100" step="1" 
                           value="${existingNota ? existingNota.frequencia : '100'}" required>
                </td>
                <td>
                    <input type="text" class="obs-input" 
                           value="${existingNota && existingNota.observacao ? existingNota.observacao : ''}">
                </td>
            `;
            
            tbody.appendChild(tr);
        });
    }
    
    function validateForm(turmaId, disciplinaId, notasData) {
        if (!turmaId) {
            alert('Selecione uma turma');
            return false;
        }
        
        if (!disciplinaId) {
            alert('Selecione uma disciplina');
            return false;
        }
        
        if (notasData.length === 0) {
            alert('Não há alunos para lançar notas');
            return false;
        }
        
        // Validate each nota
        for (const nota of notasData) {
            if (isNaN(nota.nota) || nota.nota < 0 || nota.nota > 10) {
                alert('As notas devem estar entre 0 e 10');
                return false;
            }
            
            if (isNaN(nota.frequencia) || nota.frequencia < 0 || nota.frequencia > 100) {
                alert('A frequência deve estar entre 0 e 100%');
                return false;
            }
        }
        
        return true;
    }
    
    function saveNotas(notasEntry) {
        // Get existing notas or initialize empty array
        const notas = JSON.parse(localStorage.getItem('notas') || '[]');
        
        // Check if updating or adding new
        const index = notas.findIndex(n => 
            n.turmaId === notasEntry.turmaId && 
            n.disciplinaId === notasEntry.disciplinaId && 
            n.bimestre === notasEntry.bimestre
        );
        
        if (index !== -1) {
            notas[index] = notasEntry;
        } else {
            notas.push(notasEntry);
        }
        
        // Save back to localStorage
        localStorage.setItem('notas', JSON.stringify(notas));
    }
    
    function generateId() {
        // Simple ID generation
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }
});
