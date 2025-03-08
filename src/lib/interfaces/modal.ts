import { ReactNode } from "react";

export interface ModalConfirmationProps {
  children: ReactNode;
  buttonContent: ReactNode | string;
  confirm: () => void;
  row?: any;
}
