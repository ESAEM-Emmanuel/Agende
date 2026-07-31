'use client';

import { Appointment } from '@/types';
import { toDateStr, formatDisplayDate } from '@/lib/date';

interface Props {
  date: Date;
  appointments: Appointment[];
  onEdit: (appt: Appointment) => void;
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

function AppointmentBadges({ appt }: { appt: Appointment }) {
  return (
    <div className="flex flex-wrap gap-1 mt-1">
      {appt.status === 'PENDING' && (
        <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-[10px] rounded font-bold">En attente</span>
      )}
      {appt.status === 'DONE' && (
        <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-[10px] rounded font-bold">✓ Terminé</span>
      )}
      {appt.priority === 'HIGH' && appt.status !== 'DONE' && (
        <span className="px-2 py-0.5 bg-red-100 text-red-700 text-[10px] rounded font-bold">Prioritaire</span>
      )}
    </div>
  );
}

export function CalendarDay({ date, appointments, onEdit }: Props) {
  const dateStr = toDateStr(date);
  const dayAppts = appointments
    .filter(a => toDateStr(a.date) === dateStr && a.status !== 'CANCELLED')
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  return (
    <>
      {/* Mobile : liste de cartes */}
      <div className="sm:hidden space-y-2">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-3">
          {formatDisplayDate(dateStr)}
        </p>
        {dayAppts.length === 0 ? (
          <p className="text-sm text-slate-400 text-center py-8">Aucun rendez-vous ce jour.</p>
        ) : (
          dayAppts.map(appt => {
            const colors = typeColors[appt.type] || typeColors.AUTRE;
            const opacity = statusOpacity[appt.status] || '';
            return (
              <button
                key={appt.id}
                onClick={() => onEdit(appt)}
                className={`w-full text-left ${colors.bg} border-l-4 ${colors.border} rounded-lg p-3 active:scale-[0.99] transition-transform shadow-sm ${opacity}`}
              >
                <div className={`text-xs font-bold ${colors.text}`}>{appt.startTime} – {appt.endTime}</div>
                <div className="text-sm font-semibold text-slate-800 mt-0.5">{appt.title}</div>
                {appt.location && <div className="text-xs text-slate-500 mt-1">📍 {appt.location}</div>}
                <AppointmentBadges appt={appt} />
              </button>
            );
          })
        )}
      </div>

      {/* Desktop : timeline */}
      <div className="hidden sm:flex gap-3 md:gap-4 overflow-x-auto scrollbar-thin">
        <div className="w-12 md:w-16 flex-shrink-0">
          {Array.from({ length: 14 }, (_, i) => i + 7).map(h => (
            <div key={h} className="h-14 md:h-16 border-b border-slate-100 text-right pr-2 pt-1 text-xs text-slate-400">{h}h</div>
          ))}
        </div>
        <div className="flex-1 relative min-w-0">
          {Array.from({ length: 14 }, (_, i) => i + 7).map(h => (
            <div key={h} className="h-14 md:h-16 border-b border-slate-100" />
          ))}
          {dayAppts.map(appt => {
            const startH = parseInt(appt.startTime.split(':')[0]);
            const startM = parseInt(appt.startTime.split(':')[1]);
            const endH = parseInt(appt.endTime.split(':')[0]);
            const endM = parseInt(appt.endTime.split(':')[1]);
            const rowH = 56;
            const top = (startH - 7) * rowH + (startM / 60) * rowH;
            const height = ((endH - startH) * 60 + (endM - startM)) / 60 * rowH - 2;
            const colors = typeColors[appt.type] || typeColors.AUTRE;
            const opacity = statusOpacity[appt.status] || '';

            return (
              <div
                key={appt.id}
                onClick={() => onEdit(appt)}
                className={`absolute left-0 right-0 ${colors.bg} border-l-4 ${colors.border} rounded-lg p-2 cursor-pointer hover:translate-x-1 transition-transform shadow-sm overflow-hidden ${opacity}`}
                style={{ top: `${top}px`, height: `${Math.max(height, 30)}px` }}
              >
                <div className={`text-xs font-bold ${colors.text}`}>{appt.startTime} - {appt.endTime}</div>
                <div className="text-sm font-semibold text-slate-800 truncate">{appt.title}</div>
                {height > 40 && <div className="text-xs text-slate-500 truncate">📍 {appt.location}</div>}
                <AppointmentBadges appt={appt} />
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
