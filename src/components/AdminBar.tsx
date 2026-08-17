import React, { useRef, useState } from 'react';
import { Plus, LogOut, ShieldCheck, CheckCircle2, Download, Upload, RefreshCw } from 'lucide-react';

interface AdminBarProps {
  adminEmail: string;
  onOpenAddProperty: () => void;
  onLogout: () => void;
  isFirebaseActive: boolean;
  firebaseError?: string | null;
  totalPropertiesCount: number;
  onExportBackup?: () => void;
  onImportBackup?: (file: File) => void;
  onSyncFirebase?: () => Promise<void>;
}

export const AdminBar: React.FC<AdminBarProps> = ({
  onOpenAddProperty,
  onLogout,
  isFirebaseActive,
  firebaseError,
  totalPropertiesCount,
  onExportBackup,
  onImportBackup,
  onSyncFirebase,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [msg, setMsg] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);

  const handleSyncClick = async () => {
    if (!onSyncFirebase) return;
    setIsSyncing(true);
    try {
      await onSyncFirebase();
      setMsg('¡Sincronizado con Firebase!');
    } catch {
      setMsg('Error al sincronizar');
    } finally {
      setIsSyncing(false);
      setTimeout(() => setMsg(''), 4000);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onImportBackup) {
      onImportBackup(file);
      setMsg('¡Copia de seguridad importada!');
      setTimeout(() => setMsg(''), 4000);
      e.target.value = '';
    }
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50 w-full bg-[#041020]/95 backdrop-blur-md border-b border-white/10 px-4 sm:px-8 py-2.5 sm:py-3 min-h-[52px] flex items-center justify-between gap-3 shadow-lg">
      {/* Left side: Administrator indicator & Count */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#B08237] animate-pulse"></span>
          <span className="text-white font-semibold text-xs sm:text-sm tracking-wide flex items-center gap-2 font-['Playfair_Display','Libre_Baskerville',Georgia,serif]">
            <ShieldCheck className="w-4.5 h-4.5 text-[#B08237]" />
            <span className="hidden sm:inline">Modo Administrador</span>
          </span>
        </div>
        <span className="bg-white/10 text-[#dbdad8] text-xs px-2.5 py-1 rounded-full border border-white/15 font-medium">
          {totalPropertiesCount} {totalPropertiesCount === 1 ? 'propiedad' : 'propiedades'}
        </span>

        {/* Firebase Status Badge */}
        {isFirebaseActive ? (
          <span className="flex items-center gap-1.5 bg-emerald-950/60 text-emerald-300 border border-emerald-500/40 text-[10px] px-2 py-0.5 rounded-md font-medium tracking-wide">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            Nube Activa
          </span>
        ) : (
          <span
            className="flex items-center gap-1.5 bg-amber-950/60 text-amber-300 border border-amber-500/40 text-[10px] px-2 py-0.5 rounded-md font-medium tracking-wide cursor-help"
            title={firebaseError || "No conectado a Firebase Cloud. Las propiedades se guardarán localmente."}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
            Modo Local (Offline)
          </span>
        )}
      </div>

      {/* Right side: Action buttons & Backup controls */}
      <div className="flex items-center gap-2 sm:gap-2.5">
        {msg && (
          <span className="text-emerald-400 font-semibold text-xs flex items-center gap-1 mr-1">
            <CheckCircle2 className="w-4 h-4" />
            <span>{msg}</span>
          </span>
        )}

        {/* Hidden File Input for Import */}
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={handleFileChange}
          className="hidden"
        />

        {/* Sync from Live Web Button */}
        {onSyncFirebase && (
          <button
            type="button"
            onClick={handleSyncClick}
            disabled={isSyncing}
            className="bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
            title="Sincronizar y actualizar catálogo desde la web en vivo (Hostinger)"
          >
            <RefreshCw className={`w-4 h-4 text-emerald-400 ${isSyncing ? 'animate-spin' : ''}`} />
            <span className="inline">{isSyncing ? 'Sincronizando...' : 'Sincronizar con Web en Vivo'}</span>
          </button>
        )}

        {/* Backup Import Button */}
        {onImportBackup && (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="bg-white/10 hover:bg-white/15 text-[#dbdad8] border border-white/20 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5"
            title="Importar catálogo desde archivo JSON a Firebase"
          >
            <Upload className="w-4 h-4 text-[#dbdad8]" />
            <span className="inline">Importar JSON</span>
          </button>
        )}

        {/* Backup Export Button */}
        {onExportBackup && (
          <button
            type="button"
            onClick={onExportBackup}
            className="bg-white/10 hover:bg-white/15 text-[#dbdad8] border border-white/20 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5"
            title="Descargar copia de seguridad en archivo JSON"
          >
            <Download className="w-4 h-4 text-[#B08237]" />
            <span className="hidden sm:inline">Descargar Backup</span>
          </button>
        )}

        <button
          type="button"
          onClick={onOpenAddProperty}
          className="bg-[#B08237] hover:bg-[#9A702D] active:scale-[0.98] text-white px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-bold shadow-md transition-all cursor-pointer flex items-center gap-2 border border-white/20"
        >
          <Plus className="w-4.5 h-4.5 stroke-[2.5]" />
          <span>Cargar Propiedad</span>
        </button>

        <button
          type="button"
          onClick={onLogout}
          className="bg-white/10 hover:bg-white/20 hover:text-white active:scale-[0.98] text-[#dbdad8] border border-white/15 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center gap-1.5"
          title="Cerrar sesión de administrador"
        >
          <LogOut className="w-4 h-4 text-slate-400" />
          <span className="hidden sm:inline">Salir</span>
        </button>
      </div>
    </div>
  );
};
