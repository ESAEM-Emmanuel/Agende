// 'use client';

// import { Appointment } from '@/types';
// import { toDateStr, formatDisplayDate, getDuration } from '@/lib/date';

// interface Props {
//   appointment: Appointment;
//   directorName?: string;
//   onClose: () => void;
//   onEdit: () => void;
// }

// const typeLabels: Record<string, string> = {
//   REUNION: 'Réunion', DEJEUNER: 'Déjeuner d\'affaires',
//   VISITE: 'Visite / Déplacement', VISIO: 'Visioconférence',
//   PERSO: 'Personnel / Bloqué', AUTRE: 'Autre',
// };

// const statusLabels: Record<string, { text: string; bg: string; color: string }> = {
//   CONFIRMED: { text: 'Confirmé', bg: '#d1fae5', color: '#065f46' },
//   PENDING: { text: 'En attente', bg: '#fef3c7', color: '#92400e' },
//   CANCELLED: { text: 'Annulé', bg: '#fee2e2', color: '#991b1b' },
//   DONE: { text: 'Terminé', bg: '#dbeafe', color: '#1e40af' },
// };

// const priorityLabels: Record<string, string> = {
//   HIGH: 'Haute', NORMAL: 'Normale', LOW: 'Basse',
// };

// export function AppointmentDetail({ appointment, directorName, onClose, onEdit }: Props) {
//   const handlePrint = () => {
//     const status = statusLabels[appointment.status];
//     const participantsHtml = appointment.participants?.length
//       ? appointment.participants.map(p => `
//         <div style="margin-bottom:6px; padding:8px; background:#f8fafc; border-radius:6px; display:flex; justify-content:space-between; align-items:center;">
//           <div>
//             <strong>${p.name}</strong>
//             ${p.email ? `<div style="color:#64748b; font-size:12px;">${p.email}</div>` : ''}
//           </div>
//           ${p.isExternal ? '<span style="font-size:11px; background:#fef3c7; color:#92400e; padding:4px 10px; border-radius:4px; font-weight:600;">Externe</span>' : '<span style="font-size:11px; background:#dbeafe; color:#1e40af; padding:4px 10px; border-radius:4px; font-weight:600;">Interne</span>'}
//         </div>
//       `).join('')
//       : '<p style="color:#94a3b8;">Aucun participant enregistré.</p>';

//     const printWindow = window.open('', '_blank');
//     if (!printWindow) return;

//     printWindow.document.write(`
//       <!DOCTYPE html>
//       <html>
//         <head>
//           <title>Fiche RDV — ${appointment.title}</title>
//           <style>
//             @page { size: A4; margin: 2cm; }
//             body { font-family: 'Segoe UI', Arial, sans-serif; color: #1e293b; line-height: 1.5; }
//             .header { border-bottom: 3px solid #1e3a5f; padding-bottom: 16px; margin-bottom: 24px; }
//             .header h1 { margin: 0; font-size: 24px; color: #1e3a5f; }
//             .header .subtitle { margin: 4px 0 0; color: #64748b; font-size: 14px; }
//             .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px 32px; margin-bottom: 24px; }
//             .field { margin-bottom: 16px; }
//             .label { font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px; display: block; }
//             .value { font-size: 14px; color: #1e293b; }
//             .badge { display: inline-block; padding: 4px 12px; border-radius: 6px; font-size: 12px; font-weight: 700; }
//             .notes { background: #f8fafc; border-left: 4px solid #cbd5e1; padding: 16px; border-radius: 8px; margin-top: 8px; white-space: pre-wrap; }
//             .footer { margin-top: 40px; padding-top: 16px; border-top: 1px solid #e2e8f0; font-size: 11px; color: #94a3b8; text-align: center; }
//             .participants { margin-top: 24px; }
//             @media print { .no-print { display: none; } }
//           </style>
//         </head>
//         <body>
//           <div class="header">
//             <h1>${appointment.title}</h1>
//             <div class="subtitle">Fiche de rendez-vous — Agenda Direction</div>
//           </div>

