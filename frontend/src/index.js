import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import "bulma/css/bulma.css"
import axios from "axios"

// Library Redux
import { createStore } from 'redux'
import { Provider } from 'react-redux'
import rootReducer from './redux/reducer/globalReducer'

axios.defaults.withCredentials = true

const store = createStore(rootReducer)

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={ store }>
      <App />
    </Provider>
  </React.StrictMode>
);