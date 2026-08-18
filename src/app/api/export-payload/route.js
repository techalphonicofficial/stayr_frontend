import { NextResponse } from 'next/server';
import { ALL_LISTINGS } from '@/data/listings';
import { getDetailedPropertyById } from '@/data/mockPropertyDetails';

export async function GET() {
  const payload = ALL_LISTINGS.map(l => getDetailedPropertyById(l.id));
  return NextResponse.json(payload);
}
