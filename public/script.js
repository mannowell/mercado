document.addEventListener('DOMContentLoaded', function() {
    // Inicializar itens
    carregarItens();
    
    // Adicionar evento ao formulário
    document.getElementById('form-adicionar').addEventListener('submit', function(e) {
        e.preventDefault();
        const item = document.getElementById('item').value.trim();
        const quantidade = document.getElementById('quantidade').value;
        
        if (item && quantidade) {
            adicionarItem(item, parseInt(quantidade));
            document.getElementById('form-adicionar').reset();
            document.getElementById('item').focus();
        }
    });
    
    // Filtro de itens
    document.getElementById('filter-completed').addEventListener('change', carregarItens);
    
    // Configurar modal de edição
    const editModal = new bootstrap.Modal(document.getElementById('editModal'));
    let editingId = null;
    
    document.getElementById('save-edit').addEventListener('click', function() {
        const novoItem = document.getElementById('edit-item').value.trim();
        const novaQuantidade = document.getElementById('edit-quantidade').value;
        
        if (novoItem && novaQuantidade && editingId) {
            editarItem(editingId, novoItem, parseInt(novaQuantidade));
            editModal.hide();
        }
    });
    
    // Funções para gerenciar itens no localStorage
    function getItens() {
        const itensJSON = localStorage.getItem('comprasItens');
        return itensJSON ? JSON.parse(itensJSON) : [];
    }
    
    function salvarItens(itens) {
        localStorage.setItem('comprasItens', JSON.stringify(itens));
    }
    
    function adicionarItem(item, quantidade) {
        const itens = getItens();
        const novoItem = {
            id: Date.now(),
            item,
            quantidade,
            comprado: false
        };
        itens.push(novoItem);
        salvarItens(itens);
        carregarItens();
    }
    
    function toggleComprado(id) {
        const itens = getItens();
        const itemIndex = itens.findIndex(item => item.id === id);
        if (itemIndex !== -1) {
            itens[itemIndex].comprado = !itens[itemIndex].comprado;
            salvarItens(itens);
            carregarItens();
        }
    }
    
    function removerItem(id) {
        if (confirm('Tem certeza que deseja remover este item?')) {
            const itens = getItens();
            const novosItens = itens.filter(item => item.id !== id);
            salvarItens(novosItens);
            carregarItens();
        }
    }
    
    function editarItem(id, novoItem, novaQuantidade) {
        const itens = getItens();
        const itemIndex = itens.findIndex(item => item.id === id);
        if (itemIndex !== -1) {
            itens[itemIndex].item = novoItem;
            itens[itemIndex].quantidade = novaQuantidade;
            salvarItens(itens);
            carregarItens();
        }
    }
    
    function abrirModalEdicao(id) {
        const itens = getItens();
        const item = itens.find(item => item.id === id);
        if (item) {
            editingId = id;
            document.getElementById('edit-item').value = item.item;
            document.getElementById('edit-quantidade').value = item.quantidade;
            editModal.show();
        }
    }
    
    function carregarItens() {
        const itens = getItens();
        const lista = document.getElementById('lista-itens');
        const emptyState = document.getElementById('empty-state');
        const filterCompleted = document.getElementById('filter-completed').checked;
        
        // Filtrar itens se necessário
        let itensExibidos = itens;
        if (filterCompleted) {
            itensExibidos = itens.filter(item => !item.comprado);
        }
        
        // Exibir ou ocultar empty state
        if (itensExibidos.length === 0) {
            emptyState.classList.remove('d-none');
            lista.innerHTML = '';
        } else {
            emptyState.classList.add('d-none');
            // Ordenar itens: não comprados primeiro, depois por ordem alfabética
            itensExibidos.sort((a, b) => {
                if (a.comprado !== b.comprado) return a.comprado ? 1 : -1;
                return a.item.localeCompare(b.item);
            });
            
            // Gerar HTML dos itens
            lista.innerHTML = itensExibidos.map(item => `
                <li class="list-group-item ${item.comprado ? 'comprado' : ''}">
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" ${item.comprado ? 'checked' : ''} 
                               onchange="toggleComprado(${item.id})">
                    </div>
                    <span class="item-text">${item.item}</span>
                    <span class="badge bg-primary rounded-pill quantidade-badge">${item.quantidade}</span>
                    <div class="btn-group">
                        <button class="btn btn-sm btn-outline-secondary" onclick="abrirModalEdicao(${item.id})">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-danger" onclick="removerItem(${item.id})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </li>
            `).join('');
        }
    }
    
    // Disponibilizar funções globalmente para os eventos onclick
    window.toggleComprado = toggleComprado;
    window.removerItem = removerItem;
    window.abrirModalEdicao = abrirModalEdicao;
    window.editarItem = editarItem;
});