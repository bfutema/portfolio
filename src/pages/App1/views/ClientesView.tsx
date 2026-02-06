import { useHoursApp } from '../../../providers/HoursAppProvider';
import { ClientList } from '../components/ClientList';

export function ClientesView() {
  const {
    clients,
    revenueEntries,
    addClient,
    updateClient,
    deleteClient,
    addRevenueEntry,
    updateRevenueEntry,
    deleteRevenueEntry,
  } = useHoursApp();

  return (
    <ClientList
      clients={clients}
      revenueEntries={revenueEntries}
      onAdd={addClient}
      onUpdate={updateClient}
      onDelete={deleteClient}
      onAddRevenue={addRevenueEntry}
      onUpdateRevenue={updateRevenueEntry}
      onDeleteRevenue={deleteRevenueEntry}
    />
  );
}
