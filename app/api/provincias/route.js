import { NextResponse } from 'next/server';
import { provinciasMoz, distritosPorProvincia } from '@/lib/data';

export async function GET() {
  return NextResponse.json({
    provincias: provinciasMoz,
    distritos: distritosPorProvincia
  });
}
