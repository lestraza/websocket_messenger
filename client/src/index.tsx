import React from 'react';
import ReactDOM from 'react-dom';
import { Provider} from 'mobx-react';
import MainStore from './store/MainStore'
import App from './App';

const store = new MainStore()

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);