//           <div class="grid">
//             <div class="field"><span class="label">Date</span><div class="value">${formatDisplayDate(toDateStr(appointment.date))}</div></div>
//             <div class="field"><span class="label">Horaire</span><div class="value">${appointment.startTime} → ${appointment.endTime} (${getDuration(appointment.startTime, appointment.endTime)}h)</div></div>
//             <div class="field"><span class="label">Lieu</span><div class="value">${appointment.location || 'Non précisé'}</div></div>
//             <div class="field"><span class="label">Directeur</span><div class="value">${directorName || '—'}</div></div>
//             <div class="field"><span class="label">Type</span><div class="value">${typeLabels[appointment.type] || appointment.type}</div></div>
//             <div class="field"><span class="label">Priorité</span><div class="value">${priorityLabels[appointment.priority] || appointment.priority}</div></div>
//           </div>

//           <div class="field">
//             <span class="label">Statut</span>
//             <span class="badge" style="background:${status.bg}; color:${status.color};">${status.text}</span>
//           </div>

//           <div class="participants">
//             <div class="label">Participants (${appointment.participants?.length || 0})</div>
//             ${participantsHtml}
//           </div>

//           <div class="field" style="margin-top:24px;">
//             <span class="label">Notes / Briefing</span>
//             <div class="notes">${appointment.notes || 'Aucune note.'}</div>
//           </div>

//           <div class="footer">
//             Document généré le ${new Date().toLocaleString('fr-FR')} — Agenda Assistant de Direction
//           </div>
//         </body>
//       </html>
//     `);
//     printWindow.document.close();
//     printWindow.focus();
//     setTimeout(() => printWindow.print(), 300);
//   };

//   const status = statusLabels[appointment.status];

//   return (
//     <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4" onClick={onClose}>
//       <div className="bg-white rounded-t-2xl sm:rounded-2xl w-full max-w-xl max-h-[92vh] sm:max-h-[90vh] overflow-y-auto shadow-2xl" onClick={e => e.stopPropagation()}>
//         <div className="p-4 sm:p-6 border-b border-slate-200 flex justify-between items-start sticky top-0 bg-white z-10">
//           <div className="min-w-0 pr-4">
//             <h2 className="text-lg sm:text-xl font-bold text-slate-800 break-words">{appointment.title}</h2>
//             <p className="text-xs sm:text-sm text-slate-500 mt-1">
//               {formatDisplayDate(toDateStr(appointment.date))} · {appointment.startTime} – {appointment.endTime}
//             </p>
//           </div>
//           <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-2xl leading-none flex-shrink-0 w-10 h-10 flex items-center justify-center">&times;</button>
//         </div>

//         <div className="p-4 sm:p-6 space-y-5">
//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//             <div><div className="text-xs font-bold text-slate-400 uppercase tracking-wide">Lieu</div><div className="text-sm font-medium text-slate-800 mt-0.5">{appointment.location || '—'}</div></div>
//             <div><div className="text-xs font-bold text-slate-400 uppercase tracking-wide">Directeur</div><div className="text-sm font-medium text-slate-800 mt-0.5">{directorName || '—'}</div></div>
//             <div><div className="text-xs font-bold text-slate-400 uppercase tracking-wide">Type</div><div className="text-sm font-medium text-slate-800 mt-0.5">{typeLabels[appointment.type] || appointment.type}</div></div>
//             <div><div className="text-xs font-bold text-slate-400 uppercase tracking-wide">Durée</div><div className="text-sm font-medium text-slate-800 mt-0.5">{getDuration(appointment.startTime, appointment.endTime)} heure(s)</div></div>
//           </div>

//           <div className="flex gap-3">
//             <span className="inline-flex px-3 py-1 rounded-full text-xs font-bold" style={{ background: status.bg, color: status.color }}>{status.text}</span>
//             {appointment.priority === 'HIGH' && <span className="inline-flex px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700">Prioritaire</span>}
//           </div>

