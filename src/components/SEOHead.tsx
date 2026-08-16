import React, { useEffect } from 'react';
import { Property, SearchFilters } from '../types';

interface SEOHeadProps {
  selectedProperty?: Property | null;
  filters?: SearchFilters;
  totalProperties?: number;
}

export const SEOHead: React.FC<SEOHeadProps> = ({
  selectedProperty,
  filters,
}) => {
  useEffect(() => {
    const siteName = 'Angelini Inmobiliaria';
    
    // Dynamically calculate the base URL from the current window location
    const currentOrigin = window.location.origin;
    let currentPathname = window.location.pathname;
    if (!currentPathname.endsWith('/')) {
      currentPathname = currentPathname.substring(0, currentPathname.lastIndexOf('/') + 1);
    }
    const dynamicBaseUrl = `${currentOrigin}${currentPathname}`;

    let title = `${siteName} | Propiedades en Azul, Buenos Aires`;
    let description =
      'Angelini Inmobiliaria en Azul (Buenos Aires). Venta, alquiler y tasaciones profesionales de casas, departamentos, terrenos, locales y campos. Fuerte en raíces, sólido en hogares.';
    let imageUrl = `${dynamicBaseUrl}logo.svg`;
    let pageUrl = dynamicBaseUrl;
    let schemaType = 'RealEstateAgent';

    if (selectedProperty) {
      const opText =
        selectedProperty.operation === 'VENTA'
          ? 'en Venta'
          : selectedProperty.operation === 'ALQUILER'
          ? 'en Alquiler'
          : 'en Alquiler Temporal';
      const cityText = selectedProperty.location?.city || selectedProperty.location?.zone || 'Azul';
      
      title = `${selectedProperty.title} ${opText} en ${cityText} | ${siteName}`;
      
      const specs = [
        selectedProperty.bedrooms ? `${selectedProperty.bedrooms} dorm.` : null,
        selectedProperty.bathrooms ? `${selectedProperty.bathrooms} baño${selectedProperty.bathrooms > 1 ? 's' : ''}` : null,
        selectedProperty.coveredArea ? `${selectedProperty.coveredArea} m² cubiertos` : null,
      ].filter(Boolean).join(' · ');

      const priceText = selectedProperty.priceUSD 
        ? `USD $${selectedProperty.priceUSD.toLocaleString('es-AR')}`
        : selectedProperty.priceARS 
        ? `$${selectedProperty.priceARS.toLocaleString('es-AR')}`
        : 'Consultar precio';

      description = `${selectedProperty.title} ${opText} en ${cityText}. ${priceText}. ${specs ? `${specs}. ` : ''}${selectedProperty.description ? selectedProperty.description.substring(0, 140) + '...' : 'Tasaciones y gestión inmobiliaria profesional por Angelini Inmobiliaria.'}`;
      
      if (selectedProperty.images && selectedProperty.images.length > 0) {
        imageUrl = selectedProperty.images[0];
      }
      pageUrl = `${dynamicBaseUrl}?propiedad=${selectedProperty.id}`;
      schemaType = 'SingleFamilyResidence';
    } else if (filters && filters.operation !== 'TODAS') {
      const opName =
        filters.operation === 'VENTA'
          ? 'en Venta'
          : filters.operation === 'ALQUILER'
          ? 'en Alquiler'
          : 'Lotes y Terrenos';
      title = `Propiedades ${opName} en Azul | ${siteName}`;
      description = `Catálogo de propiedades ${opName.toLowerCase()} en Azul y la zona. Casas, departamentos, lotes y campos. Asesoramiento profesional por Angelini Inmobiliaria.`;
      pageUrl = `${dynamicBaseUrl}?operacion=${filters.operation}`;
    }

    // 1. Update Document Title
    document.title = title;

    // 2. Helper to set or create meta tag
    const updateMeta = (selector: string, attributeName: string, attributeValue: string, content: string) => {
      let element = document.querySelector(`meta[${selector}]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attributeName, attributeValue);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // Helper to set or create link tag
    const updateLink = (rel: string, href: string) => {
      let element = document.querySelector(`link[rel="${rel}"]`);
      if (!element) {
        element = document.createElement('link');
        element.setAttribute(rel, rel);
        document.head.appendChild(element);
      }
      element.setAttribute('href', href);
    };

    // Standard & Search Meta
    updateMeta('name="description"', 'name', 'description', description);
    updateMeta('name="title"', 'name', 'title', title);
    updateLink('canonical', pageUrl);

    // OpenGraph (Facebook / WhatsApp)
    updateMeta('property="og:title"', 'property', 'og:title', title);
    updateMeta('property="og:description"', 'property', 'og:description', description);
    updateMeta('property="og:image"', 'property', 'og:image', imageUrl);
    updateMeta('property="og:url"', 'property', 'og:url', pageUrl);

    // Twitter Cards
    updateMeta('property="twitter:title"', 'property', 'twitter:title', title);
    updateMeta('property="twitter:description"', 'property', 'twitter:description', description);
    updateMeta('property="twitter:image"', 'property', 'twitter:image', imageUrl);

    // 3. Dynamic JSON-LD Structured Data for Google Rich Snippets
    let jsonLdData: any;

    if (selectedProperty) {
      jsonLdData = {
        '@context': 'https://schema.org',
        '@type': 'RealEstateListing',
        'name': selectedProperty.title,
        'description': selectedProperty.description || description,
        'url': pageUrl,
        'image': selectedProperty.images || [imageUrl],
        'offers': {
          '@type': 'Offer',
          'price': selectedProperty.priceUSD || selectedProperty.priceARS || 0,
          'priceCurrency': selectedProperty.priceUSD ? 'USD' : 'ARS',
          'availability': 'https://schema.org/InStock',
          'seller': {
            '@type': 'RealEstateAgent',
            'name': siteName,
            'telephone': '+5492281301464',
            'url': dynamicBaseUrl,
          },
        },
        'address': {
          '@type': 'PostalAddress',
          'streetAddress': 'De Paula 1216',
          'addressLocality': selectedProperty.location?.city || selectedProperty.location?.zone || 'Azul',
          'addressRegion': 'Buenos Aires',
          'addressCountry': 'AR',
        },
      };

      if (selectedProperty.bedrooms) jsonLdData.numberOfRooms = selectedProperty.bedrooms;
      if (selectedProperty.bathrooms) jsonLdData.numberOfBathroomsTotal = selectedProperty.bathrooms;
    } else {
      jsonLdData = [
        {
          '@context': 'https://schema.org',
          '@type': 'RealEstateAgent',
          'name': siteName,
          'image': `${dynamicBaseUrl}logo.svg`,
          'telephone': '+5492281301464',
          'email': 'contacto@angeliniinmobiliaria.ar',
          'url': dynamicBaseUrl,
          'address': {
            '@type': 'PostalAddress',
            'streetAddress': 'De Paula 1216',
            'addressLocality': 'Azul',
            'addressRegion': 'Buenos Aires',
            'postalCode': '7300',
            'addressCountry': 'AR',
          },
          'geo': {
            '@type': 'GeoCoordinates',
            'latitude': -36.7769,
            'longitude': -59.8585,
          },
          'priceRange': '$$',
          'sameAs': [
            'https://www.instagram.com/angelini_inmobiliaria/',
            'https://wa.me/5492281301464',
          ],
        },
        {
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          'name': siteName,
          'url': dynamicBaseUrl,
        },
      ];
    }

    // Inject or replace JSON-LD element in document body / head
    let scriptEl = document.getElementById('dynamic-json-ld');
    if (!scriptEl) {
      scriptEl = document.createElement('script');
      scriptEl.id = 'dynamic-json-ld';
      scriptEl.setAttribute('type', 'application/ld+json');
      document.head.appendChild(scriptEl);
    }
    scriptEl.textContent = JSON.stringify(jsonLdData);

  }, [selectedProperty, filters]);

  return null;
};

