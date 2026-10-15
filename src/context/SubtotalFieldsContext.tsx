import { DepositeTypes } from "@/types/api.requests.type";
import { PaymentMethods, type Vat } from "@/types/api.responses.type";
import { createContext, useContext, useState, type ReactNode } from "react";

// 1. Define the type for the Context Value
interface SubtotalFieldsContextType {
  vat: Vat | undefined;
  setVat: (vat: Vat | undefined) => void;
  paymentMethod: PaymentMethods | undefined;
  setPaymentMethod: (method: PaymentMethods | undefined) => void;
  depositPercentage: number | undefined;
  setDepositPercentage: (pct: number | undefined) => void;
  depositAmount: number | undefined;
  setDepositAmount: (amt: number | undefined) => void;
  depositType: DepositeTypes | undefined;
  setDepositType: (type: DepositeTypes | undefined) => void;
  discount: number | undefined;
  setDiscount: (discount: number | undefined) => void;
  calculatedDeposit: number | undefined;
  setCalculatedDeposit: (amt: number | undefined) => void;
  creditAmount: number | undefined;
  setCreditAmount: (amt: number | undefined) => void;
}

// 2. Create the Context with an undefined default value
const SubtotalFieldsContext = createContext<
  SubtotalFieldsContextType | undefined
>(undefined);

// 3. Create the Provider Component
export function SubtotalFieldsProvider({ children }: { children: ReactNode }) {
  const [vat, setVat] = useState<Vat | undefined>(undefined);
  const [paymentMethod, setPaymentMethod] = useState<
    PaymentMethods | undefined
  >(undefined);
  const [depositPercentage, setDepositPercentage] = useState<
    number | undefined
  >(undefined);
  const [depositAmount, setDepositAmount] = useState<number | undefined>(
    undefined,
  );
  const [depositType, setDepositType] = useState<DepositeTypes | undefined>(
    undefined,
  );
  const [discount, setDiscount] = useState<number | undefined>(undefined);
  const [calculatedDeposit, setCalculatedDeposit] = useState<
    number | undefined
  >(undefined);
  const [creditAmount, setCreditAmount] = useState<number | undefined>(
    undefined,
  );

  return (
    <SubtotalFieldsContext.Provider
      value={{
        vat,
        setVat,
        paymentMethod,
        setPaymentMethod,
        depositPercentage,
        setDepositPercentage,
        depositAmount,
        setDepositAmount,
        depositType,
        setDepositType,
        discount,
        setDiscount,
        calculatedDeposit,
        setCalculatedDeposit,
        creditAmount,
        setCreditAmount,
      }}
    >
      {children}
    </SubtotalFieldsContext.Provider>
  );
}

// 4. Create the Custom Hook to use this Context
export function useSubtotalFields() {
  const context = useContext(SubtotalFieldsContext);

  if (context === undefined) {
    throw new Error(
      "useSubtotalFields must be used within a SubtotalFieldsProvider",
    );
  }

  return context;
}
