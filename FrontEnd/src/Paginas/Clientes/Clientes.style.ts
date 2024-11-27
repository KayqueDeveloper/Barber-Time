import { Box } from "@mui/material";
import styled from "styled-components";

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
