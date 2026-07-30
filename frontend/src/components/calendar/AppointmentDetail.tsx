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
// };

// const priorityLabels: Record<string, string> = {
//   HIGH: 'Haute', NORMAL: 'Normale', LOW: 'Basse',
// };

// export function AppointmentDetail({ appointment, directorName, onClose, onEdit }: Props) {
//   const handlePrint = () => {
//     const status = statusLabels[appointment.status];
//     const participantsHtml = appointment.participants?.length
//       ? appointment.participants.map(p => `
//         <div style="margin-bottom:6px; padding:8px; background:#f8fafc; border-radius:6px;">
//           <strong>${p.name}</strong>
//           ${p.email ? `<span style="color:#64748b; margin-left:8px;">${p.email}</span>` : ''}
//           ${p.isExternal ? `<span style="margin-left:8px; font-size:11px; background:#fef3c7; color:#92400e; padding:2px 8px; border-radius:4px;">Externe</span>` : ''}
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
//             @media print { .no-print { display: none; } }
//           </style>
//         </head>
//         <body>
//           <div class="header">
//             <h1>${appointment.title}</h1>
//             <div class="subtitle">Fiche de rendez-vous — Agenda Direction</div>
//           </div>

//           <div class="grid">
//             <div class="field">
//               <span class="label">Date</span>
//               <div class="value">${formatDisplayDate(toDateStr(appointment.date))}</div>
//             </div>
//             <div class="field">
//               <span class="label">Horaire</span>
//               <div class="value">${appointment.startTime} → ${appointment.endTime} (${getDuration(appointment.startTime, appointment.endTime)}h)</div>
//             </div>
//             <div class="field">
//               <span class="label">Lieu</span>
//               <div class="value">${appointment.location || 'Non précisé'}</div>
//             </div>
//             <div class="field">
//               <span class="label">Directeur</span>
//               <div class="value">${directorName || '—'}</div>
//             </div>
//             <div class="field">
//               <span class="label">Type</span>
//               <div class="value">${typeLabels[appointment.type] || appointment.type}</div>
//             </div>
//             <div class="field">
//               <span class="label">Priorité</span>
//               <div class="value">${priorityLabels[appointment.priority] || appointment.priority}</div>
//             </div>
//           </div>

//           <div class="field">
//             <span class="label">Statut</span>
//             <span class="badge" style="background:${status.bg}; color:${status.color};">${status.text}</span>
//           </div>

//           <div class="field" style="margin-top:24px;">
//             <span class="label">Participants (${appointment.participants?.length || 0})</span>
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
//     setTimeout(() => {
//       printWindow.print();
//       // printWindow.close(); // optionnel
//     }, 300);
//   };

//   const status = statusLabels[appointment.status];

//   return (
//     <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
//       <div
//         className="bg-white rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl"
//         onClick={(e) => e.stopPropagation()}
//       >
//         <div className="p-6 border-b border-slate-200 flex justify-between items-start">
//           <div>
//             <h2 className="text-xl font-bold text-slate-800">{appointment.title}</h2>
//             <p className="text-sm text-slate-500 mt-1">
//               {formatDisplayDate(toDateStr(appointment.date))} · {appointment.startTime} – {appointment.endTime}
//             </p>
//           </div>
//           <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-2xl leading-none">&times;</button>
//         </div>

//         <div className="p-6 space-y-5">
//           <div className="grid grid-cols-2 gap-4">
//             <div>
//               <div className="text-xs font-bold text-slate-400 uppercase tracking-wide">Lieu</div>
//               <div className="text-sm font-medium text-slate-800 mt-0.5">{appointment.location || '—'}</div>
//             </div>
//             <div>
//               <div className="text-xs font-bold text-slate-400 uppercase tracking-wide">Directeur</div>
//               <div className="text-sm font-medium text-slate-800 mt-0.5">{directorName || '—'}</div>
//             </div>
//             <div>
//               <div className="text-xs font-bold text-slate-400 uppercase tracking-wide">Type</div>
//               <div className="text-sm font-medium text-slate-800 mt-0.5">{typeLabels[appointment.type] || appointment.type}</div>
//             </div>
//             <div>
//               <div className="text-xs font-bold text-slate-400 uppercase tracking-wide">Durée</div>
//               <div className="text-sm font-medium text-slate-800 mt-0.5">
//                 {getDuration(appointment.startTime, appointment.endTime)} heure(s)
//               </div>
//             </div>
//           </div>

//           <div className="flex gap-3">
//             <span className="inline-flex px-3 py-1 rounded-full text-xs font-bold" style={{ background: status.bg, color: status.color }}>
//               {status.text}
//             </span>
//             {appointment.priority === 'HIGH' && (
//               <span className="inline-flex px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700">Prioritaire</span>
//             )}
//           </div>