//           <div>
//             <div className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-2">Participants ({appointment.participants?.length || 0})</div>
//             <div className="space-y-2">
//               {appointment.participants?.map((p, i) => (
//                 <div key={i} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-2 bg-slate-50 px-3 py-2 rounded-lg text-sm">
//                   <div className="min-w-0">
//                     <span className="font-medium text-slate-700">{p.name}</span>
//                     {p.email && <div className="text-xs text-slate-500 truncate">{p.email}</div>}
//                   </div>
//                   <span className={`self-start sm:self-auto text-[10px] px-2 py-0.5 rounded-full font-bold ${p.isExternal ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'}`}>
//                     {p.isExternal ? 'Externe' : 'Interne'}
//                   </span>
//                 </div>
//               ))}
//               {!appointment.participants?.length && <p className="text-sm text-slate-400 italic">Aucun participant.</p>}
//             </div>
//           </div>

//           <div>
//             <div className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-1">Notes / Briefing</div>
//             <div className="bg-slate-50 border-l-4 border-slate-300 p-4 rounded-r-lg text-sm text-slate-700 whitespace-pre-wrap">{appointment.notes || 'Aucune note.'}</div>
//           </div>
//         </div>

//         <div className="p-4 border-t border-slate-200 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 bg-slate-50 rounded-b-2xl">
//           <button onClick={handlePrint} className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 sm:py-2 bg-white border border-slate-300 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-100 transition min-h-[44px]">🖨️ Imprimer (A4)</button>
//           <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
//             <button onClick={onClose} className="w-full sm:w-auto px-4 py-2.5 sm:py-2 text-sm text-slate-600 hover:text-slate-800 font-medium min-h-[44px]">Fermer</button>
//             <button onClick={onEdit} className="w-full sm:w-auto px-5 py-2.5 sm:py-2 bg-blue-900 text-white rounded-lg text-sm font-semibold hover:bg-blue-800 min-h-[44px]">Modifier</button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
'use client';

import { Appointment } from '@/types';
import { toDateStr, formatDisplayDate, getDuration } from '@/lib/date';

interface Props {
  appointment: Appointment;
  directorName?: string;
  onClose: () => void;
  onEdit: () => void;
}

const typeLabels: Record<string, string> = {
  REUNION: 'Réunion', DEJEUNER: 'Déjeuner d\'affaires',
  VISITE: 'Visite / Déplacement', VISIO: 'Visioconférence',
  PERSO: 'Personnel / Bloqué', AUTRE: 'Autre',
};

