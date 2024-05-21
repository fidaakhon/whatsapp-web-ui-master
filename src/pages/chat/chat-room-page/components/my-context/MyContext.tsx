// MyContext.js
import React, { createContext, useState } from 'react';
import { Message, messages } from '../messages-list/data/get-messages'

export const MyContext = createContext({} as any);

export const MyProvider = ({ children }) => {

    const [items, setItems] = useState(messages);

    return (
        <MyContext.Provider value={{items, setItems}}>
            {children}
        </MyContext.Provider>
    );
};
