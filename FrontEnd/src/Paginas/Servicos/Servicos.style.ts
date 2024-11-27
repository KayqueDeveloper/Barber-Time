import { Box, Button } from "@mui/material";
import styled from "styled-components";

export const CardContainer = styled.div`
  border-radius: 12px;
  box-shadow: 10px 10px 10px rgba(0, 0, 0, 0.3);
  background-color: #fff;
  padding: 16px;
`;

export const BotaoAdd = styled(Button)`
  height: 56px;
  border-radius: 8px;
`;

export const ModalBox = styled(Box)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 400px;
  max-height: 80vh;
  overflow: auto;
  background-color: whitesmoke;
  box-shadow: 24;
  padding: 20px;
  border-radius: 4px;
`;
