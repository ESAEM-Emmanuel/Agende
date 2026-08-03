// 'use client';

// import { Fragment } from 'react';
// import { Appointment } from '@/types';
// import { toDateStr } from '@/lib/date';

// interface Props {
//   date: Date;
//   appointments: Appointment[];
//   onEdit: (appt: Appointment) => void;
// }

// const typeColors: Record<string, { bg: string; border: string; text: string }> = {
//   REUNION: { bg: 'bg-blue-50', border: 'border-blue-500', text: 'text-blue-800' },
//   DEJEUNER: { bg: 'bg-amber-50', border: 'border-amber-500', text: 'text-amber-800' },
//   VISITE: { bg: 'bg-emerald-50', border: 'border-emerald-500', text: 'text-emerald-800' },
//   VISIO: { bg: 'bg-violet-50', border: 'border-violet-500', text: 'text-violet-800' },
//   PERSO: { bg: 'bg-gray-50', border: 'border-gray-400', text: 'text-gray-700' },
//   AUTRE: { bg: 'bg-pink-50', border: 'border-pink-500', text: 'text-pink-800' },
// };

// const statusOpacity: Record<string, string> = {
//   CANCELLED: 'opacity-40 line-through',
//   DONE: 'opacity-70',
// };

// const dayNames = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
// const dayNamesFull = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];

// function getWeekDays(date: Date) {
//   const startOfWeek = new Date(date);
//   const day = startOfWeek.getDay();
//   const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1);
//   startOfWeek.setDate(diff);
//   return Array.from({ length: 7 }, (_, i) => {
//     const d = new Date(startOfWeek);
//     d.setDate(startOfWeek.getDate() + i);
//     return d;
//   });
// }

// export function CalendarWeek({ date, appointments, onEdit }: Props) {
//   const weekDays = getWeekDays(date);
//   const hours = Array.from({ length: 11 }, (_, i) => i + 8);
//   const todayStr = toDateStr(new Date());

//   return (
//     <>
//       {/* Mobile : liste groupée par jour */}
//       <div className="md:hidden space-y-4">
//         {weekDays.map((d, i) => {
//           const dateStr = toDateStr(d);
//           const isToday = dateStr === todayStr;
//           const dayAppts = appointments
//             .filter(a => toDateStr(a.date) === dateStr && a.status !== 'CANCELLED')
//             .sort((a, b) => a.startTime.localeCompare(b.startTime));

//           return (
//             <div key={dateStr}>
//               <div className={`flex items-center gap-2 mb-2 px-2 py-1.5 rounded-lg ${isToday ? 'bg-blue-900 text-white' : 'bg-slate-100 text-slate-700'}`}>
//                 <span className="text-xs font-bold uppercase">{dayNamesFull[i]}</span>
//                 <span className="text-sm font-semibold">{d.getDate()}/{d.getMonth() + 1}</span>
//                 {dayAppts.length > 0 && (
//                   <span className={`ml-auto text-xs font-bold px-2 py-0.5 rounded-full ${isToday ? 'bg-white/20' : 'bg-white text-slate-600'}`}>
//                     {dayAppts.length}
//                   </span>
//                 )}
//               </div>
//               {dayAppts.length === 0 ? (
//                 <p className="text-xs text-slate-400 px-2 py-1">Aucun RDV</p>
//               ) : (
//                 <div className="space-y-1.5">
//                   {dayAppts.map(appt => {
//                     const colors = typeColors[appt.type] || typeColors.AUTRE;
//                     const opacity = statusOpacity[appt.status] || '';
//                     return (
//                       <button
//                         key={appt.id}
//                         onClick={() => onEdit(appt)}
//                         className={`w-full text-left ${colors.bg} border-l-4 ${colors.border} rounded-lg px-3 py-2 active:scale-[0.99] transition-transform ${opacity}`}
//                       >
//                         <span className={`text-xs font-bold ${colors.text}`}>{appt.startTime} – {appt.endTime}</span>
//                         <span className="text-sm font-semibold text-slate-800 ml-2">{appt.title}</span>
//                       </button>
//                     );
//                   })}
//                 </div>
//               )}
//             </div>
//           );
//         })}
//       </div>

