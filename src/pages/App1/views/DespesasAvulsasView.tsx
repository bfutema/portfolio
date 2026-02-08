import { useState } from 'react';
import { useHoursApp } from '../../../providers/HoursAppProvider';
import { ExpenseForm } from '../components/ExpenseForm';
import { DespesasAvulsasTable } from '../components/DespesasAvulsasTable';
import * as S from './ImpostosView.styles';

export function DespesasAvulsasView() {
  const {
    oneOffExpenses,
    valuesHidden,
    addOneOffExpense,
    updateOneOffExpense,
    deleteOneOffExpense,
  } = useHoursApp();

  const now = new Date();
  const monthStr = String(now.getMonth() + 1).padStart(2, '0');
  const defaultDate = `${now.getFullYear()}-${monthStr}-01`;

  const [showExpenseForm, setShowExpenseForm] = useState(false);

  return (
    <>
      <S.ActionsSection>
        <S.ActionButton type="button" onClick={() => setShowExpenseForm(true)}>
          + Nova despesa
        </S.ActionButton>
      </S.ActionsSection>
      <DespesasAvulsasTable
        oneOffExpenses={oneOffExpenses}
        valuesHidden={valuesHidden}
        onUpdateOneOffExpense={updateOneOffExpense}
        onDeleteOneOffExpense={deleteOneOffExpense}
      />
      {showExpenseForm && (
        <S.ModalOverlay onClick={() => setShowExpenseForm(false)}>
          <S.ModalContent onClick={(e) => e.stopPropagation()}>
            <S.ModalHeader>
              <S.ModalTitle>Nova despesa</S.ModalTitle>
              <S.ModalClose type="button" onClick={() => setShowExpenseForm(false)} aria-label="Fechar">
                ✕
              </S.ModalClose>
            </S.ModalHeader>
            <ExpenseForm
              defaultDate={defaultDate}
              onSave={(exp) => {
                addOneOffExpense(exp);
                setShowExpenseForm(false);
              }}
              onCancel={() => setShowExpenseForm(false)}
            />
          </S.ModalContent>
        </S.ModalOverlay>
      )}
    </>
  );
}
