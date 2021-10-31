import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { UALProvider } from 'ual-reactjs-renderer'
import { Anchor } from 'ual-anchor'

const appName = "EOSETF";

const chain = {
  chainId: "aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906",
  rpcEndpoints: [
    {
      protocol: "https",
      host: "eos.greymass.com",
      //https://dsp.maltablock.org
      //host: "dsp.airdropsdac.com", https://node2.blockstartdsp.com"dsp.eosphere.io",https://dsp.eosdetroit.io,https://node1.eosdsp.com
      port: "",
    },
  ],
};

const anchor = new Anchor([chain], {
  appName,
});


const supportedChains = [chain];
const supportedAuthenticators = [
  anchor
];

ReactDOM.render(
  <React.StrictMode>
    <UALProvider
      chains={supportedChains}
      authenticators={supportedAuthenticators}
      appName={appName}
    >
    <App />
    </UALProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
