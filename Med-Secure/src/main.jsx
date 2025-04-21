import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import React from 'react';

const rootElement = document.getElementById("root");
if (rootElement) {
	createRoot(rootElement).render(<App />);
}