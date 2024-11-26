import styled from "styled-components";

export const ModalStyle = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 90%;
  max-width: 500px;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export const formulario = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

export const AgendamentoDetalhes = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const labels = styled.div`
  font-size: 16px;
  font-weight: bold;
  color: #333;
`;

export const BotoesModal = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;

  button {
    border-radius: 5px;
    text-transform: uppercase;
  }
`;

export const CalendarContainer = styled.div`
  margin: 20px auto;
  padding: 20px;
  background: #fdfdfd;
  border-radius: 15px;
  box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.1);
  max-width: 90%;
`;

export const CalendarWrapper = styled.div`
  .rbc-calendar {
    background-color: #ffffff;
    border-radius: 10px;
    padding: 10px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  }

  .rbc-toolbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    background: #f5f5f5;
    padding: 10px 15px;
    border-radius: 8px;

    & button {
      background: #007bff;
      color: white;
      border: none;
      padding: 8px 12px;
      border-radius: 5px;
      font-size: 14px;
      cursor: pointer;

      &:hover {
        background: #0056b3;
      }
    }
  }

  .rbc-event {
    background-color: #007bff;
    border-radius: 5px;
    color: #fff;
    padding: 5px;
    font-size: 14px;
    text-align: center;
  }

  .rbc-selected {
    background-color: #0056b3 !important;
  }

  .rbc-day-slot {
    border: 1px solid #e0e0e0;
  }

  .rbc-today {
    background: rgba(0, 123, 255, 0.1);
  }

  .rbc-timeslot-group {
    border-color: #eaeaea;
  }
`;
