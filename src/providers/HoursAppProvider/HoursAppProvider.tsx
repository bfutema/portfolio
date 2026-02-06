import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from 'react';
import type { Task, Client, AppSettings, RevenueEntry } from '../../types/hoursApp';
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
  downloadEncryptedExport,
  type ImportResult,
} from '../../utils/hoursStorage';

interface HoursAppContextValue {
  tasks: Task[];
  clients: Client[];
  revenueEntries: RevenueEntry[];
  settings: AppSettings;
  valuesHidden: boolean;
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

  const exportData = useCallback(
    async (password: string) => {
      await downloadEncryptedExport(
        tasks,
        clients,
        revenueEntries,
        settings,
        valuesHidden,
        password
      );
    },
    [tasks, clients, revenueEntries, settings, valuesHidden]
  );

  const applyImport = useCallback(
    (result: ImportResult) => {
      setTasks(result.tasks.map((t) => ({ ...t, clientId: t.clientId || '' })));
      setClients(result.clients.map((c) => ({ ...c, type: c.type ?? 'hourly' })));
      setRevenueEntries(result.revenueEntries);
      setSettings(result.settings);
      setValuesHidden(result.valuesHidden);
    },
    []
  );

  const value: HoursAppContextValue = {
    tasks,
    clients,
    revenueEntries,
    settings,
    valuesHidden,
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
