import { useContext } from 'react';
import { CardContext } from './CardContext';

export default function ContentArea({ children }) {
  const data = useContext(CardContext);
  return (
    <>
      <CardContext.Provider value={{data}}>
        {children}
      </CardContext.Provider>
    </>
  );
}