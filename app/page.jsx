// app/page.jsx
'use client';

import { useState, useEffect } from 'react';

export default function HomePage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [modalAberto, setModalAberto] = useState(null);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const temaSalvo = localStorage.getItem('temaEscuro') === 'true';
    setDarkMode(temaSalvo);
    document.body.classList.toggle('dark', temaSalvo);
  }, []);

  const toggleDarkMode = () => {
    const novoModo = !darkMode;
    setDarkMode(novoModo);
    document.body.classList.toggle('dark', novoModo);
    localStorage.setItem('temaEscuro', novoModo);
  };

  const copiarNumero = (numero) => {
    navigator.clipboard.writeText(numero).then(() => {
      alert(`✅ Número ${numero} copiado!`);
    });
  };

  const styles = {
    container: {
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      backgroundColor: darkMode ? '#121212' : '#f8f9fa',
      color: darkMode ? '#e0e0e0' : '#333',
      minHeight: '100vh',
      transition: 'all 0.3s'
    },
    navbar: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '12px 20px',
      background: darkMode ? '#1a1a1a' : '#2b5dab',
      color: 'white',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      position: 'sticky',
      top: 0,
      zIndex: 1000
    },
    navTitle: {
      fontSize: '1.3rem',
      fontWeight: 600
    },
    navButtons: {
      display: 'flex',
      gap: '10px',
      alignItems: 'center'
    },
    navButton: {
      background: 'none',
      border: 'none',
      color: 'white',
      fontSize: '1.5rem',
      cursor: 'pointer',
      width: '44px',
      height: '44px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    sidebar: {
      position: 'fixed',
      top: 0,
      left: sidebarOpen ? '0' : '-300px',
      width: '280px',
      height: '100vh',
      background: darkMode ? '#1e1e1e' : 'white',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      padding: '20px 0',
      transition: 'left 0.3s ease',
      zIndex: 2000,
      display: 'flex',
      flexDirection: 'column'
    },
    sidebarHeader: {
      padding: '15px',
      textAlign: 'center',
      borderBottom: '1px solid #eee',
      marginBottom: '10px',
      fontWeight: 'bold',
      color: '#2b5dab',
      fontSize: '0.9rem'
    },
    sidebarItem: {
      display: 'block',
      padding: '12px 20px',
      textDecoration: 'none',
      color: darkMode ? '#e0e0e0' : '#333',
      borderBottom: '1px solid #f0f0f0',
      cursor: 'pointer'
    },
    overlay: {
      display: sidebarOpen ? 'block' : 'none',
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      background: 'rgba(0,0,0,0.5)',
      zIndex: 1500
    },
    botoesGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: '12px',
      padding: '15px',
      maxWidth: '600px',
      margin: '20px auto'
    },
    btn: {
      padding: '16px',
      border: 'none',
      borderRadius: '12px',
      color: 'white',
      fontWeight: 600,
      fontSize: '0.9rem',
      cursor: 'pointer',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      minHeight: '110px'
    },
    modal: (aberto) => ({
      display: aberto ? 'flex' : 'none',
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      background: 'rgba(0,0,0,0.7)',
      zIndex: 3000,
      justifyContent: 'center',
      alignItems: 'center'
    }),
    modalContent: {
      background: darkMode ? '#1e1e1e' : 'white',
      width: '90%',
      maxWidth: '400px',
      padding: '20px',
      borderRadius: '12px',
      textAlign: 'left',
      position: 'relative',
      color: darkMode ? '#e0e0e0' : '#333'
    }
  };

  return (
    <div style={styles.container}>
      {/* Navbar */}
      <nav style={styles.navbar}>
        <h1 style={styles.navTitle}>Plano de Aula MZ</h1>
        <div style={styles.navButtons}>
          <button style={styles.navButton} onClick={() => setModalAberto('modalAdmin')}>
            <i className="fas fa-phone"></i>
          </button>
          <button style={styles.navButton} onClick={() => setSidebarOpen(true)}>
            <i className="fas fa-bars"></i>
          </button>
        </div>
      </nav>

      {/* Sidebar */}
      <div style={styles.sidebar}>
        <div style={styles.sidebarHeader}>
          Desenvolvido pelo Prof: Edmilson
        </div>
        <a href="#" style={styles.sidebarItem} onClick={() => { setModalAberto('modalEstatisticas'); setSidebarOpen(false); }}>
          <i className="fas fa-cog"></i> Definições
        </a>
        <div style={styles.sidebarItem} onClick={() => { toggleDarkMode(); setSidebarOpen(false); }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
            <span><i className="fas fa-moon"></i> Modo Escuro</span>
            <div style={{
              width: '40px',
              height: '20px',
              background: darkMode ? '#4CAF50' : '#ccc',
              borderRadius: '20px',
              position: 'relative'
            }}>
              <div style={{
                position: 'absolute',
                top: '2px',
                left: darkMode ? '22px' : '2px',
                width: '16px',
                height: '16px',
                background: 'white',
                borderRadius: '50%',
                transition: 'left 0.3s'
              }} />
            </div>
          </div>
        </div>
        <a href="/biografia.html" style={styles.sidebarItem} onClick={() => setSidebarOpen(false)}>
          <i className="fas fa-user-circle"></i> Biografia do Criador
        </a>
        <a href="#" style={styles.sidebarItem} onClick={() => { setModalAberto('modalPartilha'); setSidebarOpen(false); }}>
          <i className="fas fa-share-alt"></i> Partilhar App
        </a>
        <a href="/termos.html" style={styles.sidebarItem} onClick={() => setSidebarOpen(false)}>
          <i className="fas fa-shield-alt"></i> Termos e Políticas
        </a>
        <a href="/sobre.html" style={styles.sidebarItem} onClick={() => setSidebarOpen(false)}>
          <i className="fas fa-info-circle"></i> Sobre
        </a>
        <div style={{ marginTop: 'auto', padding: '15px', textAlign: 'center', fontSize: '0.8rem', color: '#777' }}>
          © 2025 | EB 4 de Outubro
        </div>
      </div>

      {/* Overlay */}
      <div style={styles.overlay} onClick={() => setSidebarOpen(false)} />

      {/* Botões principais */}
      <div style={styles.botoesGrid}>
        <button style={{ ...styles.btn, background: 'linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)' }} onClick={() => setModalAberto('modalEscolhaVip')}>
          <i className="fas fa-crown"></i> Plano VIP
        </button>
        <button style={{ ...styles.btn, background: 'linear-gradient(135deg, #00b09b 0%, #96c93d 100%)' }} onClick={() => window.location.href = '/planogratis.html'}>
          <i className="fas fa-ad"></i> Plano Gratuito
        </button>
        <button style={{ ...styles.btn, background: 'linear-gradient(135deg, #9c27b0 0%, #673ab7 100%)' }} onClick={() => setModalAberto('modalEscolhaLinguas')}>
          <i className="fas fa-language"></i> Plano de Línguas
        </button>
        <button style={{ ...styles.btn, background: '#3498db' }} onClick={() => window.location.href = '/quin.html'}>
          <i className="fas fa-calendar-alt"></i> Plano Quinzenal
        </button>
        <button style={{ ...styles.btn, background: '#e74c3c' }} onClick={() => setModalAberto('modalDoacoes')}>
          <i className="fas fa-heart"></i> Doações
        </button>
        <button style={{ ...styles.btn, background: '#2ecc71' }} onClick={() => setModalAberto('modalHistorico')}>
          <i className="fas fa-history"></i> Histórico
        </button>
        <button style={{ ...styles.btn, background: 'linear-gradient(135deg, #ff9800 0%, #f57c00 100%)' }} onClick={() => window.location.href = '/instrucoes-apk.html'}>
          <i className="fas fa-book"></i> Instruções do APK
        </button>
        <button style={{ ...styles.btn, background: 'linear-gradient(135deg, #16a085 0%, #1abc9c 100%)' }} onClick={() => window.location.href = '/bloco'}>
          <i className="fas fa-calendar-check"></i> Bloco de Planificação
        </button>
        <a href="/abano.html" style={{ ...styles.btn, background: '#9b59b6', gridColumn: 'span 2', textDecoration: 'none', minHeight: '80px' }}>
          <i className="fas fa-dice"></i> Abano da Sorte
        </a>
      </div>

      {/* Modal Admin */}
      <div style={styles.modal(modalAberto === 'modalAdmin')} onClick={(e) => e.target === e.currentTarget && setModalAberto(null)}>
        <div style={styles.modalContent}>
          <h3 style={{ marginBottom: '15px', color: '#2b5dab', textAlign: 'center' }}>Falar com a Equipa Técnica</h3>
          <a href="tel:+258876393961" style={{ display: 'block', width: '100%', margin: '6px 0', padding: '12px', background: '#1976d2', color: 'white', textDecoration: 'none', borderRadius: '8px', textAlign: 'center' }}>
            <i className="fas fa-phone"></i> Ligar (87 639 3961)
          </a>
          <a href="https://chat.whatsapp.com/CD6USSJ0IPf8Z0X7xFLvp" target="_blank" style={{ display: 'block', width: '100%', margin: '6px 0', padding: '12px', background: '#25d366', color: 'white', textDecoration: 'none', borderRadius: '8px', textAlign: 'center' }}>
            <i className="fab fa-whatsapp"></i> Grupo WhatsApp
          </a>
          <a href="mailto:edmilsonnhanombe62@gmail.com" style={{ display: 'block', width: '100%', margin: '6px 0', padding: '12px', background: '#e74c3c', color: 'white', textDecoration: 'none', borderRadius: '8px', textAlign: 'center' }}>
            <i className="fas fa-envelope"></i> Email
          </a>
        </div>
      </div>

      {/* Modal Doações */}
      <div style={styles.modal(modalAberto === 'modalDoacoes')} onClick={(e) => e.target === e.currentTarget && setModalAberto(null)}>
        <div style={styles.modalContent}>
          <h3 style={{ textAlign: 'center', marginBottom: '15px' }}>💰 Apoie o Plano de Aula MZ</h3>
          <p>Escolha o serviço e copie o número para doar:</p>
          
          <div style={{ margin: '12px 0' }}>
            <strong>📱 Emola</strong><br />
            <code>876393961</code>
            <button style={{ background: '#95a5a6', color: 'white', border: 'none', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer', marginLeft: '8px' }} onClick={() => copiarNumero('876393961')}>Copiar</button>
          </div>

          <div style={{ margin: '12px 0' }}>
            <strong>📲 m-Kesh</strong><br />
            <code>834890828</code>
            <button style={{ background: '#95a5a6', color: 'white', border: 'none', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer', marginLeft: '8px' }} onClick={() => copiarNumero('834890828')}>Copiar</button>
          </div>

          <div style={{ margin: '12px 0' }}>
            <strong>💳 m-Pesa</strong><br />
            <code>846393962</code>
            <button style={{ background: '#95a5a6', color: 'white', border: 'none', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer', marginLeft: '8px' }} onClick={() => copiarNumero('846393962')}>Copiar</button>
          </div>

          <small style={{ display: 'block', textAlign: 'center', marginTop: '10px', color: '#777' }}>
            Após a doação, envie comprovativo por WhatsApp.
          </small>
        </div>
      </div>

      {/* Modal Escolha VIP */}
      <div style={styles.modal(modalAberto === 'modalEscolhaVip')} onClick={(e) => e.target === e.currentTarget && setModalAberto(null)}>
        <div style={styles.modalContent}>
          <h3 style={{ textAlign: 'center', marginBottom: '15px' }}>Plano VIP (Disciplinas Gerais)</h3>
          <p style={{ textAlign: 'center', marginBottom: '20px' }}>Escolha o tipo de plano VIP:</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <button onClick={() => window.location.href = '/inteligente.html'} style={{ background: 'linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)', color: 'white', border: 'none', padding: '16px', borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
              <i className="fas fa-robot"></i> Plano Integrado com I.A
            </button>
            <button onClick={() => window.location.href = '/planovip.html'} style={{ background: '#3498db', color: 'white', border: 'none', padding: '16px', borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
              <i className="fas fa-user-edit"></i> Plano sem I.A
            </button>
          </div>
        </div>
      </div>

      {/* Modal Escolha Línguas */}
      <div style={styles.modal(modalAberto === 'modalEscolhaLinguas')} onClick={(e) => e.target === e.currentTarget && setModalAberto(null)}>
        <div style={styles.modalContent}>
          <h3 style={{ textAlign: 'center', marginBottom: '15px' }}>🌍 Escolha o Idioma</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '15px' }}>
            <button onClick={() => window.location.href = '/ingles.html'} style={{ background: 'linear-gradient(135deg, #00b09b 0%, #96c93d 100%)', color: 'white', border: 'none', padding: '16px', borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
              <i className="fas fa-language"></i> Plano de Inglês
            </button>
            <button onClick={() => window.location.href = '/frances.html'} style={{ background: 'linear-gradient(135deg, #e91e63 0%, #9c27b0 100%)', color: 'white', border: 'none', padding: '16px', borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
              <i className="fas fa-flag"></i> Plano de Francês
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
