// ============================================
// paysuite-manager.js - Sistema de Pagamento PaySuite
// Token: 2078|BF9471P8wDmZ3Okg0dwTthC9CwF3Szj1uMkIgibU430dfd2f
// ============================================

const PAYSUITE_CONFIG = {
    token: "2078|BF9471P8wDmZ3Okg0dwTthC9CwF3Szj1uMkIgibU430dfd2f",
    apiUrl: "https://paysuite.tech/api/v1/payments",
    webhookUrl: "https://script.google.com/macros/s/AKfycbwQVxPUK5Y45l5fSpkKvokFIKF14HB4yDpBpB46BOJ3KjuBBVH69z3eiZ_C1PqN6LkH/exec",
    statusUrl: "https://script.google.com/macros/s/AKfycbwQVxPUK5Y45l5fSpkKvokFIKF14HB4yDpBpB46BOJ3KjuBBVH69z3eiZ_C1PqN6LkH/exec"
};

// ============================================
// CONFIGURAÇÃO DOS PRODUTOS
// ============================================
const PRODUCTS_CONFIG = {
    // Pacotes de créditos (para Educação Física, Francês, etc)
    CREDITOS: {
        packages: [
            { id: "cred_1", credits: 1, price: 3, name: "1 Acesso", desc: "1 Download" },
            { id: "cred_4", credits: 4, price: 10, name: "4 Acessos", desc: "4 Downloads" },
            { id: "cred_9", credits: 9, price: 20, name: "9 Acessos", desc: "9 Downloads" },
            { id: "cred_14", credits: 14, price: 30, name: "14 Acessos", desc: "14 Downloads" },
            { id: "cred_25", credits: 25, price: 50, name: "25 Acessos", desc: "25 Downloads" }
        ]
    },
    // Planos quinzenais
    QUINZENAL: {
        packages: [
            { id: "qz_1semana", name: "1 Semana", price: 10, desc: "Acesso por 1 semana", days: 7 },
            { id: "qz_2semanas", name: "2 Semanas", price: 18, desc: "Acesso por 2 semanas", days: 14 },
            { id: "qz_3semanas", name: "3 Semanas", price: 25, desc: "Acesso por 3 semanas", days: 21 }
        ]
    },
    // Planos mensais/trimestrais
    PLANOS: {
        packages: [
            { id: "plan_mensal", name: "Plano Mensal", price: 25, desc: "Acesso por 1 mês", days: 30 },
            { id: "plan_trimestral", name: "Plano Trimestral", price: 60, desc: "Acesso por 3 meses", days: 90 },
            { id: "plan_anual", name: "Plano Anual", price: 200, desc: "Acesso por 1 ano", days: 365 }
        ]
    }
};

// ============================================
// FUNÇÃO PARA PEGAR TELEFONE DO USUÁRIO
// ============================================
function getTelefoneUsuario() {
    try {
        const usuarioLocal = JSON.parse(localStorage.getItem('usuario') || '{}');
        return usuarioLocal.telefone || usuarioLocal.phone || '000000000';
    } catch(e) {
        return '000000000';
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
        return usuarioLocal.uid || null;
    } catch(e) {
        return null;
    }
}

// ============================================
// FUNÇÃO PARA EXTRAIR TELEFONE DA REFERÊNCIA
// Formato: 848960732CR17082352851234
// ============================================
function extrairTelefoneDaReferencia(referencia) {
    if (!referencia) return null;
    const match = referencia.match(/^(\d{9})[A-Z]{2}/);
    return match ? match[1] : null;
}

// ============================================
// GERAR REFERÊNCIA COM TELEFONE
// Formato: TELEFONE(9) + PREFIXO(2) + TIMESTAMP(14) + RANDOM(4)
// ============================================
function gerarReferencia(tipo) {
    const prefixos = { 
        'CREDITOS': 'CR', 
        'QUINZENAL': 'QZ',
        'PLANOS': 'PL',
        'AULA': 'AU'
    };
    const prefixo = prefixos[tipo] || 'PG';
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 9000) + 1000;
    let telefone = getTelefoneUsuario();
    
    // Garantir que o telefone tem 9 dígitos
    if (telefone.length > 9) telefone = telefone.substring(0, 9);
    if (telefone.length < 9) telefone = telefone.padStart(9, '0');
    
    return `${telefone}${prefixo}${timestamp}${random}`;
}

