'use client';

import { useState } from 'react';
import { Appointment } from '@/types';
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

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-4 border-b border-slate-200 flex flex-wrap justify-between items-center gap-3">
        <div className="flex gap-1 bg-slate-100 p-1 rounded-lg">
          {(['day', 'week', 'month'] as View[]).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition ${
                view === v ? 'bg-white text-blue-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {v === 'day' ? 'Jour' : v === 'week' ? 'Semaine' : 'Mois'}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => changeDate(-1)} className="w-8 h-8 flex items-center justify-center border border-slate-300 rounded-lg hover:bg-slate-50 text-slate-600">‹</button>
          <button onClick={() => onDateChange(new Date())} className="px-3 py-1.5 text-sm border border-slate-300 rounded-lg hover:bg-slate-50 font-medium text-slate-700">Aujourd'hui</button>
          <button onClick={() => changeDate(1)} className="w-8 h-8 flex items-center justify-center border border-slate-300 rounded-lg hover:bg-slate-50 text-slate-600">›</button>
        </div>
      </div>

      <div className="p-4">
        {view === 'day' && <CalendarDay date={currentDate} appointments={appointments} onEdit={onEdit} />}
        {view === 'week' && <CalendarWeek date={currentDate} appointments={appointments} onEdit={onEdit} />}
        {view === 'month' && <CalendarMonth date={currentDate} appointments={appointments} onEdit={onEdit} onDateChange={onDateChange} />}
      </div>
    </div>
  );
}