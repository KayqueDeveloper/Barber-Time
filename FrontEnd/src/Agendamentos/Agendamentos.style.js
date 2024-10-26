import styled from "styled-components";

export const ModalStyle = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 400px;
  background-color: white;
  box-shadow: 24px;
  padding: 16px;
`;

export const formulario = styled.form`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const AgendamentoDetalhes = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const labels = styled.div`
  display: flex;
  flex-direction: row;
  whidth: 100%;
`;

export const BotoesModal = styled.div`
  display: flex;
  flex-direction: row;
  gap: 12px;
`;
