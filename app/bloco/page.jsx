// app/bloco/page.jsx
'use client';

import { useState, useEffect } from 'react';

export default function BlocoPage() {
    // ========== ESTADOS ==========
    const [step, setStep] = useState(1);
    const [muralAdicionado, setMuralAdicionado] = useState(false);
    const [formData, setFormData] = useState({
        escola: '',
        professor: '',
        disciplina: '',
        classe: '',
        anoLectivo: '',
        periodo: '',
        numAulas: '',
        dataGeracao: ''
    });
    const [alert, setAlert] = useState({ show: false, message: '', type: '' });

    // ========== EFFECT PARA DATA ==========
    useEffect(() => {
        const today = new Date();
        const formattedDate = String(today.getDate()).padStart(2, '0') + '/' +
                              String(today.getMonth() + 1).padStart(2, '0') + '/' +
                              today.getFullYear();
        setFormData(prev => ({ ...prev, dataGeracao: formattedDate }));
    }, []);

    // ========== FUNÇÕES ==========
    const showAlert = (message, type = 'info') => {
        setAlert({ show: true, message, type });
        setTimeout(() => setAlert({ show: false, message: '', type: '' }), 3000);
    };

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    const goToStep2 = (e) => {
        e.preventDefault();
        if (!formData.escola || !formData.professor) {
            showAlert('Por favor, preencha os campos obrigatórios: Nome da Escola e Nome do Professor.', 'warning');
            return;
        }
        setStep(2);
    };

    const goToStep1 = (e) => {
        e.preventDefault();
        setStep(1);
    };

    const handleAddMural = () => {
        if (confirm('Tem a certeza que pretende adicionar 1 página de Quadro Mural?\n\nIsso irá adicionar uma página vertical adicional e acrescentará 5 MZN ao valor total.')) {
            setMuralAdicionado(true);
            showAlert('✓ Quadro Mural Adicionado!', 'success');
        }
    };

    const calcularPreco = () => {
        const numAulas = parseInt(formData.numAulas) || 0;
        if (!numAulas) return 0;
        let total = Math.ceil(numAulas / 10) * 12;
        if (muralAdicionado) total += 5;
        return total;
    };

    const handlePreview = (e) => {
        e.preventDefault();
        if (!formData.escola || !formData.professor || !formData.numAulas) {
            showAlert('Preencha todos os campos obrigatórios antes de pré-visualizar.', 'warning');
            return;
        }
        window.open('https://drive.google.com/file/d/12RJVugadoiDJoS3N51YOirYndAvw2pr9/view?usp=drivesdk', '_blank');
    };

    const handleGeneratePDF = (e) => {
        e.preventDefault();
        if (!formData.escola || !formData.professor || !formData.numAulas) {
            showAlert('Preencha todos os campos obrigatórios.', 'warning');
            return;
        }

        // Construir URL com parâmetros
        const params = new URLSearchParams({
            escola: formData.escola,
            professor: formData.professor,
            disciplina: formData.disciplina,
            classe: formData.classe,
            anoLectivo: formData.anoLectivo,
            numAulas: formData.numAulas,
            periodo: formData.periodo,
            dataGeracao: formData.dataGeracao,
            muralAdicionado: muralAdicionado ? '1' : '0',
            valorTotal: calcularPreco().toString()
        });

        window.location.href = `/pdf?${params.toString()}`;
    };

    // ========== ESTILOS ==========
    const styles = {
        container: {
            maxWidth: '900px',
            margin: '0 auto',
            backgroundColor: 'white',
            borderRadius: '16px',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.08)',
            overflow: 'hidden',
            fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
        },
        header: {
            background: 'linear-gradient(to right, #2c3e50, #3498db)',
            color: 'white',
            padding: '28px 20px',
            textAlign: 'center'
        },
        h1: {
            fontSize: '26px',
            fontWeight: 600
        },
        subtitle: {
            fontSize: '15px',
            opacity: 0.9,
            marginTop: '6px'
        },
        formSection: {
            padding: '30px'
        },
        h2: {
            color: '#2c3e50',
            marginBottom: '20px',
            fontSize: '20px',
            fontWeight: 600
        },
        step: (active) => ({
            display: active ? 'block' : 'none',
            animation: active ? 'fadeIn 0.4s ease' : 'none'
        }),
        formRow: {
            display: 'flex',
            flexWrap: 'wrap',
            gap: '20px',
            marginBottom: '20px'
        },
        formGroup: {
            flex: '1',
            minWidth: '250px'
        },
        label: {
            display: 'block',
            marginBottom: '8px',
            fontWeight: 600,
            color: '#2d3748'
        },
        required: {
            color: '#e53e3e'
        },
        input: {
            width: '100%',
            padding: '12px 14px',
            border: '1px solid #cbd5e0',
            borderRadius: '8px',
            fontSize: '16px',
            transition: 'all 0.25s ease',
            backgroundColor: '#fff'
        },
        inputReadonly: {
            backgroundColor: '#f7fafc',
            cursor: 'not-allowed',
            opacity: 0.8
        },
        select: {
            width: '100%',
            padding: '12px 14px',
            border: '1px solid #cbd5e0',
            borderRadius: '8px',
            fontSize: '16px',
            backgroundColor: '#fff'
        },
        priceInfo: {
            backgroundColor: '#f0fdf4',
            borderLeft: '4px solid #38a169',
            padding: '14px',
            borderRadius: '8px',
            margin: '20px 0',
            textAlign: 'center',
            display: calcularPreco() > 0 ? 'block' : 'none'
        },
        priceValue: {
            fontSize: '22px',
            fontWeight: 'bold',
            color: '#2f855a'
        },
        muralInfo: {
            fontSize: '14px',
            marginTop: '5px',
            color: '#2d3748'
        },
        btnGroup: {
            display: 'flex',
            gap: '15px',
            marginTop: '25px',
            flexWrap: 'wrap'
        },
        btn: {
            padding: '12px 24px',
            fontSize: '16px',
            fontWeight: 600,
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            textDecoration: 'none',
            textAlign: 'center',
            display: 'inline-block'
        },
        btnPrimary: {
            backgroundColor: '#3182ce',
            color: 'white'
        },
        btnSecondary: {
            backgroundColor: '#48bb78',
            color: 'white'
        },
        btnOutline: {
            backgroundColor: 'transparent',
            border: '2px solid #3182ce',
            color: '#3182ce'
        },
        btnMuralAdded: {
            backgroundColor: '#38a169',
            color: 'white',
            border: 'none'
        },
        btnDisabled: {
            backgroundColor: '#e2e8f0',
            color: '#a0aec0',
            cursor: 'not-allowed',
            pointerEvents: 'none'
        },
        alert: (show, type) => ({
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '15px 20px',
            backgroundColor: type === 'success' ? '#48bb78' : 
                             type === 'warning' ? '#f59e0b' : 
                             type === 'error' ? '#ef4444' : '#3182ce',
            color: 'white',
            borderRadius: '8px',
            boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
            zIndex: 1000,
            transform: show ? 'translateX(0)' : 'translateX(120%)',
            transition: 'transform 0.3s ease'
        }),
        '@keyframes fadeIn': {
            from: { opacity: 0, transform: 'translateY(10px)' },
            to: { opacity: 1, transform: 'translateY(0)' }
        }
    };

    return (
        <div style={{ background: 'linear-gradient(135deg, #f8f9fa, #e9ecef)', minHeight: '100vh', padding: '20px' }}>
            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                input:focus, select:focus {
                    outline: none;
                    border-color: #3182ce;
                    box-shadow: 0 0 0 3px rgba(49, 130, 206, 0.15);
                }
                @media (max-width: 600px) {
                    .form-group { min-width: 100%; }
                    .btn-group { flex-direction: column; }
                    .btn { width: 100%; }
                }
            `}</style>

            <div style={styles.container}>
                <header style={styles.header}>
                    <h1 style={styles.h1}>Bloco de Planificação Pedagógica</h1>
                    <p style={styles.subtitle}>Plano de Aula MZ</p>
                </header>

                <div style={styles.formSection}>
                    {/* Step 1 */}
                    <div style={styles.step(step === 1)}>
                        <h2 style={styles.h2}>Dados do Bloco de Planificação</h2>
                        <div style={styles.formRow}>
                            <div style={styles.formGroup}>
                                <label style={styles.label}>
                                    Nome da Escola <span style={styles.required}>*</span>
                                </label>
                                <input
                                    type="text"
                                    id="escola"
                                    style={styles.input}
                                    placeholder="Ex: Escola Secundária de Maputo"
                                    value={formData.escola}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div style={styles.formGroup}>
                                <label style={styles.label}>
                                    Nome do Professor <span style={styles.required}>*</span>
                                </label>
                                <input
                                    type="text"
                                    id="professor"
                                    style={styles.input}
                                    placeholder="Ex: Ana Silva"
                                    value={formData.professor}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>

                        <div style={styles.formRow}>
                            <div style={styles.formGroup}>
                                <label style={styles.label}>Disciplina</label>
                                <input
                                    type="text"
                                    id="disciplina"
                                    style={styles.input}
                                    placeholder="Ex: Matemática"
                                    value={formData.disciplina}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div style={styles.formGroup}>
                                <label style={styles.label}>Classe</label>
                                <input
                                    type="text"
                                    id="classe"
                                    style={styles.input}
                                    placeholder="Ex: 10ª Classe"
                                    value={formData.classe}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>

                        <div style={styles.formRow}>
                            <div style={styles.formGroup}>
                                <label style={styles.label}>Ano Lectivo</label>
                                <input
                                    type="text"
                                    id="anoLectivo"
                                    style={styles.input}
                                    placeholder="Ex: 2026"
                                    value={formData.anoLectivo}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>

                        <div style={styles.btnGroup}>
                            <button
                                style={{ ...styles.btn, ...styles.btnPrimary }}
                                onClick={goToStep2}
                            >
                                Próximo
                            </button>
                        </div>
                    </div>

                    {/* Step 2 */}
                    <div style={styles.step(step === 2)}>
                        <h2 style={styles.h2}>Finalizar Bloco</h2>

                        <div style={styles.formRow}>
                            <div style={styles.formGroup}>
                                <label style={styles.label}>Data de Geração</label>
                                <input
                                    type="text"
                                    id="dataGeracao"
                                    style={{ ...styles.input, ...styles.inputReadonly }}
                                    value={formData.dataGeracao}
                                    readOnly
                                />
                            </div>
                            <div style={styles.formGroup}>
                                <label style={styles.label}>Período</label>
                                <select
                                    id="periodo"
                                    style={styles.select}
                                    value={formData.periodo}
                                    onChange={handleInputChange}
                                >
                                    <option value="">Selecione (opcional)</option>
                                    <option value="Manhã">Manhã</option>
                                    <option value="Tarde">Tarde</option>
                                    <option value="Noite">Noite</option>
                                </select>
                            </div>
                        </div>

                        {/* Número de Aulas + Botão do Quadro Mural */}
                        <div style={styles.formRow}>
                            <div style={styles.formGroup}>
                                <label style={styles.label}>
                                    Número de Aulas <span style={styles.required}>*</span>
                                </label>
                                <select
                                    id="numAulas"
                                    style={styles.select}
                                    value={formData.numAulas}
                                    onChange={handleInputChange}
                                    required
                                >
                                    <option value="">Selecione o número de aulas</option>
                                    <option value="10">10 aulas (20 páginas)</option>
                                    <option value="20">20 aulas (40 páginas)</option>
                                    <option value="30">30 aulas (60 páginas)</option>
                                    <option value="40">40 aulas (80 páginas)</option>
                                    <option value="50">50 aulas (100 páginas)</option>
                                    <option value="60">60 aulas (120 páginas)</option>
                                </select>
                            </div>
                            <div style={{ ...styles.formGroup, display: 'flex', alignItems: 'flex-end', minWidth: 'auto' }}>
                                <button
                                    type="button"
                                    style={{
                                        ...styles.btn,
                                        ...(muralAdicionado ? styles.btnMuralAdded : styles.btnOutline),
                                        height: 'fit-content',
                                        padding: '8px 12px',
                                        fontSize: '14px',
                                        whiteSpace: 'nowrap'
                                    }}
                                    onClick={handleAddMural}
                                    disabled={muralAdicionado}
                                >
                                    {muralAdicionado ? '✓ Quadro Mural Adicionado' : '+ Adicionar 1 página de Quadro Mural'}
                                </button>
                            </div>
                        </div>

                        {/* Valor a pagar */}
                        <div style={styles.priceInfo}>
                            <p>Valor a pagar:</p>
                            <div style={styles.priceValue}>{calcularPreco()} MZN</div>
                            {muralAdicionado && (
                                <div style={styles.muralInfo}>Inclui 1 página de Quadro Mural (+5 MZN)</div>
                            )}
                        </div>

                        <div style={styles.btnGroup}>
                            <button
                                style={{ ...styles.btn, ...styles.btnOutline }}
                                onClick={goToStep1}
                            >
                                Voltar
                            </button>
                            <button
                                style={{ ...styles.btn, ...styles.btnPrimary }}
                                onClick={handlePreview}
                            >
                                Pré-visualizar Bloco
                            </button>
                            <button
                                style={{
                                    ...styles.btn,
                                    ...styles.btnSecondary,
                                    ...(!formData.escola || !formData.professor || !formData.numAulas ? styles.btnDisabled : {})
                                }}
                                onClick={handleGeneratePDF}
                                disabled={!formData.escola || !formData.professor || !formData.numAulas}
                            >
                                Gerar PDF
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Alert */}
            <div style={styles.alert(alert.show, alert.type)}>
                {alert.message}
            </div>
        </div>
    );
    }
