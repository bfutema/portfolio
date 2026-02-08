import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from 'react';
import type {
  Task,
  Client,
  AppSettings,
  RevenueEntry,
  TaxReminder,
  RecurringReminder,
  RecurringPayment,
  OneOffExpense,
  OneOffRevenue,
} from '../../types/hoursApp';
import {
  loadTasks,
  saveTasks,
  loadClients,
  saveClients,
  loadRevenueEntries,
  saveRevenueEntries,
  loadSettings,
  saveSettings,
  loadValuesHidden,
  saveValuesHidden,
  loadTaxReminders,
  saveTaxReminders,
  loadRecurringReminders,
  saveRecurringReminders,
  loadRecurringPayments,
  saveRecurringPayments,
  loadOneOffExpenses,
  saveOneOffExpenses,
  loadOneOffRevenues,
  saveOneOffRevenues,
  downloadEncryptedExport,
  type ImportResult,
} from '../../utils/hoursStorage';

interface HoursAppContextValue {
  tasks: Task[];
  clients: Client[];
  revenueEntries: RevenueEntry[];
  settings: AppSettings;
  valuesHidden: boolean;
  taxReminders: TaxReminder[];
  recurringReminders: RecurringReminder[];
  recurringPayments: RecurringPayment[];
  oneOffExpenses: OneOffExpense[];
  oneOffRevenues: OneOffRevenue[];
  toggleValuesVisibility: () => void;
  addTask: (task: Omit<Task, 'id'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  addClient: (client: Omit<Client, 'id'>) => void;
  updateClient: (id: string, updates: Partial<Client>) => void;
  deleteClient: (id: string) => void;
  addRevenueEntry: (entry: Omit<RevenueEntry, 'id'>) => void;
  updateRevenueEntry: (id: string, updates: Partial<RevenueEntry>) => void;
  deleteRevenueEntry: (id: string) => void;
  addTaxReminder: (reminder: Omit<TaxReminder, 'id'>) => void;
  updateTaxReminder: (id: string, updates: Partial<TaxReminder>) => void;
  deleteTaxReminder: (id: string) => void;
  addRecurringReminder: (reminder: Omit<RecurringReminder, 'id'>) => void;
  updateRecurringReminder: (id: string, updates: Partial<RecurringReminder>) => void;
  deleteRecurringReminder: (id: string) => void;
  addRecurringPayment: (payment: Omit<RecurringPayment, 'id'>) => void;
  deleteRecurringPayment: (id: string) => void;
  addOneOffExpense: (expense: Omit<OneOffExpense, 'id'>) => void;
  updateOneOffExpense: (id: string, updates: Partial<OneOffExpense>) => void;
  deleteOneOffExpense: (id: string) => void;
  addOneOffRevenue: (revenue: Omit<OneOffRevenue, 'id'>) => void;
  updateOneOffRevenue: (id: string, updates: Partial<OneOffRevenue>) => void;
  deleteOneOffRevenue: (id: string) => void;
  exportData: (password: string) => Promise<void>;
  applyImport: (result: ImportResult) => void;
}

const HoursAppContext = createContext<HoursAppContextValue | null>(null);

export function HoursAppProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>(() => loadTasks());
  const [clients, setClients] = useState<Client[]>(() => loadClients());
  const [revenueEntries, setRevenueEntries] = useState<RevenueEntry[]>(() => loadRevenueEntries());
  const [settings, setSettings] = useState<AppSettings>(() => loadSettings());
  const [valuesHidden, setValuesHidden] = useState<boolean>(() => loadValuesHidden());
  const [taxReminders, setTaxReminders] = useState<TaxReminder[]>(() => loadTaxReminders());
  const [recurringReminders, setRecurringReminders] = useState<RecurringReminder[]>(() =>
    loadRecurringReminders()
  );
  const [recurringPayments, setRecurringPayments] = useState<RecurringPayment[]>(() =>
    loadRecurringPayments()
  );
  const [oneOffExpenses, setOneOffExpenses] = useState<OneOffExpense[]>(() => loadOneOffExpenses());
  const [oneOffRevenues, setOneOffRevenues] = useState<OneOffRevenue[]>(() => loadOneOffRevenues());

