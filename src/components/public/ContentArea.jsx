import { useContext } from 'react';
import { CardContext } from './CardContext';

export default function ContentArea({ children }) {

  return (
    <>
      <CardContext.Provider value={{data}}>
        {children}
      </CardContext.Provider>
    </>
  );
}