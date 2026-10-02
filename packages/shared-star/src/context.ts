import { createContext, useContext } from "react";

export const ValueContext = createContext<string | null>(null);

export function useValue(): string | null {
	return useContext(ValueContext);
}
