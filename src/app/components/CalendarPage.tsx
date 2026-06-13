import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { ChevronLeft, ChevronRight, Plus, Clock, AlertCircle, CheckSquare, Tag } from 'lucide-react';
import { useTheme, getTheme } from './ThemeContext';
import { useIsMobile } from '../hooks/use-mobile';
import { Task } from './TaskManagement';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const catColors: Record<string, string> = {
  Work: '#8B5CF6', Personal: '#EC4899', Study: '#6366F1', Health: '#10B981', Finance: '#F59E0B', Shopping: '#06B6D4'
};

function getDaysInMonth(month: number, year: number) {
  return new Date(year, month + 1, 0).getDate();
}
function getFirstDayOfMonth(month: number, year: number) {
  return new Date(year, month, 1).getDay();
}

export function CalendarPage() {
  const { isDark } = useTheme();
  const t = getTheme(isDark);
  const isMobile = useIsMobile();
  const navigate = useNavigate();

  const today = new Date();
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [selectedDate, setSelectedDate] = useState<number | null>(today.getDate());
  
  // Load tasks from LocalStorage
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    const loadTasks = () => {
      const saved = localStorage.getItem('avora_tasks');
      if (saved) {
        setTasks(JSON.parse(saved));
      }
    };
    loadTasks();
    window.addEventListener('storage', loadTasks);
    window.addEventListener('tasks_updated', loadTasks);
    return () => {
      window.removeEventListener('storage', loadTasks);
      window.removeEventListener('tasks_updated', loadTasks);
    };
  }, []);

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

  // Helper to match task due date (format YYYY-MM-DD) with calendar day
  const getTasksForDay = (day: number) => {
    return tasks.filter(task => {
      if (!task.due) return false;
      const [year, month, date] = task.due.split('-').map(Number);
      return date === day && (month - 1) === viewMonth && year === viewYear;
    });
  };

  const selectedTasks = selectedDate ? getTasksForDay(selectedDate) : [];

  // Find all upcoming tasks (due today or in the future)
  const upcomingTasks = tasks
    .filter(task => {
      if (!task.due || task.done) return false;
      const taskDate = new Date(task.due);
      // set hours to 0 to compare dates
      const compareToday = new Date();
      compareToday.setHours(0, 0, 0, 0);
      return taskDate >= compareToday;
    })
    .sort((a, b) => new Date(a.due).getTime() - new Date(b.due).getTime())
    .slice(0, 5);

  const card: React.CSSProperties = {
    background: t.cardBg, backdropFilter: 'blur(20px)',
    border: `1px solid ${t.border}`, borderRadius: 18, boxShadow: t.shadow,
  };

  const formatMonthShort = (monthIndex: number) => {
    return MONTHS[monthIndex].slice(0, 3);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Action Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <div style={{ fontSize: 14, color: t.textMuted }}>Schedule tasks and keep track of deadlines</div>
        <button
          onClick={() => {
            const formattedDate = selectedDate
              ? `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(selectedDate).padStart(2, '0')}`
              : new Date().toISOString().split('T')[0];
            navigate(`/app/tasks?add=true&due=${formattedDate}`);
          }}
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            background: 'linear-gradient(135deg,#8B5CF6,#6366F1)', border: 'none',
            borderRadius: 10, padding: '8px 18px', color: 'white', cursor: 'pointer',
            fontSize: 13, fontWeight: 600, boxShadow: '0 4px 14px rgba(139,92,246,0.35)',
          }}
        >
          <Plus size={14} /> Schedule Task
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 300px', gap: 20 }}>
        
        {/* Calendar Grid Card */}
        <div style={{ ...card, padding: isMobile ? '16px' : '22px 24px', minWidth: 0 }}>
          {/* Calendar Month Selector */}
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

          {/* Day Names Row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', marginBottom: 10 }}>
            {DAYS.map(d => (
              <div key={d} style={{ textAlign: 'center', fontSize: 11, color: t.textDim, fontWeight: 700, padding: '4px 0', letterSpacing: '0.04em' }}>
                {d.toUpperCase()}
              </div>
            ))}
          </div>

          {/* Calendar Grid Cells */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 6 }}>
            {/* Empty offset spaces */}
            {Array(firstDay).fill(null).map((_, i) => <div key={`empty-${i}`} />)}
            
            {/* Real Days */}
            {Array(daysInMonth).fill(null).map((_, i) => {
              const day = i + 1;
              const dayTasks = getTasksForDay(day);
              const isToday = day === today.getDate() && viewMonth === today.getMonth() && viewYear === today.getFullYear();
              const isSelected = day === selectedDate;

              return (
                <motion.div
                  key={day}
                  whileHover={{ scale: 1.05 }}
                  onClick={() => setSelectedDate(day)}
                  style={{
                    aspectRatio: '1', padding: '6px', borderRadius: 12, cursor: 'pointer',
                    background: isSelected
                      ? 'linear-gradient(135deg,#8B5CF6,#6366F1)'
                      : isToday
                        ? (isDark ? 'rgba(139,92,246,0.15)' : 'rgba(139,92,246,0.1)')
                        : 'transparent',
                    border: isToday && !isSelected ? `1.5px solid ${t.primary}` : '1.5px solid transparent',
                    boxShadow: isSelected ? '0 4px 16px rgba(139,92,246,0.4)' : 'none',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between',
                    transition: 'all 0.15s',
                  }}
                >
                  <span style={{ fontSize: 13, fontWeight: isToday || isSelected ? 700 : 400, color: isSelected ? 'white' : isToday ? t.primary : t.text }}>
                    {day}
                  </span>
                  
                  {/* Task Indicator dots */}
                  {dayTasks.length > 0 && (
                    <div style={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center', paddingBottom: 2 }}>
                      {dayTasks.slice(0, 3).map(task => (
                        <div
                          key={task.id}
                          style={{
                            width: 5, height: 5, borderRadius: '50%',
                            background: isSelected ? 'white' : (catColors[task.category] || '#8B5CF6')
                          }}
                        />
                      ))}
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Right Details Panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          
          {/* Selected Date's Tasks */}
          <div style={{ ...card, padding: '20px' }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: t.text, marginBottom: 14, borderBottom: `1px solid ${t.borderSubtle}`, paddingBottom: 8 }}>
              {selectedDate ? `${MONTHS[viewMonth]} ${selectedDate}, ${viewYear}` : 'Select a Day'}
            </div>
            {selectedTasks.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '24px 0', color: t.textMuted, fontSize: 13 }}>
                <CheckSquare size={20} style={{ margin: '0 auto 8px', opacity: 0.5 }} />
                No tasks scheduled for this day.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxHeight: 300, overflowY: 'auto' }}>
                {selectedTasks.map(task => {
                  const cc = catColors[task.category] || '#8B5CF6';
                  return (
                    <motion.div
                      key={task.id}
                      onClick={() => navigate('/app/tasks')}
                      whileHover={{ x: 2 }}
                      style={{
                        padding: '12px', borderRadius: 12, cursor: 'pointer',
                        background: isDark ? 'rgba(139,92,246,0.06)' : 'rgba(139,92,246,0.04)',
                        border: `1px solid ${t.borderSubtle}`,
                        borderLeft: `3.5px solid ${cc}`,
                      }}
                    >
                      <div style={{ fontSize: 13, fontWeight: 600, color: t.text, textDecoration: task.done ? 'line-through' : 'none' }}>
                        {task.title}
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
                        <span style={{ fontSize: 10, padding: '2px 6px', borderRadius: 4, background: `${cc}15`, color: cc, fontWeight: 700 }}>
                          {task.category}
                        </span>
                        <span style={{ fontSize: 11, color: t.textMuted }}>
                          {task.status === 'in_progress' ? `${task.progress}%` : task.status}
                        </span>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Upcoming Agenda Tasks */}
          <div style={{ ...card, padding: '20px' }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: t.text, marginBottom: 14, borderBottom: `1px solid ${t.borderSubtle}`, paddingBottom: 8 }}>
              Upcoming Deadlines
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {upcomingTasks.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '12px 0', color: t.textMuted, fontSize: 12 }}>
                  No upcoming deadlines!
                </div>
              ) : (
                upcomingTasks.map(task => {
                  const [year, month, day] = task.due.split('-').map(Number);
                  const cc = catColors[task.category] || '#8B5CF6';
                  return (
                    <div key={task.id} style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                      <div style={{ width: 36, textAlign: 'center', flexShrink: 0 }}>
                        <div style={{ fontSize: 18, fontWeight: 800, color: t.primary, lineHeight: 1 }}>{day}</div>
                        <div style={{ fontSize: 9, color: t.textDim, textTransform: 'uppercase' }}>{formatMonthShort(month - 1)}</div>
                      </div>
                      <div style={{ flex: 1, paddingLeft: 10, borderLeft: `2px solid ${cc}`, minWidth: 0 }}>
                        <div style={{ fontSize: 12, fontWeight: 600, color: t.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {task.title}
                        </div>
                        <div style={{ fontSize: 10, color: t.textMuted, marginTop: 2 }}>{task.category} · Priority {task.priority}</div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
