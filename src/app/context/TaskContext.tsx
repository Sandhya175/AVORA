import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  ReactNode,
} from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Task {
  id: string;
  title: string;
  description: string;
  category: 'Work' | 'Personal' | 'Study' | 'Health' | 'Finance' | 'Shopping';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  due: string;
  done: boolean;
  status: 'pending' | 'in_progress' | 'completed';
  progress: number;
  starred: boolean;
}

export type NotificationType = 'created' | 'completed' | 'deleted' | 'due_tomorrow' | 'overdue';

export interface AppNotification {
  id: string;
  type: NotificationType;
  message: string;
  timestamp: number;
  read: boolean;
  taskId?: string;
}

interface TaskContextValue {
  tasks: Task[];
  notifications: AppNotification[];
  unreadCount: number;
  addTask: (data: Omit<Task, 'id' | 'done' | 'status' | 'progress' | 'starred'>) => void;
  editTask: (task: Task) => void;
  deleteTask: (id: string) => void;
  toggleDone: (id: string) => void;
  toggleStar: (id: string) => void;
  setStatus: (id: string, status: Task['status']) => void;
  setProgress: (id: string, progress: number) => void;
  reorderTasks: (fromId: string, toId: string) => void;
  saveTasks: (tasks: Task[]) => void;
  markNotifRead: (id: string) => void;
  markAllRead: () => void;
  deleteNotif: (id: string) => void;
  clearAllNotifs: () => void;
}

// ─── Storage Keys ─────────────────────────────────────────────────────────────

const TASKS_KEY = 'avora_tasks';
const NOTIFS_KEY = 'avora_notifications';
const SEED_KEY = 'avora_tasks_seeded_v2';

// ─── Initial Data ─────────────────────────────────────────────────────────────

