export default interface ICartProps {
  states: {
    openSummary: boolean;
    setOpenSummary: React.Dispatch<React.SetStateAction<boolean>>;
    openBackdrop: boolean;
    setOpenBackdrop: React.Dispatch<React.SetStateAction<boolean>>;
  };

  crewData: {
    crewCredential: string;
    setCrewCredential: React.Dispatch<React.SetStateAction<string>>;
    openCrewAuthAlertDialog: boolean;
    setOpenCrewAuthAlertDialog: React.Dispatch<React.SetStateAction<boolean>>;
    errorCrewCredential: boolean;
    setErrorCrewCredential: React.Dispatch<React.SetStateAction<boolean>>;
    errorUnauthorizedCrew: boolean;
    setErrorUnauthorizedCrew: React.Dispatch<React.SetStateAction<boolean>>;
    isLoadingSubmitCrewCredential: boolean;
    setIsLoadingSubmitCrewCredential: React.Dispatch<React.SetStateAction<boolean>>;
  };

  unpaidReports: {
    reports: any[];
    reportsRefetch: () => void;
  };

  receiptData: {
    openReceiptModal: boolean;
    setReceiptModal: React.Dispatch<React.SetStateAction<boolean>>;
    paymentData: any;
    setPaymentData: React.Dispatch<React.SetStateAction<any>>;
  };
}
