import { useState } from 'react';
import { useHoursApp } from '../../../providers/HoursAppProvider';
import { OneOffRevenueForm } from '../components/OneOffRevenueForm';
import { ReceitasAvulsasTable } from '../components/ReceitasAvulsasTable';
import * as S from './ImpostosView.styles';

export function ReceitasAvulsasView() {
  const {
    oneOffRevenues,
    valuesHidden,
    addOneOffRevenue,
    updateOneOffRevenue,
    deleteOneOffRevenue,
  } = useHoursApp();

  const now = new Date();
  const monthStr = String(now.getMonth() + 1).padStart(2, '0');
  const defaultDate = `${now.getFullYear()}-${monthStr}-01`;

  const [showRevenueForm, setShowRevenueForm] = useState(false);

  return (
    <>
      <S.ActionsSection>
        <S.ActionButton type="button" onClick={() => setShowRevenueForm(true)}>
          + Receita avulsa
        </S.ActionButton>
      </S.ActionsSection>
      <ReceitasAvulsasTable
        oneOffRevenues={oneOffRevenues}
        valuesHidden={valuesHidden}
        onUpdateOneOffRevenue={updateOneOffRevenue}
        onDeleteOneOffRevenue={deleteOneOffRevenue}
      />
      {showRevenueForm && (
        <S.ModalOverlay onClick={() => setShowRevenueForm(false)}>
          <S.ModalContent onClick={(e) => e.stopPropagation()}>
            <S.ModalHeader>
              <S.ModalTitle>Receita avulsa</S.ModalTitle>
              <S.ModalClose type="button" onClick={() => setShowRevenueForm(false)} aria-label="Fechar">
                ✕
              </S.ModalClose>
            </S.ModalHeader>
            <OneOffRevenueForm
              defaultDate={defaultDate}
              onSave={(r) => {
                addOneOffRevenue(r);
                setShowRevenueForm(false);
              }}
              onCancel={() => setShowRevenueForm(false)}
            />
          </S.ModalContent>
        </S.ModalOverlay>
      )}
    </>
  );
}
