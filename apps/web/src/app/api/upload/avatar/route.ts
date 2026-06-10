import { NextResponse } from 'next/server';
import { put } from '@vercel/blob';

const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const MAX_BYTES = 5 * 1024 * 1024; // 5 MB

export async function POST(req: Request) {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json({ error: 'Blob storage no configurado' }, { status: 503 });
  }

  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json({ error: 'Payload inválido' }, { status: 400 });
  }

  const file = formData.get('file');
  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'Se requiere un archivo' }, { status: 400 });
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json({ error: 'Tipo de archivo no permitido. Usa JPG, PNG o WebP.' }, { status: 400 });
  }

  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: 'El archivo supera el límite de 5 MB.' }, { status: 400 });
  }

  try {
    const ext = file.name.split('.').pop() ?? 'jpg';
    const blob = await put(`avatars/${Date.now()}.${ext}`, file, {
      access: 'public',
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });
    return NextResponse.json({ url: blob.url });
  } catch (error) {
    console.error('[POST /api/upload/avatar]', error);
    return NextResponse.json({ error: 'Error al subir la imagen' }, { status: 500 });
  }
}
