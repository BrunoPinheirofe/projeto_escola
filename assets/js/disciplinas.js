document.addEventListener('DOMContentLoaded', function() {
    const disciplinaForm = document.getElementById('disciplina-form');

    if (disciplinaForm) {
        disciplinaForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            // Get form values
            const nome = document.getElementById('nome').value.trim();
            const codigo = document.getElementById('codigo').value.trim();
            const cargaHoraria = document.getElementById('carga-horaria').value.trim();
            const professor = document.getElementById('professor').value.trim();
            const descricao = document.getElementById('descricao').value.trim();
            
            // Validate form
            if (!validateForm(nome, codigo, cargaHoraria, professor)) {
                return false;
            }
            
            // Create disciplina object
            const disciplina = {
                id: generateId(),
                nome,
                codigo,
                cargaHoraria,
                professor,
                descricao,
                dataRegistro: new Date().toISOString()
            };
            
            // Save disciplina to localStorage
            saveDisciplina(disciplina);
            
            // Reset form
            disciplinaForm.reset();
            
            // Show success message
            alert('Disciplina cadastrada com sucesso!');
        });
    }
    
    function validateForm(nome, codigo, cargaHoraria, professor) {
        if (!nome) {
            alert('Nome da disciplina é obrigatório');
            return false;
        }
        
        if (!codigo) {
            alert('Código é obrigatório');
            return false;
        }
        
        if (!cargaHoraria) {
            alert('Carga horária é obrigatória');
            return false;
        }
        
        if (isNaN(cargaHoraria) || parseInt(cargaHoraria) <= 0) {
            alert('Carga horária deve ser um número positivo');
            return false;
        }
        
        if (!professor) {
            alert('Nome do professor é obrigatório');
            return false;
        }
        
        // Check if code is already in use
        const disciplinas = JSON.parse(localStorage.getItem('disciplinas') || '[]');
        if (disciplinas.some(d => d.codigo === codigo)) {
            alert('Este código de disciplina já está em uso');
            return false;
        }
        
        return true;
    }
    
    function saveDisciplina(disciplina) {
        // Get existing disciplinas or initialize empty array
        const disciplinas = JSON.parse(localStorage.getItem('disciplinas') || '[]');
        
        // Add new disciplina
        disciplinas.push(disciplina);
        
        // Save back to localStorage
        localStorage.setItem('disciplinas', JSON.stringify(disciplinas));
    }
    
    function generateId() {
        // Simple ID generation
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }
});
