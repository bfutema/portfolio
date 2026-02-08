import { useHoursApp } from '../../../providers/HoursAppProvider';
import { Calendar } from '../components/Calendar';

export function HomeView() {
  const {
    tasks,
    clients,
    revenueEntries,
    taxReminders,
    recurringReminders,
    recurringPayments,
    oneOffExpenses,
    addTask,
    updateTask,
    addRevenueEntry,
    updateRevenueEntry,
    addTaxReminder,
    updateTaxReminder,
    addRecurringReminder,
    addRecurringPayment,
    addOneOffExpense,
    updateOneOffExpense,
    deleteTaxReminder,
    deleteRecurringReminder,
    deleteOneOffExpense,
  } = useHoursApp();

  return (
    <Calendar
      tasks={tasks}
      clients={clients}
      revenueEntries={revenueEntries}
      taxReminders={taxReminders}
      recurringReminders={recurringReminders}
      recurringPayments={recurringPayments}
      oneOffExpenses={oneOffExpenses}
      onAddTask={addTask}
      onUpdateTask={updateTask}
      onAddRevenue={addRevenueEntry}
      onUpdateRevenue={updateRevenueEntry}
      onAddTaxReminder={addTaxReminder}
      onUpdateTaxReminder={updateTaxReminder}
      onAddRecurringReminder={addRecurringReminder}
      onAddRecurringPayment={addRecurringPayment}
      onAddOneOffExpense={addOneOffExpense}
      onUpdateOneOffExpense={updateOneOffExpense}
      onDeleteTaxReminder={deleteTaxReminder}
      onDeleteRecurringReminder={deleteRecurringReminder}
      onDeleteOneOffExpense={deleteOneOffExpense}
      showImpostosActions
    />
  );
}
