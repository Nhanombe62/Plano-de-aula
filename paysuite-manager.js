// ============================================
// paysuite-manager.js - Sistema de Pagamento PaySuite
// Versão 2.0 - COMPLETA E FUNCIONAL
// ============================================

const PAYSUITE_CONFIG = {
    token: "2078|BF9471P8wDmZ3Okg0dwTthC9CwF3Szj1uMkIgibU430dfd2f",
    apiUrl: "https://paysuite.tech/api/v1/payments",
    webhookUrl: "https://script.google.com/macros/s/AKfycbwQVxPUK5Y45l5fSpkKvokFIKF14HB4yDpBpB46BOJ3KjuBBVH69z3eiZ_C1PqN6LkH/exec",
    statusUrl: "https://script.google.com/macros/s/AKfycbwQVxPUK5Y45l5fSpkKvokFIKF14HB4yDpBpB46BOJ3KjuBBVH69z3eiZ_C1PqN6LkH/exec"
};

// ============================================
// PACOTES DE ESTRELAS (Baseado no estrela.html)
// ============================================
const STAR_PACKAGES = [
    { id: 'stars_1', stars: 1, price: 2, name: "1 Estrela" },
    { id: 'stars_5', stars: 5, price: 9, name: "5 Estrelas" },
    { id: 'stars_12', stars: 12, price: 20, name: "12 Estrelas" },
    { id: 'stars_17', stars: 17, price: 29, name: "17 Estrelas" },
    { id: 'stars_30', stars: 30, price: 55, name: "30 Estrelas" }
];

// ============================================
// FUNÇÕES DE USUÁRIO
// ============================================
function getTelefoneUsuario() {
    try {
        const usuarioLocal = JSON.parse(localStorage.getItem('usuario') || '{}');
        return usuarioLocal.telefone || usuarioLocal.phone || '';
    } catch(e) {
        return '';
    }
}

function salvarTelefoneUsuario(telefone) {
    try {
        const usuarioLocal = JSON.parse(localStorage.getItem('usuario') || '{}');
        usuarioLocal.telefone = telefone;
        localStorage.setItem('usuario', JSON.stringify(usuarioLocal));
        return true;
    } catch(e) {
        return false;
    }
}

function getUsuarioUID() {
    try {
        const usuarioLocal = JSON.parse(localStorage.getItem('usuario') || '{}');
        return usuarioLocal.uid || localStorage.getItem('user_uid') || 'anon_' + Date.now();
    } catch(e) {
        return 'anon_' + Date.now();
    }
}

function getUsuarioNome() {
    try {
        const perfil = JSON.parse(localStorage.getItem('perfil_professor') || '{}');
        return perfil.nome || 'Usuário';
    } catch(e) {
        return 'Usuário';
    }
}

// ============================================
// GERAR REFERÊNCIA
// ============================================
function gerarReferencia(tipo) {
    const prefixos = { 'CREDITOS': 'CR', 'QUINZENAL': 'QZ' };
    const prefixo = prefixos[tipo] || 'PG';
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 9000) + 1000;
    let telefone = getTelefoneUsuario();
    
    if (telefone && telefone.length >= 9) {
        telefone = telefone.substring(0, 9);
    } else {
        telefone = '840000000';
    }
    
    return `${telefone}${prefixo}${timestamp}${random}`;
}

