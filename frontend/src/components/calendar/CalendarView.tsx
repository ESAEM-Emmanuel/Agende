'use client';

import { useState } from 'react';
import { Appointment } from '@/types';
import { toDateStr, formatDisplayDate } from '@/lib/date';
import { CalendarDay } from './CalendarDay';
import { CalendarWeek } from './CalendarWeek';
import { CalendarMonth } from './CalendarMonth';

type View = 'day' | 'week' | 'month';

interface Props {
  appointments: Appointment[];
  currentDate: Date;
  onDateChange: (date: Date) => void;
  onEdit: (appt: Appointment) => void;
}

export function CalendarView({ appointments, currentDate, onDateChange, onEdit }: Props) {
  const [view, setView] = useState<View>('day');

  const changeDate = (days: number) => {
    const d = new Date(currentDate);
    if (view === 'day') d.setDate(d.getDate() + days);
    else if (view === 'week') d.setDate(d.getDate() + days * 7);
    else d.setMonth(d.getMonth() + days);
    onDateChange(d);
  };

  const dateLabel = formatDisplayDate(toDateStr(currentDate));

  return (
    <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-3 sm:p-4 border-b border-slate-200 space-y-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="grid grid-cols-3 gap-1 bg-slate-100 p-1 rounded-lg w-full sm:w-auto">
            {(['day', 'week', 'month'] as View[]).map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`flex-1 px-3 py-2 rounded-md text-xs sm:text-sm font-medium transition min-h-[44px] ${
                  view === v ? 'bg-white text-blue-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {v === 'day' ? 'Jour' : v === 'week' ? 'Semaine' : 'Mois'}
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between gap-2 w-full sm:w-auto">
            <button
              onClick={() => changeDate(-1)}
              className="w-11 h-11 sm:w-9 sm:h-9 flex-shrink-0 flex items-center justify-center border border-slate-300 rounded-lg hover:bg-slate-50 active:bg-slate-100 text-slate-600 text-xl"
              aria-label="Période précédente"
            >
              ‹
            </button>
            <div className="flex-1 text-center min-w-0">
              <p className="text-sm sm:text-base font-semibold text-slate-800 truncate">{dateLabel}</p>
            </div>
            <button
              onClick={() => changeDate(1)}
              className="w-11 h-11 sm:w-9 sm:h-9 flex-shrink-0 flex items-center justify-center border border-slate-300 rounded-lg hover:bg-slate-50 active:bg-slate-100 text-slate-600 text-xl"
              aria-label="Période suivante"
            >
              ›
            </button>
          </div>
        </div>

        <button
          onClick={() => onDateChange(new Date())}
          className="w-full sm:w-auto sm:mx-auto sm:block px-3 py-2.5 text-sm border border-slate-300 rounded-lg hover:bg-slate-50 active:bg-slate-100 font-medium text-slate-700 min-h-[44px]"
        >
          Aujourd&apos;hui
        </button>
      </div>

      <div className="p-3 sm:p-4">
        {view === 'day' && <CalendarDay date={currentDate} appointments={appointments} onEdit={onEdit} />}
        {view === 'week' && <CalendarWeek date={currentDate} appointments={appointments} onEdit={onEdit} />}
        {view === 'month' && <CalendarMonth date={currentDate} appointments={appointments} onEdit={onEdit} onDateChange={onDateChange} />}
      </div>
    </div>
  );
}