const initialTasks: Task[] = [
  { id: '1', title: 'Integrate LocalStorage Sync', description: 'Verify that tasks, settings, and themes persist across page reloads.', category: 'Work', priority: 'high', due: '2026-06-13', done: true, status: 'completed', progress: 100, starred: false },
  { id: '2', title: 'Configure Vite Development Environment', description: 'Set up build pipelines, optimization plugins, and server ports.', category: 'Study', priority: 'medium', due: '2026-06-12', done: true, status: 'completed', progress: 100, starred: false },
  { id: '3', title: 'Establish Base CSS Theme Tokens', description: 'Define dark/light color palettes, transitions, and glow constants.', category: 'Work', priority: 'high', due: '2026-06-11', done: true, status: 'completed', progress: 100, starred: true },
  { id: '4', title: 'Conduct Security Auditing on Local Storage', description: 'Sanitize stored inputs and verify secure data isolation.', category: 'Finance', priority: 'urgent', due: '2026-06-10', done: true, status: 'completed', progress: 100, starred: false },
  { id: '5', title: 'Build Homepage Hero Section', description: 'Implement glassmorphism cards and neon glow graphics.', category: 'Work', priority: 'high', due: '2026-06-14', done: false, status: 'in_progress', progress: 45, starred: true },
  { id: '6', title: 'Resolve Dropdown Clipping in Tasks List', description: 'Lift active menu stacking context to prevent elements rendering underneath.', category: 'Work', priority: 'high', due: '2026-06-14', done: false, status: 'in_progress', progress: 80, starred: false },
  { id: '7', title: 'Polish Interactive Chart Widgets', description: 'Add hover animations and custom SVG gradients to the analytics tab.', category: 'Study', priority: 'medium', due: '2026-06-15', done: false, status: 'in_progress', progress: 30, starred: false },
  { id: '8', title: 'Implement Mobile Nav Drawer', description: 'Ensure the sidebar collapses into a hamburger menu on small devices.', category: 'Study', priority: 'medium', due: '2026-06-16', done: false, status: 'pending', progress: 0, starred: false },
  { id: '9', title: 'Schedule Cardio Workout Session', description: 'Complete a 45-minute HIIT workout session and full body stretch.', category: 'Health', priority: 'low', due: '2026-06-15', done: false, status: 'pending', progress: 0, starred: false },
  { id: '10', title: 'Plan Weekly Grocery Shopping', description: 'List ingredients for high-protein meals and batch prep meals.', category: 'Shopping', priority: 'low', due: '2026-06-16', done: false, status: 'pending', progress: 0, starred: false },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function loadTasks(): Task[] {
  try {
    const saved = localStorage.getItem(TASKS_KEY);
    const seeded = localStorage.getItem(SEED_KEY);
    if (saved && seeded === 'true') {
      return JSON.parse(saved) as Task[];
    }
  } catch {}
  localStorage.setItem(TASKS_KEY, JSON.stringify(initialTasks));
  localStorage.setItem(SEED_KEY, 'true');
  return initialTasks;
}

function loadNotifs(): AppNotification[] {
  try {
    const saved = localStorage.getItem(NOTIFS_KEY);
    if (saved) return JSON.parse(saved) as AppNotification[];
  } catch {}
  return [];
}

function persistTasks(tasks: Task[]) {
  localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
  window.dispatchEvent(new Event('tasks_updated'));
}

function persistNotifs(notifs: AppNotification[]) {
  // Keep last 50 notifications maximum
  const capped = notifs.slice(0, 50);
  localStorage.setItem(NOTIFS_KEY, JSON.stringify(capped));
}

function makeNotif(type: NotificationType, message: string, taskId?: string): AppNotification {
  return {
    id: `n_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    type,
    message,
    timestamp: Date.now(),
    read: false,
    taskId,
  };
}

function sendBrowserNotif(title: string, body: string) {
  if (typeof Notification === 'undefined') return;
  if (Notification.permission !== 'granted') return;
  try {
    new Notification(title, { body, icon: '/favicon.ico' });
  } catch {}
}

function getDeadlineNotifKey(taskId: string, type: 'due_tomorrow' | 'overdue'): string {
  return `avora_notified_${taskId}_${type}`;
}

// ─── Context ──────────────────────────────────────────────────────────────────

const TaskContext = createContext<TaskContextValue | null>(null);

export function TaskProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>(loadTasks);
  const [notifications, setNotifications] = useState<AppNotification[]>(loadNotifs);

  // ── Request browser notification permission once ─────────────────────────
  useEffect(() => {
    if (typeof Notification !== 'undefined' && Notification.permission === 'default') {
      Notification.requestPermission().catch(() => {});
    }
  }, []);

  // ── Deadline checker on mount and whenever tasks change ──────────────────
  useEffect(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const newNotifs: AppNotification[] = [];

    tasks
      .filter((t) => !t.done && t.status !== 'completed' && t.due)
      .forEach((task) => {
        const dueDate = new Date(task.due + 'T00:00:00');

        if (dueDate.getTime() === tomorrow.getTime()) {
          const key = getDeadlineNotifKey(task.id, 'due_tomorrow');
          if (!localStorage.getItem(key)) {
            localStorage.setItem(key, 'true');
            const notif = makeNotif('due_tomorrow', `⚠ Due tomorrow: "${task.title}"`, task.id);
            newNotifs.push(notif);
            sendBrowserNotif('Task Due Tomorrow', `"${task.title}" is due tomorrow!`);
          }
        } else if (dueDate < today) {
          const key = getDeadlineNotifKey(task.id, 'overdue');
          if (!localStorage.getItem(key)) {
            localStorage.setItem(key, 'true');
            const notif = makeNotif('overdue', `🚨 Overdue: "${task.title}"`, task.id);
            newNotifs.push(notif);
            sendBrowserNotif('Task Overdue', `"${task.title}" is overdue!`);
          }
        }
      });

    if (newNotifs.length > 0) {
      setNotifications((prev) => {
        const merged = [...newNotifs, ...prev];
        persistNotifs(merged);
        return merged;
      });
    }
  }, [tasks]);

  // ── Core mutation helpers ─────────────────────────────────────────────────

  const commitTasks = useCallback((next: Task[]) => {
    setTasks(next);
    persistTasks(next);
  }, []);

  const pushNotif = useCallback((notif: AppNotification) => {
    setNotifications((prev) => {
      const merged = [notif, ...prev];
      persistNotifs(merged);
      return merged;
    });
  }, []);

  // ── Public actions ────────────────────────────────────────────────────────

  const addTask = useCallback(
    (data: Omit<Task, 'id' | 'done' | 'status' | 'progress' | 'starred'>) => {
      const newTask: Task = {
        ...data,
        id: Date.now().toString(),
        done: false,
        status: 'pending',
        progress: 0,
        starred: false,
      };
      const next = [newTask, ...tasks];
      commitTasks(next);

      const notif = makeNotif('created', `✓ New task created: "${newTask.title}"`, newTask.id);
      pushNotif(notif);
      sendBrowserNotif('Task Created', `"${newTask.title}" has been added.`);
    },
    [tasks, commitTasks, pushNotif]
  );

  const editTask = useCallback(
    (task: Task) => {
      const next = tasks.map((t) => (t.id === task.id ? task : t));
      commitTasks(next);
    },
    [tasks, commitTasks]
  );

  const deleteTask = useCallback(
    (id: string) => {
      const target = tasks.find((t) => t.id === id);
      const next = tasks.filter((t) => t.id !== id);
      commitTasks(next);

      if (target) {
        const notif = makeNotif('deleted', `🗑 Task deleted: "${target.title}"`, id);
        pushNotif(notif);
      }
    },
    [tasks, commitTasks, pushNotif]
  );

  const toggleDone = useCallback(
    (id: string) => {
      const next = tasks.map((t) => {
        if (t.id !== id) return t;
        const nextDone = !t.done;
        return {
          ...t,
          done: nextDone,
          status: nextDone ? ('completed' as const) : ('pending' as const),
          progress: nextDone ? 100 : 0,
        };
      });
      commitTasks(next);

      const task = next.find((t) => t.id === id);
      if (task?.done) {
        const notif = makeNotif('completed', `🎉 Task completed: "${task.title}"`, id);
        pushNotif(notif);
        sendBrowserNotif('Task Completed', `"${task.title}" is done!`);
      }
    },
    [tasks, commitTasks, pushNotif]
  );

  const toggleStar = useCallback(
    (id: string) => {
      const next = tasks.map((t) => (t.id === id ? { ...t, starred: !t.starred } : t));
      commitTasks(next);
    },
    [tasks, commitTasks]
  );

  const setStatus = useCallback(
    (id: string, status: Task['status']) => {
      const next = tasks.map((t) => {
        if (t.id !== id) return t;
        let done = t.done;
        let progress = t.progress;
        if (status === 'completed') { done = true; progress = 100; }
        else if (status === 'pending') { done = false; progress = 0; }
        else if (status === 'in_progress' && progress === 0) { done = false; progress = 25; }
        return { ...t, status, done, progress };
      });
      commitTasks(next);

      const task = next.find((t) => t.id === id);
      if (task?.status === 'completed') {
        const notif = makeNotif('completed', `🎉 Task completed: "${task.title}"`, id);
        pushNotif(notif);
        sendBrowserNotif('Task Completed', `"${task.title}" is done!`);
      }
    },
    [tasks, commitTasks, pushNotif]
  );

  const setProgress = useCallback(
    (id: string, progress: number) => {
      const next = tasks.map((t) => {
        if (t.id !== id) return t;
        let status = t.status;
        let done = t.done;
        if (progress === 100) { status = 'completed'; done = true; }
        else if (progress === 0) { status = 'pending'; done = false; }
        else { status = 'in_progress'; done = false; }
        return { ...t, progress, status, done };
      });
      commitTasks(next);

      const task = next.find((t) => t.id === id);
      if (task?.done) {
        const notif = makeNotif('completed', `🎉 Task completed: "${task.title}"`, id);
        pushNotif(notif);
        sendBrowserNotif('Task Completed', `"${task.title}" is done!`);
      }
    },
    [tasks, commitTasks, pushNotif]
  );

  const reorderTasks = useCallback(
    (fromId: string, toId: string) => {
      if (fromId === toId) return;
      const fromIdx = tasks.findIndex((t) => t.id === fromId);
      const toIdx = tasks.findIndex((t) => t.id === toId);
      if (fromIdx < 0 || toIdx < 0) return;
      const next = [...tasks];
      const [moved] = next.splice(fromIdx, 1);
      next.splice(toIdx, 0, moved);
      commitTasks(next);
    },
    [tasks, commitTasks]
  );

  const saveTasks = useCallback(
    (newTasks: Task[]) => {
      commitTasks(newTasks);
    },
    [commitTasks]
  );

  // ── Notification actions ──────────────────────────────────────────────────

  const markNotifRead = useCallback((id: string) => {
    setNotifications((prev) => {
      const next = prev.map((n) => (n.id === id ? { ...n, read: true } : n));
      persistNotifs(next);
      return next;
    });
  }, []);

  const markAllRead = useCallback(() => {
    setNotifications((prev) => {
      const next = prev.map((n) => ({ ...n, read: true }));
      persistNotifs(next);
      return next;
    });
  }, []);

  const deleteNotif = useCallback((id: string) => {
    setNotifications((prev) => {
      const next = prev.filter((n) => n.id !== id);
      persistNotifs(next);
      return next;
    });
  }, []);

  const clearAllNotifs = useCallback(() => {
    persistNotifs([]);
    setNotifications([]);
  }, []);

  // ── Derived ───────────────────────────────────────────────────────────────

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.read).length,
    [notifications]
  );

  const value = useMemo<TaskContextValue>(
    () => ({
      tasks,
      notifications,
      unreadCount,
      addTask,
      editTask,
      deleteTask,
      toggleDone,
      toggleStar,
      setStatus,
      setProgress,
      reorderTasks,
      saveTasks,
      markNotifRead,
      markAllRead,
      deleteNotif,
      clearAllNotifs,
    }),
    [
      tasks,
      notifications,
      unreadCount,
      addTask,
      editTask,
      deleteTask,
      toggleDone,
      toggleStar,
      setStatus,
      setProgress,
      reorderTasks,
      saveTasks,
      markNotifRead,
      markAllRead,
      deleteNotif,
      clearAllNotifs,
    ]
  );

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
}

export function useTaskContext(): TaskContextValue {
  const ctx = useContext(TaskContext);
  if (!ctx) throw new Error('useTaskContext must be used inside <TaskProvider>');
  return ctx;
}
