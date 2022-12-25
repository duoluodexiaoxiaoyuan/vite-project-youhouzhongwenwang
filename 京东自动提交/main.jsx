import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css'
ReactDOM.createRoot(
  (() => {
    const app = document.createElement('div');
    app.setAttribute("class", "jb_content");
    // 获取页面container
    const pageContent = document.querySelector('.container');
    // document.body.append(app);
    pageContent.before(app)
    return app;
  })(),
).render(
  <React.Fragment>
    <App />
  </React.Fragment>,
);
