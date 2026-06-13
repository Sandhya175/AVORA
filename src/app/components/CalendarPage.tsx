import { useState } from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, ChevronRight, Plus, Clock, MapPin, Users } from 'lucide-react';
import { useTheme, getTheme } from './ThemeContext';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

interface CalEvent {
  id: string; title: string; date: number; month: number; year: number;
  time: string; category: string; color: string; duration: string;
}

const events: CalEvent[] = [
  { id: '1', title: 'Team Standup', date: 10, month: 5, year: 2026, time: '9:00 AM', category: 'Meeting', color: '#8B5CF6', duration: '30 min' },
  { id: '2', title: 'Design Review', date: 10, month: 5, year: 2026, time: '11:00 AM', category: 'Design', color: '#A855F7', duration: '1 hr' },
  { id: '3', title: 'Client Presentation', date: 12, month: 5, year: 2026, time: '2:00 PM', category: 'Work', color: '#6366F1', duration: '2 hr' },
  { id: '4', title: 'Focus Session', date: 11, month: 5, year: 2026, time: '9:00 AM', category: 'Focus', color: '#EC4899', duration: '2 hr' },
  { id: '5', title: 'Product Planning', date: 14, month: 5, year: 2026, time: '3:00 PM', category: 'Work', color: '#8B5CF6', duration: '1 hr' },
  { id: '6', title: 'Weekly Review', date: 13, month: 5, year: 2026, time: '5:00 PM', category: 'Personal', color: '#22C55E', duration: '30 min' },
  { id: '7', title: 'Deep Work Block', date: 15, month: 5, year: 2026, time: '8:00 AM', category: 'Focus', color: '#EC4899', duration: '3 hr' },
  { id: '8', title: 'Gym Session', date: 16, month: 5, year: 2026, time: '6:30 AM', category: 'Personal', color: '#22C55E', duration: '1 hr' },
  { id: '9', title: 'Code Review', date: 17, month: 5, year: 2026, time: '10:00 AM', category: 'Development', color: '#6366F1', duration: '1 hr' },
  { id: '10', title: 'Product Demo', date: 18, month: 5, year: 2026, time: '4:00 PM', category: 'Work', color: '#8B5CF6', duration: '45 min' },
];

function getDaysInMonth(month: number, year: number) {
  return new Date(year, month + 1, 0).getDate();
}
function getFirstDayOfMonth(month: number, year: number) {
  return new Date(year, month, 1).getDay();
}

