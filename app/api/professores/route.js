import { NextResponse } from 'next/server';
import { professoresIniciais } from '@/lib/data';

let professores = [...professoresIniciais];
let nextId = 4;

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const provFiltro = searchParams.get('provincia');
  
  if (provFiltro) {
    const filtrados = professores.filter(p => p.provDestino === provFiltro);
    return NextResponse.json(filtrados);
  }
  
  return NextResponse.json(professores);
}

export async function POST(request) {
  try {
    const data = await request.json();
    
    const novoProfessor = {
      id: String(nextId++),
      ...data
    };
    
    professores.push(novoProfessor);
    
    const matches = professores.filter(p => 
      p.provDestino === novoProfessor.provAtual && 
      p.nivel === novoProfessor.nivel &&
      p.id !== novoProfessor.id
    );
    
    return NextResponse.json({
      professor: novoProfessor,
      matches: matches,
      message: matches.length > 0 
        ? `Encontramos ${matches.length} professor(es) compatível(eis)!`
        : "Registado! Ainda não há compatibilidades."
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Erro ao criar registro' },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  professores = [...professoresIniciais];
  nextId = 4;
  return NextResponse.json({ message: 'Dados resetados com sucesso' });
}