// 👇 Nouveau : palette cohérente avec CalendarDay / CalendarWeek / CalendarMonth
const typeColors: Record<string, { bg: string; text: string; border: string; hex: string; hexText: string }> = {
  REUNION: { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-300', hex: '#dbeafe', hexText: '#1e40af' },
  DEJEUNER: { bg: 'bg-amber-100', text: 'text-amber-800', border: 'border-amber-300', hex: '#fef3c7', hexText: '#92400e' },
  VISITE: { bg: 'bg-emerald-100', text: 'text-emerald-800', border: 'border-emerald-300', hex: '#d1fae5', hexText: '#065f46' },
  VISIO: { bg: 'bg-violet-100', text: 'text-violet-800', border: 'border-violet-300', hex: '#ede9fe', hexText: '#5b21b6' },
  PERSO: { bg: 'bg-gray-100', text: 'text-gray-700', border: 'border-gray-300', hex: '#f3f4f6', hexText: '#374151' },
  AUTRE: { bg: 'bg-pink-100', text: 'text-pink-800', border: 'border-pink-300', hex: '#fce7f3', hexText: '#9d174d' },
};

const statusLabels: Record<string, { text: string; bg: string; color: string }> = {
  CONFIRMED: { text: 'Confirmé', bg: '#d1fae5', color: '#065f46' },
  PENDING: { text: 'En attente', bg: '#fef3c7', color: '#92400e' },
  CANCELLED: { text: 'Annulé', bg: '#fee2e2', color: '#991b1b' },
  DONE: { text: 'Terminé', bg: '#dbeafe', color: '#1e40af' },
};

const priorityLabels: Record<string, string> = {
  HIGH: 'Haute', NORMAL: 'Normale', LOW: 'Basse',
};

export function AppointmentDetail({ appointment, directorName, onClose, onEdit }: Props) {
  const status = statusLabels[appointment.status];
  const typeStyle = typeColors[appointment.type] || typeColors.AUTRE;

  const handlePrint = () => {
    const participantsHtml = appointment.participants?.length
      ? appointment.participants.map(p => `
        <div style="margin-bottom:6px; padding:8px; background:#f8fafc; border-radius:6px; display:flex; justify-content:space-between; align-items:center;">
          <div>
            <strong>${p.name}</strong>
            ${p.email ? `<div style="color:#64748b; font-size:12px;">${p.email}</div>` : ''}
          </div>
          ${p.isExternal ? '<span style="font-size:11px; background:#fef3c7; color:#92400e; padding:4px 10px; border-radius:4px; font-weight:600;">Externe</span>' : '<span style="font-size:11px; background:#dbeafe; color:#1e40af; padding:4px 10px; border-radius:4px; font-weight:600;">Interne</span>'}
        </div>
      `).join('')
      : '<p style="color:#94a3b8;">Aucun participant enregistré.</p>';

    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Fiche RDV — ${appointment.title}</title>
          <style>
            @page { size: A4; margin: 2cm; }
            body { font-family: 'Segoe UI', Arial, sans-serif; color: #1e293b; line-height: 1.5; }
            .header { border-bottom: 3px solid #1e3a5f; padding-bottom: 16px; margin-bottom: 24px; }
            .header h1 { margin: 0; font-size: 24px; color: #1e3a5f; }
            .header .subtitle { margin: 4px 0 0; color: #64748b; font-size: 14px; }
            .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px 32px; margin-bottom: 24px; }
            .field { margin-bottom: 16px; }
            .label { font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px; display: block; }
            .value { font-size: 14px; color: #1e293b; }
            .badge { display: inline-block; padding: 4px 12px; border-radius: 6px; font-size: 12px; font-weight: 700; margin-right: 8px; }
            .notes { background: #f8fafc; border-left: 4px solid #cbd5e1; padding: 16px; border-radius: 8px; margin-top: 8px; white-space: pre-wrap; }
            .footer { margin-top: 40px; padding-top: 16px; border-top: 1px solid #e2e8f0; font-size: 11px; color: #94a3b8; text-align: center; }
            .participants { margin-top: 24px; }
            @media print { .no-print { display: none; } }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>${appointment.title}</h1>
            <div class="subtitle">Fiche de rendez-vous — Agenda Direction</div>
          </div>

          <div class="grid">
            <div class="field"><span class="label">Date</span><div class="value">${formatDisplayDate(toDateStr(appointment.date))}</div></div>
            <div class="field"><span class="label">Horaire</span><div class="value">${appointment.startTime} → ${appointment.endTime} (${getDuration(appointment.startTime, appointment.endTime)}h)</div></div>
            <div class="field"><span class="label">Lieu</span><div class="value">${appointment.location || 'Non précisé'}</div></div>
            <div class="field"><span class="label">Directeur</span><div class="value">${directorName || '—'}</div></div>
            <div class="field"><span class="label">Priorité</span><div class="value">${priorityLabels[appointment.priority] || appointment.priority}</div></div>
          </div>

          <div class="field">
            <span class="badge" style="background:${typeStyle.hex}; color:${typeStyle.hexText};">${typeLabels[appointment.type] || appointment.type}</span>
            <span class="badge" style="background:${status.bg}; color:${status.color};">${status.text}</span>
          </div>

          <div class="participants">
            <div class="label">Participants (${appointment.participants?.length || 0})</div>
            ${participantsHtml}
          </div>

          <div class="field" style="margin-top:24px;">
            <span class="label">Notes / Briefing</span>
            <div class="notes">${appointment.notes || 'Aucune note.'}</div>
          </div>

          <div class="footer">
            Document généré le ${new Date().toLocaleString('fr-FR')} — Agenda Assistant de Direction
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => printWindow.print(), 300);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4" onClick={onClose}>
      <div className="bg-white rounded-t-2xl sm:rounded-2xl w-full max-w-xl max-h-[92vh] sm:max-h-[90vh] overflow-y-auto shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="p-4 sm:p-6 border-b border-slate-200 flex justify-between items-start sticky top-0 bg-white z-10">
          <div className="min-w-0 pr-4">
            <h2 className="text-lg sm:text-xl font-bold text-slate-800 break-words">{appointment.title}</h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              {formatDisplayDate(toDateStr(appointment.date))} · {appointment.startTime} – {appointment.endTime}
            </p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-2xl leading-none flex-shrink-0 w-10 h-10 flex items-center justify-center">&times;</button>
        </div>

        <div className="p-4 sm:p-6 space-y-5">
          {/* 👇 Badges Type + Statut + Priorité mis en avant juste sous l'en-tête */}
          <div className="flex flex-wrap gap-2">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border ${typeStyle.bg} ${typeStyle.text} ${typeStyle.border}`}>
              {typeLabels[appointment.type] || appointment.type}
            </span>
            <span className="inline-flex px-3 py-1.5 rounded-full text-xs font-bold" style={{ background: status.bg, color: status.color }}>
              {status.text}
            </span>
            {appointment.priority === 'HIGH' && (
              <span className="inline-flex px-3 py-1.5 rounded-full text-xs font-bold bg-red-100 text-red-700">
                ⚡ Prioritaire
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div><div className="text-xs font-bold text-slate-400 uppercase tracking-wide">Lieu</div><div className="text-sm font-medium text-slate-800 mt-0.5">{appointment.location || '—'}</div></div>
            <div><div className="text-xs font-bold text-slate-400 uppercase tracking-wide">Directeur</div><div className="text-sm font-medium text-slate-800 mt-0.5">{directorName || '—'}</div></div>
            <div><div className="text-xs font-bold text-slate-400 uppercase tracking-wide">Durée</div><div className="text-sm font-medium text-slate-800 mt-0.5">{getDuration(appointment.startTime, appointment.endTime)} heure(s)</div></div>
            <div><div className="text-xs font-bold text-slate-400 uppercase tracking-wide">Priorité</div><div className="text-sm font-medium text-slate-800 mt-0.5">{priorityLabels[appointment.priority] || appointment.priority}</div></div>
          </div>

          <div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-2">Participants ({appointment.participants?.length || 0})</div>
            <div className="space-y-2">
              {appointment.participants?.map((p, i) => (
                <div key={i} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-2 bg-slate-50 px-3 py-2 rounded-lg text-sm">
                  <div className="min-w-0">
                    <span className="font-medium text-slate-700">{p.name}</span>
                    {p.email && <div className="text-xs text-slate-500 truncate">{p.email}</div>}
                  </div>
                  <span className={`self-start sm:self-auto text-[10px] px-2 py-0.5 rounded-full font-bold ${p.isExternal ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'}`}>
                    {p.isExternal ? 'Externe' : 'Interne'}
                  </span>
                </div>
              ))}
              {!appointment.participants?.length && <p className="text-sm text-slate-400 italic">Aucun participant.</p>}
            </div>
          </div>

          <div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-1">Notes / Briefing</div>
            <div className="bg-slate-50 border-l-4 border-slate-300 p-4 rounded-r-lg text-sm text-slate-700 whitespace-pre-wrap">{appointment.notes || 'Aucune note.'}</div>
          </div>
        </div>

        <div className="p-4 border-t border-slate-200 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 bg-slate-50 rounded-b-2xl">
          <button onClick={handlePrint} className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 sm:py-2 bg-white border border-slate-300 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-100 transition min-h-[44px]">🖨️ Imprimer (A4)</button>
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <button onClick={onClose} className="w-full sm:w-auto px-4 py-2.5 sm:py-2 text-sm text-slate-600 hover:text-slate-800 font-medium min-h-[44px]">Fermer</button>
            <button onClick={onEdit} className="w-full sm:w-auto px-5 py-2.5 sm:py-2 bg-blue-900 text-white rounded-lg text-sm font-semibold hover:bg-blue-800 min-h-[44px]">Modifier</button>
          </div>
        </div>
      </div>
    </div>
  );
}