export function CalendarPage() {
  const { isDark } = useTheme();
  const t = getTheme(isDark);
  const today = new Date();
  const [viewMonth, setViewMonth] = useState(5); // June 0-indexed
  const [viewYear, setViewYear] = useState(2026);
  const [selectedDate, setSelectedDate] = useState<number | null>(10);
  const [view, setView] = useState<'month' | 'week'>('month');

  const daysInMonth = getDaysInMonth(viewMonth, viewYear);
  const firstDay = getFirstDayOfMonth(viewMonth, viewYear);

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
  };

  const getEventsForDay = (day: number) => events.filter(e => e.date === day && e.month === viewMonth && e.year === viewYear);
  const selectedEvents = selectedDate ? getEventsForDay(selectedDate) : [];

  const card: React.CSSProperties = {
    background: t.cardBg, backdropFilter: 'blur(20px)',
    border: `1px solid ${t.border}`, borderRadius: 18, boxShadow: t.shadow,
  };

  const upcomingEvents = events
    .filter(e => e.year === viewYear && e.month === viewMonth && e.date >= (selectedDate || 10))
    .slice(0, 6);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: 6 }}>
          {(['month', 'week'] as const).map(v => (
            <button key={v} onClick={() => setView(v)} style={{
              padding: '7px 18px', borderRadius: 10, fontSize: 13, cursor: 'pointer', border: 'none',
              background: view === v ? 'linear-gradient(135deg,#8B5CF6,#6366F1)' : (isDark ? 'rgba(139,92,246,0.08)' : 'rgba(139,92,246,0.06)'),
              color: view === v ? 'white' : t.textMuted, fontWeight: view === v ? 600 : 400,
              boxShadow: view === v ? '0 4px 14px rgba(139,92,246,0.3)' : 'none', textTransform: 'capitalize',
            }}>{v} View</button>
          ))}
        </div>
        <button style={{
          display: 'flex', alignItems: 'center', gap: 6,
          background: 'linear-gradient(135deg,#8B5CF6,#6366F1)', border: 'none',
          borderRadius: 10, padding: '8px 18px', color: 'white', cursor: 'pointer',
          fontSize: 13, fontWeight: 600, boxShadow: '0 4px 14px rgba(139,92,246,0.35)',
        }}>
          <Plus size={14} /> New Event
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 20 }}>
        {/* Calendar Grid */}
        <div style={{ ...card, padding: '22px 24px' }}>
          {/* Month nav */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <button onClick={prevMonth} style={{ background: isDark ? 'rgba(139,92,246,0.08)' : 'rgba(139,92,246,0.06)', border: `1px solid ${t.border}`, borderRadius: 8, padding: '6px 10px', cursor: 'pointer', color: t.textMuted, display: 'flex' }}>
              <ChevronLeft size={16} />
            </button>
            <div style={{ fontSize: 18, fontWeight: 700, color: t.text }}>
              {MONTHS[viewMonth]} {viewYear}
            </div>
            <button onClick={nextMonth} style={{ background: isDark ? 'rgba(139,92,246,0.08)' : 'rgba(139,92,246,0.06)', border: `1px solid ${t.border}`, borderRadius: 8, padding: '6px 10px', cursor: 'pointer', color: t.textMuted, display: 'flex' }}>
              <ChevronRight size={16} />
            </button>
          </div>

          {/* Day headers */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', marginBottom: 10 }}>
            {DAYS.map(d => (
              <div key={d} style={{ textAlign: 'center', fontSize: 12, color: t.textDim, fontWeight: 600, padding: '4px 0', letterSpacing: '0.04em' }}>{d}</div>
            ))}
          </div>

          {/* Calendar cells */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4 }}>
            {/* Empty cells */}
            {Array(firstDay).fill(null).map((_, i) => <div key={`e-${i}`} />)}
            {/* Day cells */}
            {Array(daysInMonth).fill(null).map((_, i) => {
              const day = i + 1;
              const dayEvents = getEventsForDay(day);
              const isToday = day === today.getDate() && viewMonth === today.getMonth() && viewYear === today.getFullYear();
              const isSelected = day === selectedDate;
              return (
                <motion.div
                  key={day}
                  whileHover={{ scale: 1.05 }}
                  onClick={() => setSelectedDate(day)}
                  style={{
                    aspectRatio: '1', padding: '6px', borderRadius: 10, cursor: 'pointer',
                    background: isSelected
                      ? 'linear-gradient(135deg,#8B5CF6,#6366F1)'
                      : isToday
                        ? (isDark ? 'rgba(139,92,246,0.15)' : 'rgba(139,92,246,0.1)')
                        : 'transparent',
                    border: isToday && !isSelected ? `1.5px solid ${t.primary}` : '1.5px solid transparent',
                    boxShadow: isSelected ? '0 4px 16px rgba(139,92,246,0.4)' : 'none',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
                    transition: 'all 0.15s',
                  }}
                >
                  <span style={{ fontSize: 13, fontWeight: isToday || isSelected ? 700 : 400, color: isSelected ? 'white' : isToday ? t.primary : t.text }}>
                    {day}
                  </span>
                  {dayEvents.length > 0 && (
                    <div style={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
                      {dayEvents.slice(0, 3).map(ev => (
                        <div key={ev.id} style={{ width: 5, height: 5, borderRadius: '50%', background: isSelected ? 'rgba(255,255,255,0.7)' : ev.color }} />
                      ))}
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Right Panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Selected day events */}
          <div style={{ ...card, padding: '20px' }}>
            <div style={{ fontSize: 15, fontWeight: 600, color: t.text, marginBottom: 14 }}>
              {selectedDate ? `${MONTHS[viewMonth]} ${selectedDate}` : 'Select a day'}
            </div>
            {selectedEvents.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '20px 0', color: t.textMuted, fontSize: 13 }}>
                No events for this day.<br />
                <span style={{ fontSize: 11, color: t.textDim }}>Click + to add one.</span>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {selectedEvents.map(ev => (
                  <motion.div key={ev.id} whileHover={{ x: 2 }} style={{
                    padding: '12px', borderRadius: 12,
                    background: isDark ? 'rgba(139,92,246,0.06)' : 'rgba(139,92,246,0.04)',
                    border: `1px solid ${t.borderSubtle}`,
                    borderLeft: `3px solid ${ev.color}`,
                  }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: t.text, marginBottom: 4 }}>{ev.title}</div>
                    <div style={{ display: 'flex', gap: 12 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: t.textMuted }}>
                        <Clock size={10} color={ev.color} /> {ev.time}
                      </div>
                      <div style={{ fontSize: 11, color: t.textDim }}>{ev.duration}</div>
                    </div>
                    <div style={{ marginTop: 6 }}>
                      <span style={{ fontSize: 10, padding: '2px 7px', borderRadius: 4, background: `${ev.color}18`, color: ev.color, fontWeight: 600 }}>{ev.category}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Upcoming events */}
          <div style={{ ...card, padding: '20px' }}>
            <div style={{ fontSize: 15, fontWeight: 600, color: t.text, marginBottom: 14 }}>Upcoming Events</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {upcomingEvents.map(ev => (
                <div key={ev.id} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                  <div style={{ width: 36, textAlign: 'center', flexShrink: 0 }}>
                    <div style={{ fontSize: 18, fontWeight: 700, color: t.primary, lineHeight: 1 }}>{ev.date}</div>
                    <div style={{ fontSize: 9, color: t.textDim }}>{MONTHS[ev.month].slice(0, 3)}</div>
                  </div>
                  <div style={{ flex: 1, paddingLeft: 10, borderLeft: `2px solid ${ev.color}` }}>
                    <div style={{ fontSize: 12, fontWeight: 500, color: t.text }}>{ev.title}</div>
                    <div style={{ fontSize: 11, color: t.textMuted, marginTop: 2 }}>{ev.time} · {ev.duration}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
