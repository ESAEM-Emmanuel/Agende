'use client';

import { Fragment } from 'react';
import { Appointment } from '@/types';
import { toDateStr } from '@/lib/date';

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

const dayNames = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

export function CalendarWeek({ date, appointments, onEdit }: Props) {
  const startOfWeek = new Date(date);
  const day = startOfWeek.getDay();
  const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1);
  startOfWeek.setDate(diff);
  const hours = Array.from({ length: 11 }, (_, i) => i + 8);

  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden">
      <div className="grid grid-cols-[60px_repeat(7,1fr)] bg-slate-50 border-b border-slate-200">
        <div className="p-3 text-xs font-bold text-slate-400 text-center">Heure</div>
        {Array.from({ length: 7 }).map((_, i) => {
          const d = new Date(startOfWeek);
          d.setDate(startOfWeek.getDate() + i);
          const isToday = toDateStr(d) === toDateStr(new Date());
          return (
            <div key={`header-${i}`} className={`p-3 text-center text-sm font-semibold ${isToday ? 'bg-blue-900 text-white' : 'text-slate-700'}`}>
              <div className="text-xs opacity-80">{dayNames[i]}</div>
              <div>{d.getDate()}</div>
            </div>
          );
        })}
      </div>
      <div className="grid grid-cols-[60px_repeat(7,1fr)]">
        {hours.map(h => (
          <Fragment key={`row-${h}`}>
            <div className="h-16 border-b border-slate-100 text-right pr-3 pt-2 text-xs text-slate-400 font-medium">{h}h</div>
            {Array.from({ length: 7 }).map((_, i) => {
              const d = new Date(startOfWeek);
              d.setDate(startOfWeek.getDate() + i);
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
                <div key={`cell-${h}-${i}`} className="h-16 border-b border-l border-slate-100 p-1 space-y-1">
                  {cellAppts.map(appt => {
                    const colors = typeColors[appt.type] || typeColors.AUTRE;
                    const opacity = statusOpacity[appt.status] || '';
                    return (
                      <div
                        key={appt.id}
                        onClick={() => onEdit(appt)}
                        className={`${colors.bg} border-l-2 ${colors.border} rounded px-2 py-1 text-[10px] font-bold ${colors.text} cursor-pointer truncate hover:opacity-80 ${opacity}`}
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
  );
}