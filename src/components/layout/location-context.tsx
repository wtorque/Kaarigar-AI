"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

interface LocationContextType {
  city: string;
  state: string;
  pincode: string;
  setLocation: (city: string, state: string, pincode?: string) => void;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export function LocationProvider({ children }: { children: ReactNode }) {
  const [city, setCity] = useState("Bhopal");
  const [state, setState] = useState("MP");
  const [pincode, setPincode] = useState("462016");

  const setLocation = (newCity: string, newState: string, newPincode = "462001") => {
    setCity(newCity);
    setState(newState);
    setPincode(newPincode);
  };

  return (
    <LocationContext.Provider value={{ city, state, pincode, setLocation }}>
      {children}
    </LocationContext.Provider>
  );
}

export function useLocation() {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error("useLocation must be used within a LocationProvider");
  }
  return context;
}