//       {/* Desktop : grille horaire */}
//       <div className="hidden md:block border border-slate-200 rounded-xl overflow-x-auto scrollbar-thin">
//         <div className="min-w-[700px]">
//           <div className="grid grid-cols-[52px_repeat(7,1fr)] lg:grid-cols-[60px_repeat(7,1fr)] bg-slate-50 border-b border-slate-200">
//             <div className="p-2 lg:p-3 text-xs font-bold text-slate-400 text-center">Heure</div>
//             {weekDays.map((d, i) => {
//               const isToday = toDateStr(d) === todayStr;
//               return (
//                 <div key={`header-${i}`} className={`p-2 lg:p-3 text-center text-sm font-semibold ${isToday ? 'bg-blue-900 text-white' : 'text-slate-700'}`}>
//                   <div className="text-xs opacity-80">{dayNames[i]}</div>
//                   <div>{d.getDate()}</div>
//                 </div>
//               );
//             })}
//           </div>
//           <div className="grid grid-cols-[52px_repeat(7,1fr)] lg:grid-cols-[60px_repeat(7,1fr)]">
//             {hours.map(h => (
//               <Fragment key={`row-${h}`}>
//                 <div className="h-14 lg:h-16 border-b border-slate-100 text-right pr-2 lg:pr-3 pt-2 text-xs text-slate-400 font-medium">{h}h</div>
//                 {weekDays.map((d, i) => {
//                   const dateStr = toDateStr(d);
//                   const cellAppts = appointments.filter(a => {
//                     if (toDateStr(a.date) !== dateStr || a.status === 'CANCELLED') return false;
//                     const startH = parseInt(a.startTime.split(':')[0]);
//                     const endH = parseInt(a.endTime.split(':')[0]);
//                     const endM = parseInt(a.endTime.split(':')[1]);
//                     const realEndH = endM > 0 ? endH : endH - 1;
//                     return startH <= h && h <= realEndH;
//                   });

//                   return (
//                     <div key={`cell-${h}-${i}`} className="h-14 lg:h-16 border-b border-l border-slate-100 p-0.5 lg:p-1 space-y-0.5 lg:space-y-1">
//                       {cellAppts.map(appt => {
//                         const colors = typeColors[appt.type] || typeColors.AUTRE;
//                         const opacity = statusOpacity[appt.status] || '';
//                         return (
//                           <div
//                             key={appt.id}
//                             onClick={() => onEdit(appt)}
//                             className={`${colors.bg} border-l-2 ${colors.border} rounded px-1 lg:px-2 py-0.5 text-[9px] lg:text-[10px] font-bold ${colors.text} cursor-pointer truncate hover:opacity-80 ${opacity}`}
//                             title={`${appt.title} (${appt.startTime}-${appt.endTime})`}
//                           >
//                             {appt.startTime} {appt.title}
//                           </div>
//                         );
//                       })}
//                     </div>
//                   );
//                 })}
//               </Fragment>
//             ))}
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }

'use client';

import { Fragment } from 'react';
import { Appointment } from '@/types';
import { toDateStr } from '@/lib/date';

interface Props {
  date: Date;
  appointments: Appointment[];
  onEdit: (appt: Appointment) => void;
  onSelectDay: (date: Date) => void; // 👈 nouveau
}

const typeColors: Record<string, { bg: string; border: string; text: string }> = {
  REUNION: { bg: 'bg-blue-50', border: 'border-blue-500', text: 'text-blue-800' },
  DEJEUNER: { bg: 'bg-amber-50', border: 'border-amber-500', text: 'text-amber-800' },
  VISITE: { bg: 'bg-emerald-50', border: 'border-emerald-500', text: 'text-emerald-800' },
  VISIO: { bg: 'bg-violet-50', border: 'border-violet-500', text: 'text-violet-800' },
  PERSO: { bg: 'bg-gray-50', border: 'border-gray-400', text: 'text-gray-700' },
  AUTRE: { bg: 'bg-pink-50', border: 'border-pink-500', text: 'text-pink-800' },
};

const statusOpacity: Record<string, string> = {
  CANCELLED: 'opacity-40 line-through',
  DONE: 'opacity-70',
};

const dayNames = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
const dayNamesFull = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];

function getWeekDays(date: Date) {
  const startOfWeek = new Date(date);
  const day = startOfWeek.getDay();
  const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1);
  startOfWeek.setDate(diff);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(startOfWeek);
    d.setDate(startOfWeek.getDate() + i);
    return d;
  });
}