// ============================================
// CRIAR PAGAMENTO NA PAYSUITE
// ============================================
async function criarPagamentoPaySuite(tipo, dados, valor, metodo = 'MPESA') {
    const referencia = gerarReferencia(tipo);
    const telefone = getTelefoneUsuario();
    const uid = getUsuarioUID();
    const nome = getUsuarioNome();
    
    if (!telefone || telefone.length < 9) {
        mostrarToast('⚠️ Por favor, digite o seu número de telefone M-PESA (9 dígitos)', 'warning');
        const novoTelefone = prompt('Digite o seu número de telefone M-PESA (9 dígitos):');
        if (novoTelefone && novoTelefone.length === 9) {
            salvarTelefoneUsuario(novoTelefone);
        } else {
            mostrarToast('❌ Número de telefone inválido!', 'error');
            return { success: false, error: 'Telefone inválido' };
        }
        return await criarPagamentoPaySuite(tipo, dados, valor, metodo);
    }
    
    let descricao = '';
    let produtoInfo = {};
    
    if (tipo === 'CREDITOS') {
        descricao = `Compra de ${dados.stars} ${dados.name || 'estrelas'}`;
        produtoInfo = { tipo: 'creditos', quantidade: dados.stars, packageId: dados.packageId };
    } else if (tipo === 'QUINZENAL') {
        descricao = `Plano Quinzenal - ${dados.name || ''}`;
        produtoInfo = { tipo: 'plano_quinzenal', nome: dados.name };
    }
    
    const payloadSessao = {
        tipo: tipo,
        dados: dados,
        produtoInfo: produtoInfo,
        valor: valor,
        referencia: referencia,
        metodo: metodo,
        telefone: telefone,
        uid: uid,
        nome: nome,
        data_criacao: new Date().toISOString()
    };
    
    sessionStorage.setItem('pagamento_pendente', JSON.stringify(payloadSessao));
    sessionStorage.setItem('referencia_pagamento', referencia);
    localStorage.setItem(`pagamento_${referencia}`, JSON.stringify(payloadSessao));
    
    const payload = {
        amount: valor,
        method: metodo,
        reference: referencia,
        description: descricao.substring(0, 125),
        phone: telefone,
        return_url: window.location.href,
        callback_url: PAYSUITE_CONFIG.webhookUrl,
        metadata: {
            user_id: uid,
            user_name: nome,
            user_phone: telefone,
            product_type: tipo,
            product_data: produtoInfo
        }
    };
    
    console.log('📤 Enviando pagamento:', payload);
    mostrarLoadingPagamento('A processar pagamento...');
    
    try {
        const response = await fetch(PAYSUITE_CONFIG.apiUrl, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${PAYSUITE_CONFIG.token}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(payload)
        });
        
        const result = await response.json();
        console.log('📥 Resposta PaySuite:', result);
        esconderLoadingPagamento();
        
        if (result.status === 'success' && result.data && result.data.checkout_url) {
            window.location.href = result.data.checkout_url;
            return { success: true, url: result.data.checkout_url, reference: referencia };
        } else {
            const erroMsg = result.message || result.error || 'Erro desconhecido';
            console.error('❌ Erro PaySuite:', erroMsg);
            mostrarToast(`❌ ${erroMsg}`, 'error');
            return { success: false, error: erroMsg };
        }
    } catch (error) {
        esconderLoadingPagamento();
        console.error('❌ Erro na requisição:', error);
        mostrarToast(`❌ Erro ao conectar: ${error.message}`, 'error');
        return { success: false, error: error.message };
    }
}

// ============================================
// VERIFICAR STATUS DO PAGAMENTO
// ============================================
async function verificarStatusPagamento(referencia) {
    try {
        const response = await fetch(`${PAYSUITE_CONFIG.statusUrl}?ref=${referencia}&action=verificar`);
        const data = await response.json();
        console.log('📥 Status do pagamento:', data);
        return data;
    } catch (error) {
        console.error('❌ Erro verificar status:', error);
        return { status: 'error', pago: false };
    }
}

// ============================================
// VERIFICAR PAGAMENTO APÓS RETORNO
// ============================================
async function verificarPagamentoAposRetorno() {
    const referencia = sessionStorage.getItem('referencia_pagamento');
    if (!referencia) return null;
    
    console.log('🔍 Verificando pagamento:', referencia);
    
    const resultado = await verificarStatusPagamento(referencia);
    
    if (resultado.pago || resultado.status === 'paid' || resultado.status === 'confirmed') {
        console.log('✅ Pagamento confirmado!');
        
        const pagamentoPendente = sessionStorage.getItem('pagamento_pendente');
        if (pagamentoPendente) {
            const dados = JSON.parse(pagamentoPendente);
            sessionStorage.setItem('pagamento_confirmado', JSON.stringify({
                ...dados,
                confirmado: true,
                data_confirmacao: new Date().toISOString(),
                transacao_id: resultado.transacao_id,
                credits_adicionados: resultado.credits
            }));
            sessionStorage.removeItem('pagamento_pendente');
            sessionStorage.removeItem('referencia_pagamento');
            
            return dados;
        }
    }
    
    return null;
}

// ============================================
// AGUARDAR CONFIRMAÇÃO DO PAGAMENTO
// ============================================
function iniciarVerificacaoPeriodica(callback) {
    let tentativas = 0;
    const maxTentativas = 30;
    
    const intervalo = setInterval(async () => {
        tentativas++;
        console.log(`🔍 Verificando pagamento (tentativa ${tentativas}/${maxTentativas})...`);
        
        const confirmado = await verificarPagamentoAposRetorno();
        
        if (confirmado) {
            clearInterval(intervalo);
            if (callback) callback(true, confirmado);
            mostrarToast('✅ Pagamento confirmado com sucesso!', 'success');
            return;
        } else if (tentativas >= maxTentativas) {
            clearInterval(intervalo);
            if (callback) callback(false, null);
            mostrarToast('⏰ Tempo limite excedido. Verifique o status do pagamento.', 'warning');
        }
    }, 3000);
}

