import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
ReactDOM.createRoot(
  (() => {
    const app = document.createElement('div');
    // 获取页面container
    const pageContent = document.querySelector('#app')
    pageContent.append(app);
    return app;
  })(),
).render(
  <React.Fragment>
    <App />
  </React.Fragment>,
);
