export type ClientType = 'hourly' | 'fixed_monthly';

export interface Client {
  id: string;
  name: string;
  type: ClientType;
  hourlyRate: number;
}

export interface Task {
  id: string;
  date: string;
  description: string;
  startTime: string;
  endTime: string;
  isIsolated: boolean;
  clientId: string;
}

export interface RevenueEntry {
  id: string;
  clientId: string;
  date: string;
  value: number;
  description?: string;
}

export interface AppSettings {
  hourlyRate: number;
}

export type TaxReminderSource =
  | 'PGFN'
  | 'Prefeitura'
  | 'Receita Federal'
  | 'Cartão de crédito';

export interface TaxReminder {
  id: string;
  type: 'parcel';
  source: TaxReminderSource | string;
  dueDate: string;
  amount: number;
  description: string;
  paidAt?: string;
  paidAmount?: number;
}

export interface RecurringReminder {
  id: string;
  type: 'recurring';
  source: string;
  dayOfMonth: number;
  description: string;
  amount?: number;
}

export interface RecurringPayment {
  id: string;
  reminderId: string;
  month: string;
  paidAt: string;
  paidAmount: number;
}

export interface OneOffExpense {
  id: string;
  date: string;
  amount: number;
  description: string;
}

export type OneOffRevenueType = 'TED' | 'PIX';

export interface OneOffRevenue {
  id: string;
  date: string;
  amount: number;
  description: string;
  transferType: OneOffRevenueType;
}

export interface ExportData {
  version: number;
  exportedAt: string;
  tasks: Task[];
  clients: Client[];
  revenueEntries: RevenueEntry[];
  settings: AppSettings;
  valuesHidden?: boolean;
  taxReminders?: TaxReminder[];
  recurringReminders?: RecurringReminder[];
  recurringPayments?: RecurringPayment[];
  oneOffExpenses?: OneOffExpense[];
  oneOffRevenues?: OneOffRevenue[];
}

export interface EncryptedExportPayload {
  format: 'hours-app-encrypted';
  version: number;
  salt: string;
  iv: string;
  data: string;
}
