'use client';

import { useState, useEffect } from 'react';

export default function Home() {
  const [view, setView] = useState('home');
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    nome: '', nivel: '', provAtual: '', distritoAtual: '',
    tipoLocal: '', distancia: '', provDestino: '', distDestino: '',
    condicoes: '', telefone: ''
  });
  
  const [provincias, setProvincias] = useState([]);
  const [distritos, setDistritos] = useState({});
  const [distritosAtuais, setDistritosAtuais] = useState([]);
  const [distritosDestino, setDistritosDestino] = useState([]);
  const [filtroProvincia, setFiltroProvincia] = useState('');
  const [resultadosFiltro, setResultadosFiltro] = useState([]);
  
  useEffect(() => {
    carregarProvincias();
  }, []);
  
  const carregarProvincias = async () => {
    const response = await fetch('/api/provincias');
    const data = await response.json();
    setProvincias(data.provincias);
    setDistritos(data.distritos);
  };
  
  const carregarProfessoresPorFiltro = async (provincia) => {
    if (!provincia) {
      setResultadosFiltro([]);
      return;
    }
    const response = await fetch(`/api/professores?provincia=${provincia}`);
    const data = await response.json();
    setResultadosFiltro(data);
  };
  
  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    
    if (type === 'radio') {
      setFormData(prev => ({ ...prev, [name]: value }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    
    if (name === 'provAtual') {
      setDistritosAtuais(distritos[value] || []);
      setFormData(prev => ({ ...prev, distritoAtual: '' }));
    }
    
    if (name === 'provDestino') {
      setDistritosDestino(distritos[value] || []);
      setFormData(prev => ({ ...prev, distDestino: '' }));
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    if (!formData.tipoLocal) {
      alert("Por favor, selecione a localização da escola");
      setLoading(false);
      return;
    }
    
    const response = await fetch('/api/professores', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    
    const result = await response.json();
    
    if (result.matches && result.matches.length > 0) {
      let msg = `✅ PERMUTA POSSÍVEL!\n\nEncontrámos ${result.matches.length} professor(es) compatível(eis):\n\n`;
      result.matches.forEach(m => {
        msg += `👤 ${m.nome} (${m.nivel})\n   Quer ir para: ${m.provDestino} (${m.distDestino})\n   📞 ${m.telefone}\n\n`;
      });
      alert(msg);
    } else {
      alert(result.message);
    }
    
    resetForm();
    setView('list');
    setLoading(false);
  };
  
  const resetForm = () => {
    setFormData({
      nome: '', nivel: '', provAtual: '', distritoAtual: '',
      tipoLocal: '', distancia: '', provDestino: '', distDestino: '',
      condicoes: '', telefone: ''
    });
    setDistritosAtuais([]);
    setDistritosDestino([]);
  };
  
  const limparDados = async () => {
    if (confirm("Apagar todos os dados?")) {
      await fetch('/api/professores', { method: 'DELETE' });
      setResultadosFiltro([]);
      setFiltroProvincia('');
      alert("Dados resetados com sucesso!");
    }
  };
  
  return (
    <>
      <header>
        <h1>🇲🇿 Portal de Permuta</h1>
        <p>Sistema Nacional de Trocas de Posto de Trabalho</p>
      </header>
      
      <div className="container">
        {/* Tela Home */}
        <div className={`view ${view === 'home' ? 'active' : ''}`}>
          <div className="menu-grid">
            <button className="menu-btn" onClick={() => setView('form')}>
              <span>📝</span> Registar Permuta
            </button>
            <button className="menu-btn secondary" onClick={() => setView('list')}>
              <span>🔍</span> Pedidos Disponíveis
            </button>
          </div>
        </div>
        
        {/* Tela Formulário */}
        <div className={`view ${view === 'form' ? 'active' : ''}`}>
          <button className="btn-back" onClick={() => setView('home')}>← Voltar ao Menu</button>
          
          <div className="card">
            <h2>Novo Pedido de Permuta</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Nome Completo:</label>
                <input type="text" name="nome" value={formData.nome} onChange={handleInputChange} required placeholder="Ex: João Manuel" />
              </div>
              
              <div className="form-group">
                <label>Nível de Ensino:</label>
                <select name="nivel" value={formData.nivel} onChange={handleInputChange} required>
                  <option value="" disabled>Selecione...</option>
                  <option value="DN1">DN1</option>
                  <option value="DN2">DN2</option>
                  <option value="DN3">DN3</option>
                  <option value="DN4">DN4</option>
                </select>
              </div>
              
              <hr />
              <h3>📍 Localização Actual</h3>
              
              <div className="form-group">
                <label>Província onde trabalha:</label>
                <select name="provAtual" value={formData.provAtual} onChange={handleInputChange} required>
                  <option value="" disabled>Selecione a Província...</option>
                  {provincias.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
              
              <div className="form-group">
                <label>Distrito onde trabalha:</label>
                <select name="distritoAtual" value={formData.distritoAtual} onChange={handleInputChange} required disabled={!formData.provAtual}>
                  <option value="" disabled>Selecione o Distrito...</option>
                  {distritosAtuais.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              
              <div className="form-group">
                <label>Localização da Escola:</label>
                <div className="radio-group">
                  <label className="radio-option">
                    <input type="radio" name="tipoLocal" value="Dentro da Vila" onChange={handleInputChange} />
                    Dentro da Vila
                  </label>
                  <label className="radio-option">
                    <input type="radio" name="tipoLocal" value="Fora da Vila" onChange={handleInputChange} />
                    Fora da Vila
                  </label>
                </div>
              </div>
              
              <div className={`form-group ${formData.tipoLocal !== 'Fora da Vila' ? 'hidden' : ''}`}>
                <label>Quantos KM da vila para sua escola actual?</label>
                <input type="number" name="distancia" value={formData.distancia} onChange={handleInputChange} placeholder="Ex: 45" />
              </div>
              
              <hr />
              <h3>🚀 Destino Pretendido</h3>
              
              <div className="form-group">
                <label>Para qual Província pretende ir?</label>
                <select name="provDestino" value={formData.provDestino} onChange={handleInputChange} required>
                  <option value="" disabled>Selecione a Província...</option>
                  {provincias.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
              
              <div className="form-group">
                <label>Para qual Distrito pretende ir?</label>
                <select name="distDestino" value={formData.distDestino} onChange={handleInputChange} required disabled={!formData.provDestino}>
                  <option value="" disabled>Selecione o Distrito...</option>
                  {distritosDestino.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              
              <div className="form-group">
                <label>Condições Especiais:</label>
                <textarea name="condicoes" value={formData.condicoes} onChange={handleInputChange} rows="2" placeholder="Ex: Só aceito se tiver casa..."></textarea>
              </div>
              
              <div className="form-group">
                <label>Seu Contacto:</label>
                <input type="tel" name="telefone" value={formData.telefone} onChange={handleInputChange} required placeholder="84/85 XXX XXXX" />
              </div>
              
              <button type="submit" className="btn-submit" disabled={loading}>
                {loading ? 'Processando...' : 'Verificar Compatibilidade e Registar'}
              </button>
            </form>
          </div>
        </div>
        
        {/* Tela Lista */}
        <div className={`view ${view === 'list' ? 'active' : ''}`}>
          <button className="btn-back" onClick={() => setView('home')}>← Voltar ao Menu</button>
          
          <div className="card">
            <h2>🔍 Procurar Permutas</h2>
            
            <div className="search-box">
              <label>1. Selecione a Província de Destino:</label>
              <select value={filtroProvincia} onChange={(e) => {
                setFiltroProvincia(e.target.value);
                carregarProfessoresPorFiltro(e.target.value);
              }}>
                <option value="" disabled>Selecione para ver resultados...</option>
                {provincias.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
              <p style={{ fontSize: '0.8em', marginTop: '5px', color: '#666' }}>
                *Mostraremos apenas professores que querem ir para esta província.
              </p>
            </div>
            
            <div id="resultadosArea">
              {!filtroProvincia && (
                <div className="no-results">
                  👆 Selecione uma província acima para ver os pedidos disponíveis.
                </div>
              )}
              
              {filtroProvincia && resultadosFiltro.length === 0 && (
                <div className="no-results">
                  <h3>😕 Sem resultados</h3>
                  <p>Não há professores registados que queiram ir para <strong>{filtroProvincia}</strong>.</p>
                </div>
              )}
              
              {resultadosFiltro.length > 0 && (
                <>
                  <h3 style={{ marginBottom: '15px' }}>📋 Professores interessados em {filtroProvincia}:</h3>
                  {resultadosFiltro.map(p => (
                    <div key={p.id} className="teacher-item">
                      <h3>{p.nome} <span className="tag">{p.nivel}</span></h3>
                      <div><strong>📍 Actualmente em:</strong> {p.provAtual} &gt; {p.distritoAtual} ({p.tipoLocal}{p.tipoLocal === 'Fora da Vila' ? ` - ${p.distancia}km` : ''})</div>
                      <div><strong>🚀 Quer ir para:</strong> {p.distDestino}</div>
                      <div style={{ fontSize: '0.9em', color: '#666', marginTop: '5px' }}><em>Obs: {p.condicoes || 'Sem condições'}</em></div>
                      <div style={{ marginTop: '10px', fontWeight: 'bold', color: 'var(--primary)' }}>📞 {p.telefone}</div>
                    </div>
                  ))}
                </>
              )}
            </div>
            
            <button className="reset-btn" onClick={limparDados}>Resetar Sistema (Apagar Tudo)</button>
          </div>
        </div>
      </div>
    </>
  );
}
