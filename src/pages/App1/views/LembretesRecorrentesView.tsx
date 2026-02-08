import { useState } from 'react';
import { useHoursApp } from '../../../providers/HoursAppProvider';
import { ReminderForm } from '../components/ReminderForm';
import { LembretesRecorrentesTable } from '../components/LembretesRecorrentesTable';
import * as S from './ImpostosView.styles';

export function LembretesRecorrentesView() {
  const {
    recurringReminders,
    recurringPayments,
    valuesHidden,
    addRecurringReminder,
    updateRecurringReminder,
    addRecurringPayment,
    deleteRecurringReminder,
  } = useHoursApp();

  const now = new Date();
  const monthStr = String(now.getMonth() + 1).padStart(2, '0');
  const defaultDate = `${now.getFullYear()}-${monthStr}-01`;

  const [showReminderForm, setShowReminderForm] = useState(false);

  return (
    <>
      <S.ActionsSection>
        <S.ActionButton type="button" onClick={() => setShowReminderForm(true)}>
          + Novo lembrete
        </S.ActionButton>
      </S.ActionsSection>
      <LembretesRecorrentesTable
        recurringReminders={recurringReminders}
        recurringPayments={recurringPayments}
        valuesHidden={valuesHidden}
        onUpdateRecurringReminder={updateRecurringReminder}
        onAddRecurringPayment={addRecurringPayment}
        onDeleteRecurringReminder={deleteRecurringReminder}
      />
      {showReminderForm && (
        <S.ModalOverlay onClick={() => setShowReminderForm(false)}>
          <S.ModalContent onClick={(e) => e.stopPropagation()}>
            <S.ModalHeader>
              <S.ModalTitle>Novo lembrete recorrente</S.ModalTitle>
              <S.ModalClose type="button" onClick={() => setShowReminderForm(false)} aria-label="Fechar">
                ✕
              </S.ModalClose>
            </S.ModalHeader>
            <ReminderForm
              defaultDate={defaultDate}
              mode="recurring"
              onSaveParcel={() => {}}
              onSaveRecurring={(r) => {
                addRecurringReminder(r);
                setShowReminderForm(false);
              }}
              onCancel={() => setShowReminderForm(false)}
            />
          </S.ModalContent>
        </S.ModalOverlay>
      )}
    </>
  );
}
