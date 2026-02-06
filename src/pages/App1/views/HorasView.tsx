import { useState } from 'react';
import { useHoursApp } from '../../../providers/HoursAppProvider';
import { MonthSelector } from '../components/MonthSelector';
import { Calendar } from '../components/Calendar';
import { Dashboard } from '../components/Dashboard';
import { TaskList } from '../components/TaskList';

export function HorasView() {
  const {
    tasks,
    clients,
    revenueEntries,
    addTask,
    updateTask,
    deleteTask,
    addRevenueEntry,
    updateRevenueEntry,
  } = useHoursApp();

  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());

  const handlePrevMonth = () => {
    if (month === 0) {
      setMonth(11);
      setYear((y) => y - 1);
    } else {
      setMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (month === 11) {
      setMonth(0);
      setYear((y) => y + 1);
    } else {
      setMonth((m) => m + 1);
    }
  };

  const handleToday = () => {
    const today = new Date();
    setYear(today.getFullYear());
    setMonth(today.getMonth());
  };

  return (
    <>
      <MonthSelector
        year={year}
        month={month}
        onPrev={handlePrevMonth}
        onNext={handleNextMonth}
        onToday={handleToday}
      />
      <Calendar
        tasks={tasks}
        clients={clients}
        revenueEntries={revenueEntries}
        year={year}
        month={month}
        onAddTask={addTask}
        onUpdateTask={updateTask}
        onAddRevenue={addRevenueEntry}
        onUpdateRevenue={updateRevenueEntry}
      />
      <Dashboard
        tasks={tasks}
        clients={clients}
        revenueEntries={revenueEntries}
        year={year}
        month={month}
      />
      <TaskList
        tasks={tasks}
        clients={clients}
        year={year}
        month={month}
        onAdd={addTask}
        onUpdate={updateTask}
        onDelete={deleteTask}
      />
    </>
  );
}
