import type {
  Task,
  Client,
  AppSettings,
  ExportData,
  RevenueEntry,
  EncryptedExportPayload,
} from '../types/hoursApp';

const TASKS_KEY = 'hours-app-tasks';
const CLIENTS_KEY = 'hours-app-clients';
const REVENUE_KEY = 'hours-app-revenue';
const SETTINGS_KEY = 'hours-app-settings';
const VALUES_HIDDEN_KEY = 'hours-app-values-hidden';
const EXPORT_VERSION = 4;
const ENCRYPTED_FORMAT = 'hours-app-encrypted';
const PBKDF2_ITERATIONS = 250000;
const SALT_LENGTH = 16;
const IV_LENGTH = 12;
const KEY_LENGTH = 256;

function base64encode(data: Uint8Array | ArrayBuffer): string {
  const arr = data instanceof Uint8Array ? data : new Uint8Array(data);
  return btoa(String.fromCharCode(...arr));
}

function base64decode(str: string): Uint8Array {
  return new Uint8Array(
    atob(str)
      .split('')
      .map((c) => c.charCodeAt(0))
  );
}

async function deriveKey(password: string, salt: Uint8Array): Promise<CryptoKey> {
  const encoder = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    encoder.encode(password),
    'PBKDF2',
    false,
    ['deriveBits', 'deriveKey']
  );
  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: salt as unknown as BufferSource,
      iterations: PBKDF2_ITERATIONS,
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: 'AES-GCM', length: KEY_LENGTH },
    false,
    ['encrypt', 'decrypt']
  );
}

async function encryptPayload(
  json: string,
  password: string
): Promise<EncryptedExportPayload> {
  const salt = crypto.getRandomValues(new Uint8Array(SALT_LENGTH));
  const iv = crypto.getRandomValues(new Uint8Array(IV_LENGTH));
  const key = await deriveKey(password, salt);

  const encoded = new TextEncoder().encode(json);
  const ciphertext = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv, tagLength: 128 },
    key,
    encoded
  );

  return {
    format: ENCRYPTED_FORMAT,
    version: EXPORT_VERSION,
    salt: base64encode(salt),
    iv: base64encode(iv),
    data: base64encode(new Uint8Array(ciphertext)),
  };
}

async function decryptPayload(
  payload: EncryptedExportPayload,
  password: string
): Promise<string> {
  const salt = base64decode(payload.salt);
  const iv = base64decode(payload.iv);
  const ciphertext = base64decode(payload.data);
  const key = await deriveKey(password, salt);

  const decrypted = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv: iv as BufferSource, tagLength: 128 },
    key,
    ciphertext as BufferSource
  );
  return new TextDecoder().decode(decrypted);
}

export function loadValuesHidden(): boolean {
  try {
    return localStorage.getItem(VALUES_HIDDEN_KEY) === 'true';
  } catch {
    return false;
  }
}

export function saveValuesHidden(hidden: boolean): void {
  localStorage.setItem(VALUES_HIDDEN_KEY, String(hidden));
}

export function loadTasks(): Task[] {
  try {
    const data = localStorage.getItem(TASKS_KEY);
    const parsed = data ? JSON.parse(data) : [];
    const tasks = Array.isArray(parsed) ? parsed : [];
    return tasks.map((t: Record<string, unknown>) => ({
      ...t,
      id: t.id ?? crypto.randomUUID(),
      date: t.date ?? '',
      description: t.description ?? '',
      startTime: t.startTime ?? '00:00',
      endTime: t.endTime ?? '00:00',
      isIsolated: Boolean(t.isIsolated),
      clientId: t.clientId ?? '',
    })) as Task[];
  } catch {
    return [];
  }
}

export function saveTasks(tasks: Task[]): void {
  localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
}

