import { Paper } from "@mui/material";
import styled from "styled-components";

export const DashboardContainer = styled.div`
  background: linear-gradient(135deg, #6a11cb, #2575fc);
  color: white;
  min-height: 100vh;
  padding: 24px;
`;

export const DashboardCard = styled(Paper)`
  text-align: center;
  padding: 24px;
  border-radius: 12px;
  color: #333;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  height: 200px;
  width: 200px;
  background: rgba(255, 255, 255, 0.2); // Fundo translúcido
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2); // Sombra
  backdrop-filter: blur(10px); // Desfoque no fundo
  border: 1px solid rgba(255, 255, 255, 0.3); // Borda semi-transparente
  transition: transform 0.3s ease, box-shadow 0.3s ease; // Transições suaves
`;

export const IconContainer = styled.div`
  background-color: #2575fc;
  color: white;
  padding: 16px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
`;

export const CalendarContainer = styled(Paper)`
  margin-top: 32px;
  padding: 24px;
  border-radius: 12px;
  background: white;
  color: #333;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`;