// ============================================
// FUNÇÕES DE COMPRA
// ============================================
async function comprarCreditos(packageId, stars, price, name) {
    return await criarPagamentoPaySuite('CREDITOS', {
        packageId: packageId,
        stars: stars,
        name: name,
        price: price
    }, price);
}

async function comprarPlanoQuinzenal(packageId, name, price) {
    return await criarPagamentoPaySuite('QUINZENAL', {
        packageId: packageId,
        name: name,
        price: price
    }, price);
}

// ============================================
// FUNÇÕES UI
// ============================================
function mostrarLoadingPagamento(msg = 'Processando...') {
    let loader = document.getElementById('loadingPagamentoOverlay');
    if (!loader) {
        loader = document.createElement('div');
        loader.id = 'loadingPagamentoOverlay';
        loader.innerHTML = `
            <div style="position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.85);z-index:99999;display:flex;justify-content:center;align-items:center;">
                <div style="background:white;border-radius:20px;padding:30px;text-align:center;max-width:350px;box-shadow:0 20px 60px rgba(0,0,0,0.3);">
                    <div class="paysuite-spinner"></div>
                    <p style="margin-top:15px;color:#333;font-weight:600;" id="loaderMsg">${msg}</p>
                    <p style="font-size:12px;color:#888;">Aguarde, estamos a processar o seu pedido</p>
                </div>
            </div>
        `;
        document.body.appendChild(loader);
        
        if (!document.getElementById('paysuite-style')) {
            const style = document.createElement('style');
            style.id = 'paysuite-style';
            style.textContent = `
                .paysuite-spinner {
                    width: 50px;
                    height: 50px;
                    border: 4px solid #f3f3f3;
                    border-top: 4px solid #667eea;
                    border-right: 4px solid #764ba2;
                    border-radius: 50%;
                    animation: paysuite-spin 1s linear infinite;
                    margin: 0 auto;
                }
                @keyframes paysuite-spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                .paysuite-toast {
                    position: fixed;
                    bottom: 30px;
                    left: 50%;
                    transform: translateX(-50%);
                    padding: 12px 24px;
                    border-radius: 30px;
                    color: white;
                    font-weight: 600;
                    z-index: 100001;
                    animation: paysuite-fadeInOut 4s ease forwards;
                    max-width: 90%;
                    text-align: center;
                    box-shadow: 0 4px 15px rgba(0,0,0,0.2);
                }
                @keyframes paysuite-fadeInOut {
                    0% { opacity: 0; transform: translateX(-50%) translateY(20px); }
                    15% { opacity: 1; transform: translateX(-50%) translateY(0); }
                    85% { opacity: 1; transform: translateX(-50%) translateY(0); }
                    100% { opacity: 0; transform: translateX(-50%) translateY(-20px); }
                }
            `;
            document.head.appendChild(style);
        }
    }
    const msgEl = document.getElementById('loaderMsg');
    if (msgEl) msgEl.textContent = msg;
    loader.style.display = 'flex';
}

function esconderLoadingPagamento() {
    const loader = document.getElementById('loadingPagamentoOverlay');
    if (loader) loader.remove();
}

function mostrarToast(mensagem, tipo = 'success') {
    const toast = document.createElement('div');
    toast.className = 'paysuite-toast';
    toast.style.background = tipo === 'error' ? '#e74c3c' : (tipo === 'warning' ? '#f59e0b' : '#10b981');
    toast.textContent = mensagem;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 4000);
}

// ============================================
// EXPORTAR
// ============================================
window.PaySuiteManager = {
    STAR_PACKAGES: STAR_PACKAGES,
    criarPagamento: criarPagamentoPaySuite,
    verificarStatus: verificarStatusPagamento,
    verificarPagamentoAposRetorno: verificarPagamentoAposRetorno,
    iniciarVerificacaoPeriodica: iniciarVerificacaoPeriodica,
    comprarCreditos: comprarCreditos,
    comprarPlanoQuinzenal: comprarPlanoQuinzenal,
    getTelefoneUsuario: getTelefoneUsuario,
    salvarTelefoneUsuario: salvarTelefoneUsuario,
    getUsuarioUID: getUsuarioUID,
    getUsuarioNome: getUsuarioNome,
    mostrarToast: mostrarToast,
    mostrarLoading: mostrarLoadingPagamento,
    esconderLoading: esconderLoadingPagamento
};

console.log('✅ PaySuite Manager carregado com sucesso!');
console.log('📦 Pacotes disponíveis:', STAR_PACKAGES);