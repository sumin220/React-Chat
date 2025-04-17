import React from 'react';
import { createRoot } from 'react-dom/client'; // ReactDOM.createRoot를 가져옴
import App from './App';

const container = document.getElementById('root');
if (!container) {
    throw new Error('Root container not found');
}

const root = createRoot(container);
root.render(<App />);