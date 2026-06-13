import { RouterProvider } from 'react-router';
import { router } from './routes';
import { ThemeProvider } from './components/ThemeContext';
import { TaskProvider } from './context/TaskContext';

export default function App() {
  return (
    <ThemeProvider>
      <TaskProvider>
        <RouterProvider router={router} />
      </TaskProvider>
    </ThemeProvider>
  );
}
