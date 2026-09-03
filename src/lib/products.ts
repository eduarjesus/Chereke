import Papa from 'papaparse';
import sampleProducts from '../data/sample-products.json';

export interface Producto {
  slug: string;
  nombre: string;
  precio: string;
  categoria: string;
  descripcion: string;
  disponible: boolean;
  fotos: string[];
}

function slugify(texto: string): string {
  return texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

/**
 * Convierte un link normal de "compartir" de Google Drive
 * (https://drive.google.com/file/d/ID/view?usp=sharing)
 * a un link de imagen directa que sí se puede mostrar en <img>.
 * Si la URL no es de Drive, la deja tal cual (ej. Imgur, Unsplash, etc).
 */
function normalizarUrlImagen(url: string): string {
  const trimmed = url.trim();
  const match = trimmed.match(/drive\.google\.com\/file\/d\/([^/]+)/);
  if (match) {
    return `https://drive.google.com/uc?export=view&id=${match[1]}`;
  }
  return trimmed;
}

function filaAProducto(fila: Record<string, string>): Producto {
  const nombre = (fila.nombre ?? '').trim();
  const fotos = (fila.fotos ?? '')
    .split(',')
    .map((f) => f.trim())
    .filter(Boolean)
    .map(normalizarUrlImagen);

  return {
    slug: slugify(nombre || Math.random().toString(36).slice(2)),
    nombre,
    precio: (fila.precio ?? '').trim(),
    categoria: (fila.categoria ?? '').trim(),
    descripcion: (fila.descripcion ?? '').trim(),
    disponible: /^s[ií]$/i.test((fila.disponible ?? 'sí').trim()),
    fotos,
  };
}

export async function getProducts(): Promise<Producto[]> {
  const sheetUrl = import.meta.env.PUBLIC_SHEET_CSV_URL;

  if (!sheetUrl) {
    console.warn(
      '[chereke] PUBLIC_SHEET_CSV_URL no está configurada — usando datos de ejemplo. ' +
      'Revisa el README para conectar tu Google Sheet real.'
    );
    return (sampleProducts as Record<string, string>[]).map(filaAProducto);
  }

  try {
    const res = await fetch(sheetUrl);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const csvText = await res.text();
    const { data } = Papa.parse<Record<string, string>>(csvText, {
      header: true,
      skipEmptyLines: true,
    });
    return data.map(filaAProducto).filter((p) => p.nombre);
  } catch (err) {
    console.error('[chereke] No se pudo leer el Google Sheet, usando datos de ejemplo:', err);
    return (sampleProducts as Record<string, string>[]).map(filaAProducto);
  }
}