// ============================================
// CRIAR PAGAMENTO NA PAYSUITE
// ============================================
async function criarPagamentoPaySuite(tipo, dados, valor, metodo = 'MPESA') {
    const referencia = gerarReferencia(tipo);
    const telefone = getTelefoneUsuario();
    const uid = getUsuarioUID();
    
    // Descrição do pagamento
    let descricao = '';
    let produtoInfo = {};
    
    if (tipo === 'CREDITOS') {
        descricao = `Compra de ${dados.credits} créditos - ${dados.name || ''}`;
        produtoInfo = { tipo: 'creditos', quantidade: dados.credits, packageId: dados.packageId };
    } else if (tipo === 'QUINZENAL') {
        descricao = `Plano Quinzenal - ${dados.name || ''}`;
        produtoInfo = { tipo: 'plano', nome: dados.name, dias: dados.days, packageId: dados.packageId };
    } else if (tipo === 'PLANOS') {
        descricao = `Plano - ${dados.name || ''}`;
        produtoInfo = { tipo: 'plano', nome: dados.name, dias: dados.days, packageId: dados.packageId };
    }
    
    // Salvar dados da sessão
    const payloadSessao = {
        tipo: tipo,
        dados: dados,
        produtoInfo: produtoInfo,
        valor: valor,
        referencia: referencia,
        metodo: metodo,
        telefone: telefone,
        uid: uid,
        data_criacao: new Date().toISOString(),
        timestamp: Date.now()
    };
    sessionStorage.setItem('pagamento_pendente', JSON.stringify(payloadSessao));
    sessionStorage.setItem('referencia_pagamento', referencia);
    
    // Salvar também no localStorage para persistência
    localStorage.setItem(`pagamento_${referencia}`, JSON.stringify(payloadSessao));
    
    try {
        mostrarLoadingPagamento();
        
        const response = await fetch(PAYSUITE_CONFIG.apiUrl, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${PAYSUITE_CONFIG.token}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                amount: valor,
                method: metodo,
                reference: referencia,
                description: descricao.substring(0, 125),
                phone: telefone,
                return_url: window.location.href,
                callback_url: PAYSUITE_CONFIG.webhookUrl,
                metadata: {
                    user_id: uid,
                    user_phone: telefone,
                    product_type: tipo,
                    product_data: produtoInfo
                }
            })
        });
        
        const result = await response.json();
        esconderLoadingPagamento();
        
        if (result.status === 'success' && result.data && result.data.checkout_url) {
            window.location.href = result.data.checkout_url;
            return { success: true, url: result.data.checkout_url, reference: referencia };
        } else {
            throw new Error(result.message || 'Erro ao criar pagamento');
        }
    } catch (error) {
        esconderLoadingPagamento();
        console.error('Erro PaySuite:', error);
        mostrarToast('❌ Erro ao iniciar pagamento: ' + error.message, 'error');
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
        
        const telefone = extrairTelefoneDaReferencia(referencia);
        
        return { 
            status: data.status, 
            pago: data.status === 'paid' || data.status === 'confirmed',
            telefone: data.telefone || telefone,
            data_pagamento: data.data_pagamento,
            transacao_id: data.transacao_id,
            credits: data.credits || null
        };
    } catch (error) {
        console.error('Erro verificar status:', error);
        return { status: 'error', pago: false, telefone: null };
    }
}

// ============================================
// AGUARDAR CONFIRMAÇÃO DO PAGAMENTO
// ============================================
async function aguardarConfirmacaoPagamento(referencia, intervalo = 3000, maxTentativas = 20) {
    let tentativas = 0;
    
    while (tentativas < maxTentativas) {
        const resultado = await verificarStatusPagamento(referencia);
        
        if (resultado.pago) {
            const pagamentoPendente = sessionStorage.getItem('pagamento_pendente');
            if (pagamentoPendente) {
                const dados = JSON.parse(pagamentoPendente);
                sessionStorage.setItem('pagamento_confirmado', JSON.stringify({
                    ...dados,
                    telefone: resultado.telefone,
                    confirmado: true,
                    data_confirmacao: new Date().toISOString(),
                    transacao_id: resultado.transacao_id,
                    credits_adicionados: resultado.credits
                }));
                sessionStorage.removeItem('pagamento_pendente');
            }
            return { confirmado: true, telefone: resultado.telefone, transacao_id: resultado.transacao_id, credits: resultado.credits };
        }
        
        tentativas++;
        await new Promise(resolve => setTimeout(resolve, intervalo));
    }
    
    return { confirmado: false, mensagem: '⏰ Tempo limite excedido. Contacte o suporte.' };
}

// ============================================
// VERIFICAR PAGAMENTO PENDENTE AO CARREGAR
// ============================================
async function verificarPagamentoPendenteAoCarregar() {
    const referencia = sessionStorage.getItem('referencia_pagamento');
    if (!referencia) return null;
    
    const resultado = await verificarStatusPagamento(referencia);
    
    if (resultado.pago) {
        const pagamentoPendente = sessionStorage.getItem('pagamento_pendente');
        if (pagamentoPendente) {
            const dados = JSON.parse(pagamentoPendente);
            sessionStorage.setItem('pagamento_confirmado', JSON.stringify({
                ...dados,
                confirmado: true,
                data_confirmacao: new Date().toISOString()
            }));
            sessionStorage.removeItem('pagamento_pendente');
            sessionStorage.removeItem('referencia_pagamento');
            
            return dados;
        }
    }
    
    return null;
}

