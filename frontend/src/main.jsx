import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';

import { ConfirmProvider } from './contexts/ConfirmContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { Toaster } from 'react-hot-toast';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <NotificationProvider>
      <ConfirmProvider>
        <App />
        <Toaster 
          position="top-right" 
          toastOptions={{
            duration: 4000,
            style: {
              background: '#333',
              color: '#fff',
              borderRadius: '10px',
              fontSize: '14px',
              fontWeight: '500'
            },
            success: {
              style: { background: '#10b981', color: 'white' },
              iconTheme: { primary: 'white', secondary: '#10b981' }
            },
            error: {
              style: { background: '#ef4444', color: 'white' },
              iconTheme: { primary: 'white', secondary: '#ef4444' }
            }
          }}
        />
      </ConfirmProvider>
    </NotificationProvider>
  </React.StrictMode>,
)