import { useEffect } from 'react';
import { useState, Fragment } from 'react';

function App() {
  useEffect(() => {
    document.getElementsByClassName('J_Tags J_Tagsservice_block')[0].checked=true
    setTimeout(() => {
      document.getElementsByClassName('submit-btn text-btn')[0].click()
    }, 2000);
  }, [])

  return (
    <Fragment>
      <div>淘宝自动取消勾选然后自动提交</div>
    </Fragment>
  );
}

export default App;
