import React from 'react';
import { StatusBar, YellowBox } from 'react-native'; // barra de notificações

import Routes from './src/routes';

YellowBox.ignoreWarnings([
  'Unrecognized WebSocket'
]);

export default function App() {
  return (
    <>
      <StatusBar borderStyle="light-content" backgroundColor="#7d43e7" /> 
      <Routes />
    </>
  );
}
