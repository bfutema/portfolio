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

export interface ExportData {
  version: number;
  exportedAt: string;
  tasks: Task[];
  clients: Client[];
  revenueEntries: RevenueEntry[];
  settings: AppSettings;
  valuesHidden?: boolean;
}

export interface EncryptedExportPayload {
  format: 'hours-app-encrypted';
  version: number;
  salt: string;
  iv: string;
  data: string;
}