  useEffect(() => {
    saveTasks(tasks);
  }, [tasks]);

  useEffect(() => {
    saveClients(clients);
  }, [clients]);

  useEffect(() => {
    saveRevenueEntries(revenueEntries);
  }, [revenueEntries]);

  useEffect(() => {
    saveSettings(settings);
  }, [settings]);

  useEffect(() => {
    saveValuesHidden(valuesHidden);
  }, [valuesHidden]);

  useEffect(() => {
    saveTaxReminders(taxReminders);
  }, [taxReminders]);

  useEffect(() => {
    saveRecurringReminders(recurringReminders);
  }, [recurringReminders]);

  useEffect(() => {
    saveRecurringPayments(recurringPayments);
  }, [recurringPayments]);

  useEffect(() => {
    saveOneOffExpenses(oneOffExpenses);
  }, [oneOffExpenses]);

  useEffect(() => {
    saveOneOffRevenues(oneOffRevenues);
  }, [oneOffRevenues]);

  const toggleValuesVisibility = useCallback(() => {
    setValuesHidden((prev) => !prev);
  }, []);

  const addTask = useCallback((task: Omit<Task, 'id'>) => {
    const newTask: Task = {
      ...task,
      id: crypto.randomUUID(),
    };
    setTasks((prev) => [...prev, newTask]);
  }, []);

