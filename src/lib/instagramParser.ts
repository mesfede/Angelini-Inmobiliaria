import { OperationType, PropertyType } from '../types';

export interface ParsedPropertyData {
  title: string;
  operation: OperationType;
  type: PropertyType;
  priceUSD: number | '';
  priceARS: number | '';
  address: string;
  city: string;
  zone: string;
  totalArea: number | '';
  coveredArea: number | '';
  bedrooms: number | '';
  bathrooms: number | '';
  garages: number | '';
  description: string;
  amenities: string[];
  isAptoCredito: boolean;
  acceptsPermuta: boolean;
  contactPhone?: string;
  instagramUrl?: string;
  extractedHighlights: string[];
}

/**
 * Intelligent parser for real estate listings from Instagram, WhatsApp, or Facebook.
 * Extracts structured fields such as surfaces, rooms, bathrooms, amenities, price, and address.
 */
export function parseInstagramListing(rawText: string): ParsedPropertyData {
  const text = rawText.trim();
  if (!text) {
    return {
      title: '',
      operation: 'VENTA',
      type: 'Casa',
      priceUSD: '',
      priceARS: '',
      address: '',
      city: 'Azul',
      zone: 'Azul - Centro',
      totalArea: '',
      coveredArea: '',
      bedrooms: '',
      bathrooms: '',
      garages: '',
      description: text,
      amenities: [],
      isAptoCredito: false,
      acceptsPermuta: false,
      extractedHighlights: [],
    };
  }

  const lines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  const lowerText = text.toLowerCase();

  // 1. Operation Detection
  let operation: OperationType = 'VENTA';
  if (/alquiler\s+temporal|alquiler\s+temporario/i.test(text)) {
    operation = 'ALQUILER';
  } else if (/en\s+alquiler|alquilo|alquila|para\s+alquilar/i.test(text)) {
    operation = 'ALQUILER';
  } else if (/lote|terreno|lotes\s+y\s+terrenos/i.test(text) && !/casa\s+sobre\s+lote/i.test(text)) {
    operation = 'LOTES';
  } else if (/en\s+venta|vendo|vende|se\s+vende|venta\s+de/i.test(text)) {
    operation = 'VENTA';
  }

  // 2. Property Type Detection
  let type: PropertyType = 'Casa';
  if (/departamento|depto|semipiso|piso\s+exclusivo|monoambiente/i.test(text)) {
    type = 'Departamento';
  } else if (/\bph\b|propiedad\s+horizontal/i.test(text)) {
    type = 'PH';
  } else if (/quinta|chacra|campo|fracci[oó]n\s+de\s+campo/i.test(text)) {
    type = 'Quinta / Campo';
  } else if (/barrio\s+cerrado|country|club\s+de\s+campo/i.test(text)) {
    type = 'Barrio Cerrado';
  } else if (/local\s+comercial|oficina|galp[oó]n|dep[oó]sito/i.test(text) && !/casa\s+con\s+local/i.test(text)) {
    type = 'Local / Oficina';
  } else if (/lote|terreno|fracci[oó]n/i.test(text) && !/casa|depto|departamento|edificio/i.test(text)) {
    type = 'Lote / Terreno';
  } else {
    type = 'Casa';
  }

  // 3. Bedrooms / Habitaciones
  let bedrooms: number | '' = '';
  const bedRegexes = [
    /(\d+)\s*(?:hab(?:itaciones)?|dorm(?:itorios)?|cuartos?|dorm)\b/i,
    /(?:hab(?:itaciones)?|dorm(?:itorios)?|cuartos?)\s*[:•\-]?\s*(\d+)/i,
    /(?:monoambiente)/i,
  ];
  for (const reg of bedRegexes) {
    const match = text.match(reg);
    if (match) {
      if (match[0].toLowerCase().includes('monoambiente')) {
        bedrooms = 1;
      } else if (match[1]) {
        bedrooms = parseInt(match[1], 10);
      }
      break;
    }
  }

  // Handle word numbers (e.g., "cuatro habitaciones", "tres dormitorios")
  if (bedrooms === '') {
    if (/\b(un|una|1)\s*(?:hab|dorm|cuarto)/i.test(text)) bedrooms = 1;
    else if (/\b(dos|2)\s*(?:hab|dorm|cuarto)/i.test(text)) bedrooms = 2;
    else if (/\b(tres|3)\s*(?:hab|dorm|cuarto)/i.test(text)) bedrooms = 3;
    else if (/\b(cuatro|4)\s*(?:hab|dorm|cuarto)/i.test(text)) bedrooms = 4;
    else if (/\b(cinco|5)\s*(?:hab|dorm|cuarto)/i.test(text)) bedrooms = 5;
  }

  // 4. Bathrooms / Baños
  let bathrooms: number | '' = '';
  const bathMatch = text.match(/(\d+)\s*(?:ba[ñn]os?|toilettes?)\b/i) ||
                    text.match(/(?:ba[ñn]os?|toilettes?)\s*[:•\-]?\s*(\d+)/i);
  if (bathMatch && bathMatch[1]) {
    bathrooms = parseInt(bathMatch[1], 10);
  } else if (/\b(un|uno|1)\s*ba[ñn]o/i.test(text)) {
    bathrooms = 1;
  } else if (/\b(dos|2)\s*ba[ñn]os/i.test(text)) {
    bathrooms = 2;
  } else if (/\b(tres|3)\s*ba[ñn]os/i.test(text)) {
    bathrooms = 3;
  }

  // 5. Garages / Cocheras / Entrada para autos
  let garages: number | '' = '';
  const garageMatch = text.match(/(\d+)\s*(?:cocheras?|garages?|autos?|veh[ií]culos?)\b/i) ||
                      text.match(/(?:cochera|garage)\s*para\s*(\d+)\s*autos?/i);
  if (garageMatch && garageMatch[1]) {
    garages = parseInt(garageMatch[1], 10);
  } else if (/entrada\s+para\s+autos?|cochera|garage|espacio\s+guarda\s+coche/i.test(text)) {
    garages = 1;
  }

  // 6. Surface: Total Area (m²)
  let totalArea: number | '' = '';
  const totalAreaMatches = [
    /(?:superficie\s+total|sup\.?\s+total|terreno|lote|total)\s*[:•\-]?\s*(\d+(?:[.,]\d+)?)\s*(?:m2|m²|mts2|mts|metros)/i,
    /(\d+(?:[.,]\d+)?)\s*(?:m2|m²|mts2|mts)\s*(?:totales|de\s+terreno|de\s+lote)/i,
  ];
  for (const reg of totalAreaMatches) {
    const m = text.match(reg);
    if (m && m[1]) {
      totalArea = parseFloat(m[1].replace(',', '.'));
      break;
    }
  }

  // 7. Surface: Covered Area (m²)
  let coveredArea: number | '' = '';
  const coveredAreaMatches = [
    /(?:superficie\s+cubierta|sup\.?\s+cubierta|cubierta|edificada|construida)\s*[:•\-]?\s*(\d+(?:[.,]\d+)?)\s*(?:m2|m²|mts2|mts|metros)/i,
    /(\d+(?:[.,]\d+)?)\s*(?:m2|m²|mts2|mts)\s*(?:cubiertos|construidos|edificados)/i,
  ];
  for (const reg of coveredAreaMatches) {
    const m = text.match(reg);
    if (m && m[1]) {
      coveredArea = parseFloat(m[1].replace(',', '.'));
      break;
    }
  }

  // 8. Prices (USD and ARS)
  let priceUSD: number | '' = '';
  let priceARS: number | '' = '';
  const usdMatch = text.match(/(?:u\$s|usd|u\$d|d[oó]lares?)\s*[:•\-]?\s*([\d.,]+)/i) ||
                  text.match(/([\d.,]+)\s*(?:u\$s|usd|u\$d|d[oó]lares?)/i);
  if (usdMatch && usdMatch[1]) {
    const num = parseFloat(usdMatch[1].replace(/\./g, '').replace(',', '.'));
    if (!isNaN(num) && num > 1000) {
      priceUSD = num;
    }
  }

  const arsMatch = text.match(/(?:ars|pesos|\$)\s*[:•\-]?\s*([\d.,]+)/i);
  if (arsMatch && arsMatch[1] && !priceUSD) {
    const num = parseFloat(arsMatch[1].replace(/\./g, '').replace(',', '.'));
    if (!isNaN(num) && num > 50000) {
      priceARS = num;
    }
  }

  // 9. Location & Address & City
  let address = '';
  let city = 'Azul';
  let zone = 'Azul - Centro';

  // Detect street / avenue (e.g., "Av. Mitre", "sobre Av. Mitre", "Calle San Martín 1234", "Pellegrini e Yrigoyen")
  const addressMatch = text.match(/(?:sobre\s+|calle\s+|en\s+|ubicada\s+en\s+)?(Av\.?\s+[A-Za-zÁ-ú0-9\s]+|Avenida\s+[A-Za-zÁ-ú0-9\s]+|Calle\s+[A-Za-zÁ-ú0-9\s]+|[A-ZÁ-Ú][a-zá-ú]+\s+(?:y|e)\s+[A-ZÁ-Ú][a-zá-ú]+|[A-ZÁ-Ú][a-zá-ú]+\s+\d{2,5})/i);
  if (addressMatch && addressMatch[1]) {
    let rawAddr = addressMatch[1].replace(/^(sobre|calle|en|ubicada en)\s+/i, '').trim();
    // Clean trailing punctuation or words
    rawAddr = rawAddr.split(/\n|\r|\.|,|—|\(/)[0].trim();
    if (rawAddr.length > 3 && rawAddr.length < 50) {
      address = rawAddr;
    }
  }

  // Zone / City detection
  if (/tandil/i.test(text)) {
    city = 'Tandil';
    zone = 'Tandil';
  } else if (/villa\s+gloria/i.test(text)) {
    city = 'Azul';
    zone = 'Azul - Villa Gloria';
  } else if (/costanera/i.test(text)) {
    city = 'Azul';
    zone = 'Azul - Costanera';
  } else if (/macrocentro/i.test(text) || /centro/i.test(text) || /av\.?\s+mitre/i.test(text) || /san\s+mart[ií]n/i.test(text)) {
    city = 'Azul';
    zone = 'Azul - Centro';
  } else if (/zona\s+norte/i.test(text)) {
    zone = 'Azul - Zona Norte';
  } else if (/zona\s+sur/i.test(text)) {
    zone = 'Azul - Zona Sur';
  } else if (/quintas|chacras/i.test(text)) {
    zone = 'Azul - Quintas / Chacras';
  }

  // 10. Flags: Apto Crédito & Permuta
  const isAptoCredito = /apta?\s+cr[eé]dito|cr[eé]dito\s+hipotecario/i.test(text);
  const acceptsPermuta = /permuta|toma\s+menor\s+valor|acepta\s+propiedad|acepta\s+veh[ií]culo/i.test(text);

  // 11. Contact Phone Detection
  let contactPhone = '';
  const phoneMatch = text.match(/(?:consultas?|contacto|tel|whatsapp|cel)[:\s•\-]*([+\d\s\-()]{7,20})/i) ||
                     text.match(/(\b2281[\s\-]?\d{6}\b|\b\d{2,4}[\s\-]?\d{6,8}\b)/);
  if (phoneMatch && phoneMatch[1]) {
    contactPhone = phoneMatch[1].trim();
  }

  // 12. Instagram URL or Link Detection
  let instagramUrl = '';
  const igMatch = text.match(/https?:\/\/(?:www\.)?instagram\.com\/[^\s]+/i);
  if (igMatch && igMatch[0]) {
    instagramUrl = igMatch[0];
  }

  // 13. Smart Amenities Extraction (Standard & Custom Highlight Items)
  const extractedAmenitiesSet = new Set<string>();
  const extractedHighlights: string[] = [];

  // Extract bullet points from text (lines starting with •, -, *, ✨, etc.)
  const bulletLines = lines.filter((l) => /^[•\-\*✨👉🔹✔✓]\s*/.test(l) || /^la propiedad cuenta/i.test(l));

  for (const line of lines) {
    const cleanLine = line.replace(/^[•\-\*✨👉🔹✔✓📐📲🔄<>\s]+/, '').trim();
    if (!cleanLine || cleanLine.length > 55) continue;

    // Check specific custom features
    if (/local\s+(?:comercial|sobre)/i.test(cleanLine)) {
      extractedAmenitiesSet.add('Local Comercial');
      extractedHighlights.push(cleanLine);
    } else if (/escritorio|estudio/i.test(cleanLine)) {
      extractedAmenitiesSet.add('Escritorio');
    } else if (/lavadero/i.test(cleanLine)) {
      extractedAmenitiesSet.add('Lavadero');
    } else if (/living/i.test(cleanLine)) {
      extractedAmenitiesSet.add('Living Comedor');
    } else if (/cocina/i.test(cleanLine)) {
      extractedAmenitiesSet.add('Cocina Comedor');
    } else if (/patio\s+de\s+luz/i.test(cleanLine)) {
      extractedAmenitiesSet.add('Patio de Luz');
    } else if (/patio/i.test(cleanLine)) {
      extractedAmenitiesSet.add('Patio');
      if (cleanLine.length > 10 && cleanLine.length < 50) extractedHighlights.push(cleanLine);
    } else if (/parrilla|quincho/i.test(cleanLine)) {
      extractedAmenitiesSet.add('Parrilla');
    } else if (/pileta|piscina/i.test(cleanLine)) {
      extractedAmenitiesSet.add('Pileta');
    } else if (/jard[ií]n|parque/i.test(cleanLine)) {
      extractedAmenitiesSet.add('Jardín');
    } else if (/entrada\s+para\s+autos?|cochera|garage/i.test(cleanLine)) {
      extractedAmenitiesSet.add('Cochera');
    } else if (/gas\s+natural/i.test(cleanLine)) {
      extractedAmenitiesSet.add('Gas Natural');
    } else if (/agua\s+corriente/i.test(cleanLine)) {
      extractedAmenitiesSet.add('Agua Corriente');
    } else if (/cloacas/i.test(cleanLine)) {
      extractedAmenitiesSet.add('Cloacas');
    } else if (/electricidad|luz/i.test(cleanLine)) {
      extractedAmenitiesSet.add('Electricidad');
    } else if (/alarma|seguridad/i.test(cleanLine)) {
      extractedAmenitiesSet.add('Alarma / Seguridad');
    }
  }

  // General text scanning for essential services
  if (/gas\s+natural/i.test(text)) extractedAmenitiesSet.add('Gas Natural');
  if (/agua\s+corriente/i.test(text)) extractedAmenitiesSet.add('Agua Corriente');
  if (/cloacas/i.test(text)) extractedAmenitiesSet.add('Cloacas');
  if (/electricidad/i.test(text)) extractedAmenitiesSet.add('Electricidad');
  if (/parrilla|quincho/i.test(text)) extractedAmenitiesSet.add('Parrilla');
  if (/cochera|garage|entrada\s+para\s+auto/i.test(text)) extractedAmenitiesSet.add('Cochera');
  if (/pileta|piscina/i.test(text)) extractedAmenitiesSet.add('Pileta');
  if (/jard[ií]n|parque/i.test(text)) extractedAmenitiesSet.add('Jardín');
  if (/lavadero/i.test(text)) extractedAmenitiesSet.add('Lavadero');
  if (isAptoCredito) extractedAmenitiesSet.add('Apto Crédito');

  // 14. Title Generation
  let title = '';
  // Try to build a clean, impactful real estate title
  const parts: string[] = [];
  
  if (type === 'Casa' && /local/i.test(text)) {
    parts.push('Casa con Local Comercial');
  } else if (type === 'Casa') {
    parts.push('Casa');
  } else if (type === 'Departamento') {
    parts.push('Departamento');
  } else if (type === 'Lote / Terreno') {
    parts.push('Lote');
  } else if (type === 'Quinta / Campo') {
    parts.push('Quinta / Chacra');
  } else {
    parts.push(type);
  }

  if (address) {
    parts.push(`sobre ${address}`);
  }

  if (bedrooms && typeof bedrooms === 'number') {
    parts.push(`- ${bedrooms} Dormitorios`);
  }

  if (parts.length > 1) {
    title = parts.join(' ');
  } else {
    // Fallback to first line if clean
    const firstLine = lines[0] || '';
    if (firstLine.length > 10 && firstLine.length < 80) {
      title = firstLine.replace(/^[•\-\*✨👉🔹✔✓\s]+/, '').trim();
    } else {
      title = `${type} en Venta en ${zone}`;
    }
  }

  return {
    title,
    operation,
    type,
    priceUSD,
    priceARS,
    address,
    city,
    zone,
    totalArea,
    coveredArea,
    bedrooms,
    bathrooms,
    garages,
    description: text,
    amenities: Array.from(extractedAmenitiesSet),
    isAptoCredito,
    acceptsPermuta,
    contactPhone,
    instagramUrl,
    extractedHighlights,
  };
}
