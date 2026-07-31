'use client';

import { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { Appointment } from '@/types';
import { toDateStr } from '@/lib/date';

interface Props {
  appointments: Appointment[];
  directors: { id: string; firstName: string; lastName: string }[];
  currentDirectorId?: string;
  className?: string;
}

const typeLabels: Record<string, string> = {
  REUNION: 'Réunion', DEJEUNER: 'Déjeuner', VISITE: 'Visite',
  VISIO: 'Visioconférence', PERSO: 'Personnel', AUTRE: 'Autre',
};

const statusLabels: Record<string, string> = {
  CONFIRMED: 'Confirmé', PENDING: 'En attente', CANCELLED: 'Annulé', DONE: 'Terminé',
};

const priorityLabels: Record<string, string> = {
  HIGH: 'Haute', NORMAL: 'Normale', LOW: 'Basse',
};

export function ExportExcel({ appointments, directors, currentDirectorId, className = '' }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [filterDirector, setFilterDirector] = useState('');
  const [filterTypes, setFilterTypes] = useState<string[]>([]);
  const [filterStatuses, setFilterStatuses] = useState<string[]>([]);
  const [filterPriorities, setFilterPriorities] = useState<string[]>([]);

  // Pré-sélectionne le directeur actuel quand on ouvre le modal
  useEffect(() => {
    if (isOpen && currentDirectorId) {
      setFilterDirector(currentDirectorId);
    }
  }, [isOpen, currentDirectorId]);

  const toggle = (val: string, arr: string[], setter: (v: string[]) => void) => {
    setter(arr.includes(val) ? arr.filter(v => v !== val) : [...arr, val]);
  };

  const filtered = appointments.filter(a => {
    const d = toDateStr(a.date);
    if (dateFrom && d < dateFrom) return false;
    if (dateTo && d > dateTo) return false;
    if (filterDirector && a.directorId !== filterDirector) return false;
    if (filterTypes.length && !filterTypes.includes(a.type)) return false;
    if (filterStatuses.length && !filterStatuses.includes(a.status)) return false;
    if (filterPriorities.length && !filterPriorities.includes(a.priority)) return false;
    return true;
  });

  const handleExport = () => {
    const rows = filtered.map(a => ({
      Titre: a.title,
      Date: toDateStr(a.date),
      'Heure début': a.startTime,
      'Heure fin': a.endTime,
      Durée: (() => {
        const [sh, sm] = a.startTime.split(':').map(Number);
        const [eh, em] = a.endTime.split(':').map(Number);
        return ((eh * 60 + em - sh * 60 - sm) / 60).toFixed(1) + 'h';
      })(),
      Lieu: a.location || '',
      Type: typeLabels[a.type] || a.type,
      Statut: statusLabels[a.status] || a.status,
      Priorité: priorityLabels[a.priority] || a.priority,
      Directeur: directors.find(d => d.id === a.directorId)?.firstName + ' ' + directors.find(d => d.id === a.directorId)?.lastName || a.directorId,
      Participants: a.participants?.map(p => p.name + (p.isExternal ? ' (ext)' : '')).join(', ') || '',
      Notes: a.notes || '',
    }));

    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Rendez-vous');
    
    ws['!cols'] = [
      { wch: 30 }, { wch: 12 }, { wch: 10 }, { wch: 10 },
      { wch: 8 }, { wch: 25 }, { wch: 15 }, { wch: 12 },
      { wch: 10 }, { wch: 20 }, { wch: 40 }, { wch: 50 },
    ];

    const date = new Date().toISOString().split('T')[0];
    XLSX.writeFile(wb, `agenda-export-${date}.xlsx`);
  };

  const resetFilters = () => {
    setDateFrom('');
    setDateTo('');
    setFilterDirector(currentDirectorId || '');
    setFilterTypes([]);
    setFilterStatuses([]);
    setFilterPriorities([]);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={`bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition min-h-[40px] ${className}`}
      >
        📥 Excel
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4" onClick={() => setIsOpen(false)}>
          <div className="bg-white rounded-t-2xl sm:rounded-2xl w-full max-w-2xl max-h-[92vh] sm:max-h-[90vh] overflow-y-auto shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="p-4 sm:p-6 border-b border-slate-200 flex justify-between items-center sticky top-0 bg-white z-10">
              <h2 className="text-base sm:text-lg font-bold text-slate-800">Exporter en Excel</h2>
              <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-slate-600 text-2xl w-10 h-10 flex items-center justify-center">&times;</button>
            </div>

            <div className="p-4 sm:p-6 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Date début</label>
                  <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none text-slate-800" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Date fin</label>
                  <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none text-slate-800" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Directeur</label>
                <select 
                  value={filterDirector} 
                  onChange={e => setFilterDirector(e.target.value)} 
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none bg-white text-slate-800"
                >
                  <option value="">Tous les directeurs</option>
                  {directors.map(d => (
                    <option key={d.id} value={d.id}>{d.firstName} {d.lastName}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Types</label>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(typeLabels).map(([key, label]) => (
                    <button 
                      key={key} 
                      onClick={() => toggle(key, filterTypes, setFilterTypes)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold border-2 transition ${
                        filterTypes.includes(key) 
                          ? 'bg-blue-900 text-white border-blue-900' 
                          : 'bg-slate-100 text-slate-700 border-slate-200 hover:border-slate-400'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Statuts</label>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(statusLabels).map(([key, label]) => (
                    <button key={key} onClick={() => toggle(key, filterStatuses, setFilterStatuses)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold border-2 transition ${
                        filterStatuses.includes(key) 
                            ? 'bg-blue-900 text-white border-blue-900' 
                            : 'bg-slate-100 text-slate-700 border-slate-200 hover:border-slate-400'
                        }`}>
                        {label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Priorités</label>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(priorityLabels).map(([key, label]) => (
                    <button 
                      key={key} 
                      onClick={() => toggle(key, filterPriorities, setFilterPriorities)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold border-2 transition ${
                        filterPriorities.includes(key) 
                          ? 'bg-blue-900 text-white border-blue-900' 
                          : 'bg-slate-100 text-slate-700 border-slate-200 hover:border-slate-400'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg text-sm text-blue-900 font-medium">
                <strong>{filtered.length}</strong> rendez-vous sélectionné{filtered.length > 1 ? 's' : ''} sur <strong>{appointments.length}</strong> chargé{appointments.length > 1 ? 's' : ''}.
              </div>
            </div>

            <div className="p-4 border-t border-slate-200 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 bg-slate-50 rounded-b-2xl">
              <button onClick={resetFilters} className="w-full sm:w-auto px-4 py-2 text-sm text-slate-500 hover:text-slate-700 font-medium text-left sm:text-center">Réinitialiser</button>
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
                <button onClick={() => setIsOpen(false)} className="w-full sm:w-auto px-4 py-2.5 sm:py-2 border border-slate-300 rounded-lg text-slate-600 hover:bg-white font-medium text-sm min-h-[44px]">Annuler</button>
                <button 
                  onClick={handleExport} 
                  disabled={filtered.length === 0}
                  className="w-full sm:w-auto px-6 py-2.5 sm:py-2 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 text-sm disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px]"
                >
                  Télécharger .xlsx ({filtered.length})
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}