  const updateTask = useCallback((id: string, updates: Partial<Task>) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updates } : t))
    );
  }, []);

  const deleteTask = useCallback((id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addClient = useCallback((client: Omit<Client, 'id'>) => {
    const newClient: Client = {
      ...client,
      id: crypto.randomUUID(),
    };
    setClients((prev) => [...prev, newClient]);
  }, []);

  const updateClient = useCallback((id: string, updates: Partial<Client>) => {
    setClients((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updates } : c))
    );
  }, []);

  const deleteClient = useCallback((id: string) => {
    setClients((prev) => prev.filter((c) => c.id !== id));
    setRevenueEntries((prev) => prev.filter((e) => e.clientId !== id));
  }, []);


  const addRevenueEntry = useCallback((entry: Omit<RevenueEntry, 'id'>) => {
    setRevenueEntries((prev) => [
      ...prev,
      { ...entry, id: crypto.randomUUID() },
    ]);
  }, []);

  const updateRevenueEntry = useCallback((id: string, updates: Partial<RevenueEntry>) => {
    setRevenueEntries((prev) =>
      prev.map((e) => (e.id === id ? { ...e, ...updates } : e))
    );
  }, []);

  const deleteRevenueEntry = useCallback((id: string) => {
    setRevenueEntries((prev) => prev.filter((e) => e.id !== id));
  }, []);

  const addTaxReminder = useCallback((reminder: Omit<TaxReminder, 'id'>) => {
    setTaxReminders((prev) => [...prev, { ...reminder, id: crypto.randomUUID() }]);
  }, []);

  const updateTaxReminder = useCallback((id: string, updates: Partial<TaxReminder>) => {
    setTaxReminders((prev) =>
      prev.map((r) => (r.id === id ? { ...r, ...updates } : r))
    );
  }, []);

  const deleteTaxReminder = useCallback((id: string) => {
    setTaxReminders((prev) => prev.filter((r) => r.id !== id));
  }, []);

  const addRecurringReminder = useCallback((reminder: Omit<RecurringReminder, 'id'>) => {
    setRecurringReminders((prev) => [...prev, { ...reminder, id: crypto.randomUUID() }]);
  }, []);

  const updateRecurringReminder = useCallback((id: string, updates: Partial<RecurringReminder>) => {
    setRecurringReminders((prev) =>
      prev.map((r) => (r.id === id ? { ...r, ...updates } : r))
    );
  }, []);

  const deleteRecurringReminder = useCallback((id: string) => {
    setRecurringReminders((prev) => prev.filter((r) => r.id !== id));
    setRecurringPayments((prev) => prev.filter((p) => p.reminderId !== id));
  }, []);

  const addRecurringPayment = useCallback((payment: Omit<RecurringPayment, 'id'>) => {
    setRecurringPayments((prev) => [...prev, { ...payment, id: crypto.randomUUID() }]);
  }, []);

  const deleteRecurringPayment = useCallback((id: string) => {
    setRecurringPayments((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const addOneOffExpense = useCallback((expense: Omit<OneOffExpense, 'id'>) => {
    setOneOffExpenses((prev) => [...prev, { ...expense, id: crypto.randomUUID() }]);
  }, []);

  const updateOneOffExpense = useCallback((id: string, updates: Partial<OneOffExpense>) => {
    setOneOffExpenses((prev) =>
      prev.map((e) => (e.id === id ? { ...e, ...updates } : e))
    );
  }, []);

  const deleteOneOffExpense = useCallback((id: string) => {
    setOneOffExpenses((prev) => prev.filter((e) => e.id !== id));
  }, []);

  const addOneOffRevenue = useCallback((revenue: Omit<OneOffRevenue, 'id'>) => {
    setOneOffRevenues((prev) => [...prev, { ...revenue, id: crypto.randomUUID() }]);
  }, []);

  const updateOneOffRevenue = useCallback((id: string, updates: Partial<OneOffRevenue>) => {
    setOneOffRevenues((prev) =>
      prev.map((e) => (e.id === id ? { ...e, ...updates } : e))
    );
  }, []);

  const deleteOneOffRevenue = useCallback((id: string) => {
    setOneOffRevenues((prev) => prev.filter((e) => e.id !== id));
  }, []);

  const exportData = useCallback(
    async (password: string) => {
      await downloadEncryptedExport(
        tasks,
        clients,
        revenueEntries,
        settings,
        valuesHidden,
        password,
        taxReminders,
        recurringReminders,
        recurringPayments,
        oneOffExpenses,
        oneOffRevenues
      );
    },
    [
      tasks,
      clients,
      revenueEntries,
      settings,
      valuesHidden,
      taxReminders,
      recurringReminders,
      recurringPayments,
      oneOffExpenses,
      oneOffRevenues,
    ]
  );

  const applyImport = useCallback((result: ImportResult) => {
    setTasks(result.tasks.map((t) => ({ ...t, clientId: t.clientId || '' })));
    setClients(result.clients.map((c) => ({ ...c, type: c.type ?? 'hourly' })));
    setRevenueEntries(result.revenueEntries);
    setSettings(result.settings);
    setValuesHidden(result.valuesHidden);
    setTaxReminders(result.taxReminders ?? []);
    setRecurringReminders(result.recurringReminders ?? []);
    setRecurringPayments(result.recurringPayments ?? []);
    setOneOffExpenses(result.oneOffExpenses ?? []);
    setOneOffRevenues(result.oneOffRevenues ?? []);
  }, []);

  const value: HoursAppContextValue = {
    tasks,
    clients,
    revenueEntries,
    settings,
    valuesHidden,
    taxReminders,
    recurringReminders,
    recurringPayments,
    oneOffExpenses,
    oneOffRevenues,
    toggleValuesVisibility,
    addTask,
    updateTask,
    deleteTask,
    addClient,
    updateClient,
    deleteClient,
    addRevenueEntry,
    updateRevenueEntry,
    deleteRevenueEntry,
    addTaxReminder,
    updateTaxReminder,
    deleteTaxReminder,
    addRecurringReminder,
    updateRecurringReminder,
    deleteRecurringReminder,
    addRecurringPayment,
    deleteRecurringPayment,
    addOneOffExpense,
    updateOneOffExpense,
    deleteOneOffExpense,
    addOneOffRevenue,
    updateOneOffRevenue,
    deleteOneOffRevenue,
    exportData,
    applyImport,
  };

  return (
    <HoursAppContext.Provider value={value}>
      {children}
    </HoursAppContext.Provider>
  );
}

export function useHoursApp() {
  const ctx = useContext(HoursAppContext);
  if (!ctx) throw new Error('useHoursApp must be used within HoursAppProvider');
  return ctx;
}
