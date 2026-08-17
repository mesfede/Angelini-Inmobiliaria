import React, { useState } from 'react';
import { X, Calculator } from 'lucide-react';
import { PropertyType, ValuationRequest } from '../types';

interface TasacionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TasacionModal: React.FC<TasacionModalProps> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState<ValuationRequest>({
    fullName: '',
    email: '',
    phone: '',
    propertyType: 'Casa',
    operationType: 'VENTA',
    address: '',
    cityZone: 'Azul',
    totalArea: '',
    bedrooms: '',
    comments: '',
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName.trim() || !formData.phone.trim()) {
      alert('Por favor complete Nombre Completo y Teléfono de Contacto.');
      return;
    }

    const message = encodeURIComponent(
      `Hola Inmobiliaria Angelini, solicito tasación para:\n- Tipo de Inmueble: ${formData.propertyType}\n- Ubicación: ${formData.address || 'No especificada'}, ${formData.cityZone}\n- Nombre: ${formData.fullName}\n- Teléfono: ${formData.phone}${formData.comments ? `\n- Observaciones: ${formData.comments}` : ''}`
    );

    const waUrl = `https://wa.me/5492281301464?text=${message}`;
    window.open(waUrl, '_blank');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden border border-[#dbdad8]">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#041020] via-[#041020] to-[#020912] text-white p-5 flex items-center justify-between border-b border-white/15">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-[#B08237] rounded-xl text-white shadow-sm">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold font-['Playfair_Display','Libre_Baskerville',Georgia,serif]">Tasaciones</h2>
              <p className="text-xs text-[#dbdad8] font-medium">Angelini Inmobiliaria · Azul, Bs. As.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/10 text-white transition-colors cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <p className="text-xs text-slate-600">
              Completá los datos a continuación para solicitar la tasación profesional de tu inmueble con Angelini Inmobiliaria.
            </p>

            {/* Tipo de Inmueble */}
            <div>
              <label className="text-xs font-bold text-[#041020] mb-1 block">Tipo de Inmueble</label>
              <select
                value={formData.propertyType}
                onChange={(e) =>
                  setFormData({ ...formData, propertyType: e.target.value as PropertyType })
                }
                className="w-full bg-[#dbdad8]/20 border border-[#dbdad8] rounded-xl p-2.5 text-xs font-semibold text-[#041020] focus:ring-2 focus:ring-[#B08237]"
              >
                <option value="Casa">Casa</option>
                <option value="Departamento">Departamento</option>
                <option value="Lote / Terreno">Lote / Terreno</option>
                <option value="Campo / Quinta">Campo / Quinta</option>
                <option value="Barrio Cerrado">Barrio Cerrado</option>
                <option value="PH">PH</option>
                <option value="Local / Oficina">Local / Oficina</option>
                <option value="Otros">Otros</option>
              </select>
            </div>

            {/* Location & Address */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-[#041020] mb-1 block">Dirección o Referencia</label>
                <input
                  type="text"
                  placeholder="Ej: De Paula 1216"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full bg-[#dbdad8]/20 border border-[#dbdad8] rounded-xl p-2.5 text-xs text-[#041020] focus:ring-2 focus:ring-[#B08237]"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-[#041020] mb-1 block">Zona / Localidad</label>
                <input
                  type="text"
                  placeholder="Ej: Azul Centro"
                  value={formData.cityZone}
                  onChange={(e) => setFormData({ ...formData, cityZone: e.target.value })}
                  className="w-full bg-[#dbdad8]/20 border border-[#dbdad8] rounded-xl p-2.5 text-xs text-[#041020] focus:ring-2 focus:ring-[#B08237]"
                />
              </div>
            </div>

            {/* Mandatory Contact Information */}
            <div className="pt-2 border-t border-[#dbdad8] grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-[#041020] mb-1 block">
                  Nombre Completo <span className="text-[#B08237]">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Tu Nombre completo"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full bg-[#dbdad8]/20 border border-[#dbdad8] rounded-xl p-2.5 text-xs text-[#041020] focus:ring-2 focus:ring-[#B08237]"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-[#041020] mb-1 block">
                  Teléfono de Contacto <span className="text-[#B08237]">*</span>
                </label>
                <input
                  type="tel"
                  required
                  placeholder="Tu Teléfono de contacto"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full bg-[#dbdad8]/20 border border-[#dbdad8] rounded-xl p-2.5 text-xs text-[#041020] focus:ring-2 focus:ring-[#B08237]"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-[#041020] mb-1 block">Observaciones adicionales</label>
              <textarea
                rows={2}
                placeholder="Detalles sobre el estado del inmueble o consulta..."
                value={formData.comments}
                onChange={(e) => setFormData({ ...formData, comments: e.target.value })}
                className="w-full bg-[#dbdad8]/20 border border-[#dbdad8] rounded-xl p-2 text-xs text-[#041020] focus:ring-2 focus:ring-[#B08237]"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#B08237] hover:bg-[#9A702D] text-white py-3.5 rounded-xl font-bold text-sm shadow-md transition-all cursor-pointer border border-white/20"
            >
              Solicitar Tasación
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