// ============================================
// FUNÇÕES DE COMPRA ESPECÍFICAS
// ============================================
async function comprarCreditos(packageId, credits, price, name) {
    return await criarPagamentoPaySuite('CREDITOS', {
        packageId: packageId,
        credits: credits,
        name: name,
        price: price
    }, price);
}

async function comprarPlanoQuinzenal(packageId, name, price, days) {
    return await criarPagamentoPaySuite('QUINZENAL', {
        packageId: packageId,
        name: name,
        price: price,
        days: days
    }, price);
}

async function comprarPlano(packageId, name, price, days) {
    return await criarPagamentoPaySuite('PLANOS', {
        packageId: packageId,
        name: name,
        price: price,
        days: days
    }, price);
}

// ============================================
// FUNÇÕES AUXILIARES UI
// ============================================
function mostrarLoadingPagamento() {
    let loader = document.getElementById('loadingPagamentoOverlay');
    if (!loader) {
        loader = document.createElement('div');
        loader.id = 'loadingPagamentoOverlay';
        loader.innerHTML = `
            <div style="position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.8);z-index:10000;display:flex;justify-content:center;align-items:center;">
                <div style="background:linear-gradient(135deg,#1a1a2e,#16213e);border-radius:20px;padding:30px;text-align:center;border:1px solid #00eeff;">
                    <div class="paysuite-spinner"></div>
                    <p style="margin-top:15px;color:white;">🔄 A processar pagamento...</p>
                    <p style="font-size:12px;color:#aaa;">Aguarde, estamos a redirecionar...</p>
                </div>
            </div>
        `;
        document.body.appendChild(loader);
        
        // Adicionar CSS do spinner
        if (!document.getElementById('paysuite-spinner-style')) {
            const style = document.createElement('style');
            style.id = 'paysuite-spinner-style';
            style.textContent = `
                .paysuite-spinner {
                    width: 50px;
                    height: 50px;
                    border: 4px solid rgba(0,238,255,0.2);
                    border-top: 4px solid #00eeff;
                    border-right: 4px solid #00eeff;
                    border-radius: 50%;
                    animation: paysuite-spin 1s linear infinite;
                    margin: 0 auto;
                }
                @keyframes paysuite-spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `;
            document.head.appendChild(style);
        }
    }
    loader.style.display = 'flex';
}

function esconderLoadingPagamento() {
    const loader = document.getElementById('loadingPagamentoOverlay');
    if (loader) loader.remove();
}

function mostrarToast(mensagem, tipo = 'success') {
    const toast = document.createElement('div');
    toast.className = 'paysuite-toast';
    toast.innerHTML = `
        <div style="position:fixed;bottom:20px;left:50%;transform:translateX(-50%);background:${tipo === 'error' ? '#e74c3c' : '#27ae60'};color:white;padding:12px 24px;border-radius:30px;z-index:10001;box-shadow:0 4px 12px rgba(0,0,0,0.15);animation:paysuite-fadeInOut 3s ease forwards;">
            ${mensagem}
        </div>
    `;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
    
    // Adicionar CSS da animação
    if (!document.getElementById('paysuite-toast-style')) {
        const style = document.createElement('style');
        style.id = 'paysuite-toast-style';
        style.textContent = `
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

function getPagamentoConfirmado() {
    const pagamento = sessionStorage.getItem('pagamento_confirmado');
    return pagamento ? JSON.parse(pagamento) : null;
}

function limparDadosPagamento() {
    sessionStorage.removeItem('pagamento_pendente');
    sessionStorage.removeItem('pagamento_confirmado');
    sessionStorage.removeItem('referencia_pagamento');
}

// ============================================
// EXPORTAR
// ============================================
window.PaySuiteManager = {
    // Configurações
    PRODUCTS: PRODUCTS_CONFIG,
    
    // Funções principais
    criarPagamento: criarPagamentoPaySuite,
    verificarStatus: verificarStatusPagamento,
    aguardarConfirmacao: aguardarConfirmacaoPagamento,
    verificarPagamentoPendenteAoCarregar: verificarPagamentoPendenteAoCarregar,
    
    // Funções de compra
    comprarCreditos: comprarCreditos,
    comprarPlanoQuinzenal: comprarPlanoQuinzenal,
    comprarPlano: comprarPlano,
    
    // Utilitários
    getPagamentoConfirmado: getPagamentoConfirmado,
    limparDados: limparDadosPagamento,
    extrairTelefoneDaReferencia: extrairTelefoneDaReferencia,
    getTelefoneUsuario: getTelefoneUsuario,
    salvarTelefoneUsuario: salvarTelefoneUsuario,
    getUsuarioUID: getUsuarioUID,
    
    // UI
    mostrarToast: mostrarToast,
    mostrarLoading: mostrarLoadingPagamento,
    esconderLoading: esconderLoadingPagamento
};

console.log('✅ PaySuite Manager carregado com sucesso!');
console.log('📦 Pacotes disponíveis:', PRODUCTS_CONFIG);
