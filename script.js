// Armazena os itens do carrinho
let carrinho = [];

// Seletores de elementos
const listaProdutos = document.getElementById('lista-produtos');
const contadorCarrinho = document.getElementById('contador-carrinho');
const modalCarrinho = document.getElementById('modal-carrinho');
const verCarrinhoBtn = document.getElementById('ver-carrinho');
const fecharModalSpan = document.getElementsByClassName('fechar-modal')[0];
const itensCarrinhoUl = document.getElementById('itens-carrinho');
const carrinhoTotalSpan = document.getElementById('carrinho-total');
const finalizarCompraBtn = document.getElementById('finalizar-compra');

// --- Funções Auxiliares ---

// 1. Atualiza o contador de itens no cabeçalho
function atualizarContadorCarrinho() {
    const totalUnidades = carrinho.reduce((soma, item) => soma + item.quantidade, 0);
    contadorCarrinho.textContent = totalUnidades;
}

// 2. Calcula e formata o valor total do carrinho
function calcularTotal() {
    const total = carrinho.reduce((soma, item) => soma + (item.preco * item.quantidade), 0);
    return total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

// 3. Renderiza os itens dentro do modal do carrinho
function renderizarCarrinho() {
    itensCarrinhoUl.innerHTML = ''; 

    if (carrinho.length === 0) {
        itensCarrinhoUl.innerHTML = '<li style="text-align: center; color: #888;">Sua sacola de compras está vazia.</li>';
        carrinhoTotalSpan.textContent = 'R$ 0,00';
        finalizarCompraBtn.disabled = true; 
        return;
    }
    
    finalizarCompraBtn.disabled = false; 

    carrinho.forEach(item => {
        const li = document.createElement('li');
        li.innerHTML = `
            <div>
                <strong>${item.nome}</strong> (${item.quantidade}x)
            </div>
            <span>
                ${(item.preco * item.quantidade).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                <button class="btn-remover" data-id="${item.id}">Remover</button>
            </span>
        `;
        itensCarrinhoUl.appendChild(li);
    });

    carrinhoTotalSpan.textContent = calcularTotal();
}

// 4. Lógica de Adicionar ao Carrinho
function adicionarAoCarrinho(produtoElement) {
    const id = produtoElement.dataset.id;
    const nome = produtoElement.dataset.nome;
    const preco = parseFloat(produtoElement.dataset.preco);

    const itemExistente = carrinho.find(item => item.id === id);

    if (itemExistente) {
        itemExistente.quantidade += 1;
    } else {
        carrinho.push({ id, nome, preco, quantidade: 1 });
    }

    atualizarContadorCarrinho();
    console.log(`"${nome}" adicionado(a) à sacola!`); 
}

// 5. Lógica de Remover Item do Carrinho (remove uma unidade por clique)
function removerItem(idRemover) {
    const index = carrinho.findIndex(item => item.id === idRemover);

    if (index !== -1) {
        if (carrinho[index].quantidade > 1) {
            carrinho[index].quantidade -= 1;
        } else {
            carrinho.splice(index, 1);
        }
    }

    atualizarContadorCarrinho();
    renderizarCarrinho();
}


// --- Event Listeners ---

// 1. Adicionar à Sacola
listaProdutos.addEventListener('click', (event) => {
    if (event.target.classList.contains('adicionar-carrinho')) {
        const produtoCard = event.target.closest('.produto-card');
        adicionarAoCarrinho(produtoCard);
    }
});

// 2. Remover da Sacola
itensCarrinhoUl.addEventListener('click', (event) => {
    if (event.target.classList.contains('btn-remover')) {
        const idProduto = event.target.dataset.id;
        removerItem(idProduto);
    }
});

// 3. Abrir o Modal da Sacola
verCarrinhoBtn.addEventListener('click', () => {
    renderizarCarrinho();
    modalCarrinho.style.display = 'block';
});

// 4. Fechar o Modal
fecharModalSpan.addEventListener('click', () => {
    modalCarrinho.style.display = 'none';
});

window.addEventListener('click', (event) => {
    if (event.target === modalCarrinho) {
        modalCarrinho.style.display = 'none';
    }
});

// 5. Simulação de Finalizar Compra
finalizarCompraBtn.addEventListener('click', () => {
    if (carrinho.length > 0) {
        alert(`Compra de ${carrinho.length} itens finalizada! \nTotal: ${calcularTotal()}. \n\nObrigado por escolher a Elegance Boutique!`);
        carrinho = [];
        atualizarContadorCarrinho();
        modalCarrinho.style.display = 'none';
    }
});

// Chamada inicial
atualizarContadorCarrinho();