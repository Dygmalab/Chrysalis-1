import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';

import App from './renderer/App';
import Error from './Error';

import 'bootstrap/dist/css/bootstrap.min.css';

try {
  ReactDOM.render(
    <Router>
      <App />
    </Router>,
    document.getElementById('root')
  );
} catch (e) {
  ReactDOM.render(<Error error={e} />, document.getElementById('root'));
}