//           <div>
//             <div className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-2">Participants ({appointment.participants?.length || 0})</div>
//             <div className="space-y-2">
//               {appointment.participants?.map((p, i) => (
//                 <div key={i} className="flex items-center justify-between bg-slate-50 px-3 py-2 rounded-lg text-sm">
//                   <span className="font-medium text-slate-700">{p.name}</span>
//                   <div className="flex items-center gap-2">
//                     {p.email && <span className="text-xs text-slate-500">{p.email}</span>}
//                     {p.isExternal && <span className="text-[10px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-bold">Externe</span>}
//                   </div>
//                 </div>
//               ))}
//               {!appointment.participants?.length && <p className="text-sm text-slate-400 italic">Aucun participant.</p>}
//             </div>
//           </div>

//           <div>
//             <div className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-1">Notes / Briefing</div>
//             <div className="bg-slate-50 border-l-4 border-slate-300 p-4 rounded-r-lg text-sm text-slate-700 whitespace-pre-wrap">
//               {appointment.notes || 'Aucune note.'}
//             </div>
//           </div>
//         </div>

//         <div className="p-4 border-t border-slate-200 flex justify-between items-center bg-slate-50 rounded-b-2xl">
//           <button
//             onClick={handlePrint}
//             className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-100 transition"
//           >
//             🖨️ Imprimer (A4)
//           </button>
//           <div className="flex gap-2">
//             <button onClick={onClose} className="px-4 py-2 text-sm text-slate-600 hover:text-slate-800 font-medium">Fermer</button>
//             <button onClick={onEdit} className="px-5 py-2 bg-blue-900 text-white rounded-lg text-sm font-semibold hover:bg-blue-800">Modifier</button>
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
  const handlePrint = () => {
    const status = statusLabels[appointment.status];
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
            .badge { display: inline-block; padding: 4px 12px; border-radius: 6px; font-size: 12px; font-weight: 700; }
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
            <div class="field"><span class="label">Type</span><div class="value">${typeLabels[appointment.type] || appointment.type}</div></div>
            <div class="field"><span class="label">Priorité</span><div class="value">${priorityLabels[appointment.priority] || appointment.priority}</div></div>
          </div>

          <div class="field">
            <span class="label">Statut</span>
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

  const status = statusLabels[appointment.status];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="p-6 border-b border-slate-200 flex justify-between items-start">
          <div>
            <h2 className="text-xl font-bold text-slate-800">{appointment.title}</h2>
            <p className="text-sm text-slate-500 mt-1">
              {formatDisplayDate(toDateStr(appointment.date))} · {appointment.startTime} – {appointment.endTime}
            </p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-2xl leading-none">&times;</button>
        </div>

        <div className="p-6 space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div><div className="text-xs font-bold text-slate-400 uppercase tracking-wide">Lieu</div><div className="text-sm font-medium text-slate-800 mt-0.5">{appointment.location || '—'}</div></div>
            <div><div className="text-xs font-bold text-slate-400 uppercase tracking-wide">Directeur</div><div className="text-sm font-medium text-slate-800 mt-0.5">{directorName || '—'}</div></div>
            <div><div className="text-xs font-bold text-slate-400 uppercase tracking-wide">Type</div><div className="text-sm font-medium text-slate-800 mt-0.5">{typeLabels[appointment.type] || appointment.type}</div></div>
            <div><div className="text-xs font-bold text-slate-400 uppercase tracking-wide">Durée</div><div className="text-sm font-medium text-slate-800 mt-0.5">{getDuration(appointment.startTime, appointment.endTime)} heure(s)</div></div>
          </div>

          <div className="flex gap-3">
            <span className="inline-flex px-3 py-1 rounded-full text-xs font-bold" style={{ background: status.bg, color: status.color }}>{status.text}</span>
            {appointment.priority === 'HIGH' && <span className="inline-flex px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700">Prioritaire</span>}
          </div>

          <div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-2">Participants ({appointment.participants?.length || 0})</div>
            <div className="space-y-2">
              {appointment.participants?.map((p, i) => (
                <div key={i} className="flex items-center justify-between bg-slate-50 px-3 py-2 rounded-lg text-sm">
                  <div>
                    <span className="font-medium text-slate-700">{p.name}</span>
                    {p.email && <div className="text-xs text-slate-500">{p.email}</div>}
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${p.isExternal ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'}`}>
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

        <div className="p-4 border-t border-slate-200 flex justify-between items-center bg-slate-50 rounded-b-2xl">
          <button onClick={handlePrint} className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-100 transition">🖨️ Imprimer (A4)</button>
          <div className="flex gap-2">
            <button onClick={onClose} className="px-4 py-2 text-sm text-slate-600 hover:text-slate-800 font-medium">Fermer</button>
            <button onClick={onEdit} className="px-5 py-2 bg-blue-900 text-white rounded-lg text-sm font-semibold hover:bg-blue-800">Modifier</button>
          </div>
        </div>
      </div>
    </div>
  );
}