export const provinciasMoz = [
  "Maputo Cidade", "Maputo Província", "Gaza", "Inhambane",
  "Sofala", "Manica", "Tete", "Zambézia", "Nampula",
  "Cabo Delgado", "Niassa"
];

export const distritosPorProvincia = {
  "Maputo Cidade": ["Maputo Cidade"],
  "Maputo Província": ["Matola", "Boane", "Marracuene", "Manhiça", "Magude", "Moamba", "Namaacha", "Matutuíne"],
  "Gaza": ["Xai-Xai", "Chokwé", "Bilene", "Chibuto", "Guijá", "Mapai", "Mabalane", "Manjacaze", "Massangena"],
  "Inhambane": ["Inhambane", "Maxixe", "Vilanculos", "Massinga", "Zavala", "Jangamo", "Morrumbene", "Panda", "Funhalouro", "Inharrime", "Mabote"],
  "Sofala": ["Beira", "Dondo", "Gorongosa", "Búzi", "Machanga", "Muanza", "Nhamatanda", "Chemba", "Caia", "Marromeu", "Cheringoma"],
  "Manica": ["Chimoio", "Manica", "Sussundenga", "Macossa", "Gondola", "Mossurize", "Báruè", "Machaze"],
  "Tete": ["Tete", "Moatize", "Cahora Bassa", "Changara", "Macanga", "Marávia", "Tsangano", "Zumbo", "Chiuta", "Dôa", "Magoé", "Mutarara"],
  "Zambézia": ["Quelimane", "Chinde", "Maganja da Costa", "Morrumbala", "Alto Molócuè", "Gile", "Milange", "Nicoadala", "Gurué", "Mopeia", "Namacurra", "Pebane"],
  "Nampula": ["Nampula", "Ilha de Moçambique", "Nacala", "Mossuril", "Ribaué", "Muecate", "Monapo", "Lalaua", "Mecubúri", "Memba", "Eráti", "Malema", "Nacarôa"],
  "Cabo Delgado": ["Pemba", "Montepuez", "Mocímboa da Praia", "Palma", "Mueda", "Balama", "Chiure", "Metuge", "Namuno", "Meluco", "Ancuabe", "Ibo"],
  "Niassa": ["Lichinga", "Cuamba", "Mandimba", "Majune", "Sanga", "Mavago", "Mecula", "Marrupa", "Metarica", "Muembe", "Ngauma"]
};

export const professoresIniciais = [
  { 
    id: "1",
    nome: "Carlos Mondlane", 
    nivel: "DN2", 
    provAtual: "Maputo Província", 
    distritoAtual: "Matola", 
    tipoLocal: "Dentro da Vila", 
    distancia: 0, 
    provDestino: "Sofala", 
    distDestino: "Beira", 
    condicoes: "-", 
    telefone: "841112233" 
  },
  { 
    id: "2",
    nome: "Ana Sitoe", 
    nivel: "DN1", 
    provAtual: "Inhambane", 
    distritoAtual: "Maxixe", 
    tipoLocal: "Fora da Vila", 
    distancia: 50, 
    provDestino: "Maputo Cidade", 
    distDestino: "Maputo Cidade", 
    condicoes: "-", 
    telefone: "859988776" 
  },
  { 
    id: "3",
    nome: "João Macheve", 
    nivel: "DN2", 
    provAtual: "Tete", 
    distritoAtual: "Tete", 
    tipoLocal: "Dentro da Vila", 
    distancia: 0, 
    provDestino: "Maputo Província", 
    distDestino: "Matola", 
    condicoes: "Precisa de casa", 
    telefone: "820000000" 
  }
];
