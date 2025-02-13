export default interface ICartProps {
    actionData: {
        cardId: string;
        setCardId: React.Dispatch<React.SetStateAction<string>>;
        cardNumber: string;
        setCardNumber: React.Dispatch<React.SetStateAction<string>>;
        customerName: string;
        setCustomerName: React.Dispatch<React.SetStateAction<string>>;
        customerId: string;
        setCustomerId: React.Dispatch<React.SetStateAction<string>>;
        paymentMethod: string;
        setPaymentMethod: React.Dispatch<React.SetStateAction<string>>;
        note: string;
        setNote: React.Dispatch<React.SetStateAction<string>>;
        openBill: string;
        setOpenBill: React.Dispatch<React.SetStateAction<string>>;
    }

    orderData: {
        orders: any[];
        setOrders: React.Dispatch<React.SetStateAction<any[]>>;
    }

    states: {
        openSummary: boolean;
        setOpenSummary: React.Dispatch<React.SetStateAction<boolean>>;
        openBackdrop: boolean;
        setOpenBackdrop: React.Dispatch<React.SetStateAction<boolean>>;
    }

    crewData: {
        crewCredential: string;
        setCrewCredential: React.Dispatch<React.SetStateAction<string>>;
        openCrewAuthAlertDialog: boolean;
        setOpenCrewAuthAlertDialog: React.Dispatch<React.SetStateAction<boolean>>;
        errorCrewCredential: boolean;
        setErrorCrewCredential: React.Dispatch<React.SetStateAction<boolean>>;
        errorUnauthorizedCrew: boolean;
        setErrorUnauthorizedCrew: React.Dispatch<React.SetStateAction<boolean>>;
    }

    unpaidReports: {
        reports: any[];
        reportsRefetch: () => void;
    }

    calculationData: {
        totalOrder: number;
        setTotalOrder: React.Dispatch<React.SetStateAction<number>>;
        totalTaxService: number;
        setTotalTaxService: React.Dispatch<React.SetStateAction<number>>;
    }
}