export function loadClients(): Client[] {
  try {
    const data = localStorage.getItem(CLIENTS_KEY);
    const parsed = data ? JSON.parse(data) : [];
    const clients = Array.isArray(parsed) ? parsed : [];
    return clients.map((c: Record<string, unknown>) => ({
      id: c.id ?? crypto.randomUUID(),
      name: c.name ?? '',
      type: (c.type as string) === 'fixed_monthly' ? 'fixed_monthly' : 'hourly',
      hourlyRate: Number(c.hourlyRate) || 0,
    })) as Client[];
  } catch {
    return [];
  }
}

export function saveClients(clients: Client[]): void {
  localStorage.setItem(CLIENTS_KEY, JSON.stringify(clients));
}

export function loadRevenueEntries(): RevenueEntry[] {
  try {
    const data = localStorage.getItem(REVENUE_KEY);
    const parsed = data ? JSON.parse(data) : [];
    const entries = Array.isArray(parsed) ? parsed : [];
    return entries.map((e: Record<string, unknown>) => ({
      ...e,
      id: e.id ?? crypto.randomUUID(),
      clientId: e.clientId ?? '',
      date: e.date ?? '',
      value: Number(e.value) || 0,
      description: (e.description as string) ?? '',
    })) as RevenueEntry[];
  } catch {
    return [];
  }
}

export function saveRevenueEntries(entries: RevenueEntry[]): void {
  localStorage.setItem(REVENUE_KEY, JSON.stringify(entries));
}

export function loadSettings(): AppSettings {
  try {
    const data = localStorage.getItem(SETTINGS_KEY);
    return data ? JSON.parse(data) : { hourlyRate: 0 };
  } catch {
    return { hourlyRate: 0 };
  }
}

