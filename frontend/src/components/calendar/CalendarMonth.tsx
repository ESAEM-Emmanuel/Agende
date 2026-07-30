'use client';

import { Appointment } from '@/types';
import { toDateStr } from '@/lib/date';

interface Props {
  date: Date;
  appointments: Appointment[];
  onEdit: (appt: Appointment) => void;
  onDateChange: (date: Date) => void;
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

const monthNames = ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre'];
const dayNames = ['Lun','Mar','Mer','Jeu','Ven','Sam','Dim'];

export function CalendarMonth({ date, appointments, onEdit, onDateChange }: Props) {
  const year = date.getFullYear();
  const month = date.getMonth();
  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const daysInMonth = lastDayOfMonth.getDate();
  let startDay = firstDayOfMonth.getDay() - 1;
  if (startDay === -1) startDay = 6;
  const todayStr = toDateStr(new Date());

  return (
    <div>
      <div className="text-center text-xl font-bold text-slate-800 mb-6">{monthNames[month]} {year}</div>
      <div className="grid grid-cols-7 gap-2">
        {dayNames.map(dn => (
          <div key={dn} className="text-center text-xs font-bold text-slate-400 uppercase py-2">{dn}</div>
        ))}
        {Array.from({ length: startDay }).map((_, i) => (
          <div key={`empty-${i}`} className="min-h-[100px] bg-slate-50 rounded-lg" />
        ))}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const dayNum = i + 1;
          const d = new Date(year, month, dayNum);
          const dateStr = toDateStr(d);
          const isToday = dateStr === todayStr;
          const dayAppts = appointments
            .filter(a => toDateStr(a.date) === dateStr)
            .sort((a, b) => a.startTime.localeCompare(b.startTime));

          return (
            <div
              key={dayNum}
              onClick={() => onDateChange(d)}
              className={`min-h-[100px] rounded-lg border p-2 cursor-pointer transition hover:shadow-md ${isToday ? 'bg-blue-50 border-blue-400' : 'bg-white border-slate-200'}`}
            >
              <div className={`text-sm font-bold mb-1 ${isToday ? 'text-blue-700' : 'text-slate-700'}`}>{dayNum}</div>
              <div className="space-y-1">
                {dayAppts.slice(0, 3).map(appt => {
                  const colors = typeColors[appt.type] || typeColors.AUTRE;
                  const opacity = statusOpacity[appt.status] || '';
                  return (
                    <div
                      key={appt.id}
                      onClick={(e) => { e.stopPropagation(); onEdit(appt); }}
                      className={`${colors.bg} border-l-2 ${colors.border} rounded px-1.5 py-0.5 text-[10px] font-bold ${colors.text} truncate cursor-pointer ${opacity}`}
                      title={appt.title}
                    >
                      {appt.startTime} {appt.title}
                    </div>
                  );
                })}
                {dayAppts.length > 3 && (
                  <div className="text-[10px] text-slate-400 text-center">+{dayAppts.length - 3}</div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}