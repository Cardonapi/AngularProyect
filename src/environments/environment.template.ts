// Template file for environment configuration
// Copy this file to environment.ts and add your own Gemini API key

export const environment = {
  production: false,
  apiUrl: 'http://127.0.0.1:5000',
  wsUrl: '' as string,
  
  // API Key de Google Gemini - PERSONAL
  // Cada desarrollador debe generar su propia key en: https://makersuite.google.com/app/apikey
  geminiApiKey: 'TU_GEMINI_API_KEY_AQUI',

  // Firebase Configuration - COMPARTIDA
  // Todo el equipo usa el mismo proyecto Firebase
  firebaseConfig: {
    apiKey: "AIzaSyDoVLBtG-xjFHAi7WWXP-RXOJf2uLHmtZ4",
    authDomain: "angularproyect-71193.firebaseapp.com",
    projectId: "angularproyect-71193",
    storageBucket: "angularproyect-71193.firebasestorage.app",
    messagingSenderId: "678859519394",
    appId: "1:678859519394:web:d10d3f6858556f7ab7aefb",
    measurementId: "G-81DPDBLB4B"
  }
};