export function saveSettings(settings: AppSettings): void {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

/**
 * Converte um horário "HH:MM" ou "HH:MM:SS" para minutos totais.
 */
function timeToMinutes(time: string): number {
  const parts = time.split(':').map(Number);
  const [h, m, s = 0] = parts;
  return (h ?? 0) * 60 + (m ?? 0) + (s ?? 0) / 60;
}

export function calculateHours(startTime: string, endTime: string): number {
  const startMinutes = timeToMinutes(startTime);
  const endMinutes = timeToMinutes(endTime);
  const diffMinutes = endMinutes - startMinutes;
  return Math.max(0, diffMinutes / 60);
}

/**
 * Soma as horas de várias tarefas somando em minutos primeiro,
 * evitando erros de ponto flutuante na acumulação.
 */
export function calculateTotalHours(
  tasks: { startTime: string; endTime: string }[]
): number {
  const totalMinutes = tasks.reduce((acc, t) => {
    const start = timeToMinutes(t.startTime);
    const end = timeToMinutes(t.endTime);
    return acc + Math.max(0, end - start);
  }, 0);
  return totalMinutes / 60;
}

/**
 * Formata horas decimais para exibição no formato H.MM (ex: 8.27 = 8h 27min).
 * A parte decimal representa minutos, não fração da hora.
 */
export function formatHoursDisplay(decimalHours: number): string {
  const totalMinutes = Math.round(decimalHours * 60);
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  return `${h}.${String(m).padStart(2, '0')}`;
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

export const MASKED_CURRENCY = 'R$ ••••';
export const MASKED_HOURS = '••••';

export function buildExportData(
  tasks: Task[],
  clients: Client[],
  revenueEntries: RevenueEntry[],
  settings: AppSettings,
  valuesHidden: boolean
): ExportData {
  return {
    version: EXPORT_VERSION,
    exportedAt: new Date().toISOString(),
    tasks,
    clients,
    revenueEntries,
    settings,
    valuesHidden,
  };
}

export function exportToJson(
  tasks: Task[],
  clients: Client[],
  revenueEntries: RevenueEntry[],
  settings: AppSettings,
  valuesHidden: boolean
): string {
  const data = buildExportData(tasks, clients, revenueEntries, settings, valuesHidden);
  return JSON.stringify(data, null, 2);
}

export async function downloadEncryptedExport(
  tasks: Task[],
  clients: Client[],
  revenueEntries: RevenueEntry[],
  settings: AppSettings,
  valuesHidden: boolean,
  password: string
): Promise<void> {
  const data = buildExportData(tasks, clients, revenueEntries, settings, valuesHidden);
  const json = JSON.stringify(data);
  const payload = await encryptPayload(json, password);
  const blob = new Blob([JSON.stringify(payload, null, 2)], {
    type: 'application/json',
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `horas-backup-${new Date().toISOString().slice(0, 10)}.json`;
  a.style.display = 'none';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 100);
}

export interface ImportResult {
  tasks: Task[];
  clients: Client[];
  revenueEntries: RevenueEntry[];
  settings: AppSettings;
  valuesHidden: boolean;
}

function parseExportData(parsed: ExportData & Record<string, unknown>): ImportResult {
  if (!parsed.tasks || !Array.isArray(parsed.tasks)) {
    throw new Error('Formato inválido: tasks não encontrado');
  }
  const tasks: Task[] = parsed.tasks.map((t: unknown) => {
    const obj = t as Record<string, unknown>;
    return {
      id: (obj.id as string) ?? crypto.randomUUID(),
      date: (obj.date as string) ?? '',
      description: (obj.description as string) ?? '',
      startTime: (obj.startTime as string) ?? '00:00',
      endTime: (obj.endTime as string) ?? '00:00',
      isIsolated: Boolean(obj.isIsolated),
      clientId: (obj.clientId as string) ?? '',
    };
  });
  const clients: Client[] = Array.isArray(parsed.clients)
    ? parsed.clients.map((c: unknown) => {
        const obj = c as Record<string, unknown>;
        return {
          id: (obj.id as string) ?? crypto.randomUUID(),
          name: (obj.name as string) ?? '',
          type: obj.type === 'fixed_monthly' ? 'fixed_monthly' : 'hourly',
          hourlyRate: Number(obj.hourlyRate) || 0,
        };
      })
    : [];
  const revenueEntries: RevenueEntry[] = Array.isArray(parsed.revenueEntries)
    ? parsed.revenueEntries.map((e: unknown) => {
        const obj = e as Record<string, unknown>;
        return {
          id: (obj.id as string) ?? crypto.randomUUID(),
          clientId: (obj.clientId as string) ?? '',
          date: (obj.date as string) ?? '',
          value: Number(obj.value) || 0,
          description: (obj.description as string) ?? '',
        };
      })
    : [];
  const settings: AppSettings = parsed.settings
    ? { hourlyRate: Number(parsed.settings.hourlyRate) || 0 }
    : { hourlyRate: 0 };
  const valuesHidden = Boolean(parsed.valuesHidden);
  return { tasks, clients, revenueEntries, settings, valuesHidden };
}

export async function importFromFile(
  file: File,
  password?: string
): Promise<ImportResult> {
  const raw = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error('Erro ao ler arquivo'));
    reader.readAsText(file);
  });
  return importFromRaw(raw, password);
}

export async function importFromRaw(
  raw: string,
  password?: string
): Promise<ImportResult> {
  const parsed = JSON.parse(raw) as EncryptedExportPayload | ExportData;

  if (
    typeof parsed === 'object' &&
    parsed !== null &&
    'format' in parsed &&
    parsed.format === ENCRYPTED_FORMAT
  ) {
    if (!password || password.trim() === '') {
      throw new Error('Arquivo criptografado: senha obrigatória');
    }
    const json = await decryptPayload(parsed as EncryptedExportPayload, password);
    const data = JSON.parse(json) as ExportData & Record<string, unknown>;
    return parseExportData(data);
  }

  return parseExportData(parsed as ExportData & Record<string, unknown>);
}

export function isEncryptedExport(raw: string): boolean {
  try {
    const parsed = JSON.parse(raw) as { format?: string };
    return parsed?.format === ENCRYPTED_FORMAT;
  } catch {
    return false;
  }
}