export function CalendarWeek({ date, appointments, onEdit, onSelectDay }: Props) {
  const weekDays = getWeekDays(date);
  const hours = Array.from({ length: 11 }, (_, i) => i + 8);
  const todayStr = toDateStr(new Date());

  return (
    <>
      {/* Mobile : liste groupée par jour */}
      <div className="md:hidden space-y-4">
        {weekDays.map((d, i) => {
          const dateStr = toDateStr(d);
          const isToday = dateStr === todayStr;
          const dayAppts = appointments
            .filter(a => toDateStr(a.date) === dateStr && a.status !== 'CANCELLED')
            .sort((a, b) => a.startTime.localeCompare(b.startTime));

          return (
            <div key={dateStr}>
              <button
                onClick={() => onSelectDay(d)}
                className={`w-full flex items-center gap-2 mb-2 px-2 py-1.5 rounded-lg active:scale-[0.99] transition ${isToday ? 'bg-blue-900 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
              >
                <span className="text-xs font-bold uppercase">{dayNamesFull[i]}</span>
                <span className="text-sm font-semibold">{d.getDate()}/{d.getMonth() + 1}</span>
                {dayAppts.length > 0 && (
                  <span className={`ml-auto text-xs font-bold px-2 py-0.5 rounded-full ${isToday ? 'bg-white/20' : 'bg-white text-slate-600'}`}>
                    {dayAppts.length}
                  </span>
                )}
              </button>
              {dayAppts.length === 0 ? (
                <p className="text-xs text-slate-400 px-2 py-1">Aucun RDV</p>
              ) : (
                <div className="space-y-1.5">
                  {dayAppts.map(appt => {
                    const colors = typeColors[appt.type] || typeColors.AUTRE;
                    const opacity = statusOpacity[appt.status] || '';
                    return (
                      <button
                        key={appt.id}
                        onClick={() => onEdit(appt)}
                        className={`w-full text-left ${colors.bg} border-l-4 ${colors.border} rounded-lg px-3 py-2 active:scale-[0.99] transition-transform ${opacity}`}
                      >
                        <span className={`text-xs font-bold ${colors.text}`}>{appt.startTime} – {appt.endTime}</span>
                        <span className="text-sm font-semibold text-slate-800 ml-2">{appt.title}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Desktop : grille horaire */}
      <div className="hidden md:block border border-slate-200 rounded-xl overflow-x-auto scrollbar-thin">
        <div className="min-w-[700px]">
          <div className="grid grid-cols-[52px_repeat(7,1fr)] lg:grid-cols-[60px_repeat(7,1fr)] bg-slate-50 border-b border-slate-200">
            <div className="p-2 lg:p-3 text-xs font-bold text-slate-400 text-center">Heure</div>
            {weekDays.map((d, i) => {
              const isToday = toDateStr(d) === todayStr;
              return (
                <button
                  key={`header-${i}`}
                  onClick={() => onSelectDay(d)}
                  className={`p-2 lg:p-3 text-center text-sm font-semibold transition hover:opacity-90 ${isToday ? 'bg-blue-900 text-white' : 'text-slate-700 hover:bg-slate-100'}`}
                >
                  <div className="text-xs opacity-80">{dayNames[i]}</div>
                  <div>{d.getDate()}</div>
                </button>
              );
            })}
          </div>
          <div className="grid grid-cols-[52px_repeat(7,1fr)] lg:grid-cols-[60px_repeat(7,1fr)]">
            {hours.map(h => (
              <Fragment key={`row-${h}`}>
                <div className="h-14 lg:h-16 border-b border-slate-100 text-right pr-2 lg:pr-3 pt-2 text-xs text-slate-400 font-medium">{h}h</div>
                {weekDays.map((d, i) => {
                  const dateStr = toDateStr(d);
                  const cellAppts = appointments.filter(a => {
                    if (toDateStr(a.date) !== dateStr || a.status === 'CANCELLED') return false;
                    const startH = parseInt(a.startTime.split(':')[0]);
                    const endH = parseInt(a.endTime.split(':')[0]);
                    const endM = parseInt(a.endTime.split(':')[1]);
                    const realEndH = endM > 0 ? endH : endH - 1;
                    return startH <= h && h <= realEndH;
                  });

                  return (
                    <div key={`cell-${h}-${i}`} className="h-14 lg:h-16 border-b border-l border-slate-100 p-0.5 lg:p-1 space-y-0.5 lg:space-y-1">
                      {cellAppts.map(appt => {
                        const colors = typeColors[appt.type] || typeColors.AUTRE;
                        const opacity = statusOpacity[appt.status] || '';
                        return (
                          <div
                            key={appt.id}
                            onClick={() => onEdit(appt)}
                            className={`${colors.bg} border-l-2 ${colors.border} rounded px-1 lg:px-2 py-0.5 text-[9px] lg:text-[10px] font-bold ${colors.text} cursor-pointer truncate hover:opacity-80 ${opacity}`}
                            title={`${appt.title} (${appt.startTime}-${appt.endTime})`}
                          >
                            {appt.startTime} {appt.title}
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </Fragment>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}