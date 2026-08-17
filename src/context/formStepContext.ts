import {
  createContext,
  useContext,
  useState,
  type ReactNode,
  createElement,
} from "react";

interface FormContextType {
  currentStep: number;
  nextStep: () => void;
}

const FormContext = createContext<FormContextType | undefined>(undefined);

export function FormProvider({ children }: { children: ReactNode }) {
  const [currentStep, setCurrentStep] = useState(1);

  const nextStep = () => setCurrentStep((prev) => prev + 1);

  const value: FormContextType = {
    currentStep,
    nextStep,
  };

  return createElement(FormContext.Provider, { value }, children);
}

export function useFormContext() {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error("useFormContext must be used within FormProvider");
  }
  return context;
}
