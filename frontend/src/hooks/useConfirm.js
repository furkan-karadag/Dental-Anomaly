import { useContext } from 'react';
import { ConfirmContext } from '../contexts/ConfirmContext';

const useConfirm = () => {
    const defaultConfirm = () => Promise.resolve(true); // Fallback outside provider
    
    const context = useContext(ConfirmContext);
    if (!context) {
        console.warn('useConfirm is being used outside of ConfirmProvider.');
        return { confirm: defaultConfirm };
    }
    
    return context;
};

export default useConfirm;
