import React from 'react'
import Main from './main.js'
import i18n from 'i18next';

import { initReactI18next } from 'react-i18next';
import en from './locales/en.json';
import es from './locales/es.json';
import ta from "./locales/ta.json"

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    es: { translation: es },
    ta: { translation: ta }

   
  },
  lng: localStorage.getItem('language') || 'en', 
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
});


export default function App() {
  return (
    <div>
      <Main/>
    </div>
  )
}
