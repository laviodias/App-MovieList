import React, { createContext, useState } from 'react';

const DetailsContext = createContext();

function DetailsProvider({children}){
    
    const [getIdShow, setIdShow] = useState(0);
    const [getIdMovie, setIdMovie] = useState(0);

    return(
        <DetailsContext.Provider value={{
            getIdShow, setIdShow,
            getIdMovie, setIdMovie
        }}>
            {children}
        </DetailsContext.Provider>
    );
}

export {DetailsProvider}
export default DetailsContext