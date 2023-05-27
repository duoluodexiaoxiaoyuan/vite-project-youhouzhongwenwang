import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css'
ReactDOM.createRoot(
  (() => {
    const app = document.createElement('div');
    app.setAttribute('class', 'upList')

    // const app = GM_addElement('div', {class: 'upList'});
    // 获取页面container
    // const pageContent = document.querySelector('#app')
    // pageContent.append(app);
    document.body.append(app)
    // GM_addElement(document.body, 'div', {class: 'upList', textContent: app});
    return app;
  })(),
).render(
  <React.Fragment>
    <App />
  </React.Fragment>,
);
