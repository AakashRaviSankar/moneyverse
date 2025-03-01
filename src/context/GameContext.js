import React, {createContext, useState} from 'react';
import {storeData} from '../utils/storage';

export const GameContext = createContext();

export const GameProvider = ({children}) => {
  const [balance, setBalance] = useState(0.0);
  const [isMathLocked, setMathLocked] = useState(false);
  const [isSpinnerLocked, setSpinnerLocked] = useState(false);
  const [isLinkLocked, setLinkLocked] = useState(false);

  const updateBalance = amount => {
    setBalance(amount);
    storeData('wallet', amount);
  };

  return (
    <GameContext.Provider
      value={{
        balance,
        updateBalance,
        isMathLocked,
        setMathLocked,
        isSpinnerLocked,
        setSpinnerLocked,
        isLinkLocked,
        setLinkLocked,
      }}>
      {children}
    </GameContext.Provider>
  );
};
