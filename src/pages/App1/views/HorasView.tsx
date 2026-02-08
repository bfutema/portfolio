import { useState } from 'react';
import { useHoursApp } from '../../../providers/HoursAppProvider';
import { Dashboard } from '../components/Dashboard';
import { TaskList } from '../components/TaskList';
import * as S from './HorasView.styles';

const MONTH_NAMES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
];

export function HorasView() {
  const {
    tasks,
    clients,
    revenueEntries,
    addTask,
    updateTask,
    deleteTask,
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

  const isCurrentMonth = year === now.getFullYear() && month === now.getMonth();

  return (
    <>
      <S.MonthFilterWrapper>
        <S.TodayButton
          type="button"
          $active={isCurrentMonth}
          onClick={handleToday}
          aria-label="Ir para hoje"
        >
          Hoje
        </S.TodayButton>
        <S.MonthFilterNav>
          <S.MonthFilterBtn type="button" onClick={handlePrevMonth} aria-label="Mês anterior">
            ‹
          </S.MonthFilterBtn>
          <S.MonthFilterLabel>
            {MONTH_NAMES[month]} {year}
          </S.MonthFilterLabel>
          <S.MonthFilterBtn type="button" onClick={handleNextMonth} aria-label="Próximo mês">
            ›
          </S.MonthFilterBtn>
        </S.MonthFilterNav>
      </S.MonthFilterWrapper>
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
