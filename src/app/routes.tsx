import { createBrowserRouter } from 'react-router';
import { LandingPage } from './components/LandingPage';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { TaskManagement } from './components/TaskManagement';
import { CalendarPage } from './components/CalendarPage';
import { Analytics } from './components/Analytics';
import { FocusMode } from './components/FocusMode';
import { AIAssistant } from './components/AIAssistant';
import { SettingsPage } from './components/SettingsPage';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: LandingPage,
  },
  {
    path: '/app',
    Component: Layout,
    children: [
      { index: true, Component: Dashboard },
      { path: 'tasks', Component: TaskManagement },
      { path: 'calendar', Component: CalendarPage },
      { path: 'analytics', Component: Analytics },
      { path: 'focus', Component: FocusMode },
      { path: 'ai', Component: AIAssistant },
      { path: 'settings', Component: SettingsPage },
    ],
  },
]);
