import { useState } from 'react';
import { useHoursApp } from '../../../providers/HoursAppProvider';
import { ReminderForm } from '../components/ReminderForm';
import { ContasAPagarTable } from '../components/ContasAPagarTable';
import * as S from './ImpostosView.styles';

export function ContasAPagarView() {
  const {
    taxReminders,
    valuesHidden,
    addTaxReminder,
    updateTaxReminder,
    deleteTaxReminder,
  } = useHoursApp();

  const now = new Date();
  const monthStr = String(now.getMonth() + 1).padStart(2, '0');
  const defaultDate = `${now.getFullYear()}-${monthStr}-01`;

  const [showReminderForm, setShowReminderForm] = useState(false);

  return (
    <>
      <S.ActionsSection>
        <S.ActionButton type="button" onClick={() => setShowReminderForm(true)}>
          + Nova conta
        </S.ActionButton>
      </S.ActionsSection>
      <ContasAPagarTable
        taxReminders={taxReminders}
        valuesHidden={valuesHidden}
        onUpdateTaxReminder={updateTaxReminder}
        onDeleteTaxReminder={deleteTaxReminder}
      />
      {showReminderForm && (
        <S.ModalOverlay onClick={() => setShowReminderForm(false)}>
          <S.ModalContent onClick={(e) => e.stopPropagation()}>
            <S.ModalHeader>
              <S.ModalTitle>Nova conta</S.ModalTitle>
              <S.ModalClose type="button" onClick={() => setShowReminderForm(false)} aria-label="Fechar">
                ✕
              </S.ModalClose>
            </S.ModalHeader>
            <ReminderForm
              defaultDate={defaultDate}
              mode="parcel"
              onSaveParcel={(r) => {
                addTaxReminder(r);
                setShowReminderForm(false);
              }}
              onSaveRecurring={() => {}}
              onCancel={() => setShowReminderForm(false)}
            />
          </S.ModalContent>
        </S.ModalOverlay>
      )}
    </>
  );
}
