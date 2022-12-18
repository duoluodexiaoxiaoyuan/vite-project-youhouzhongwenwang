import { useEffect } from 'react';
import { useState, Fragment } from 'react';
import * as XLSX from 'xlsx';
import './App.css'
import { GM_cookie, unsafeWindow, monkeyWindow, GM_getValue, GM_setValue } from '$';


function App() {
  const [count, setCount] = useState(0)
  useEffect(() => {
  }, [])

  const caoZuo = () => {
    setCount(count+1)
    GM_setValue('count', count+1);
    console.log(GM_getValue('count'));
  }
  return (
    <Fragment>
      <div>
        <button onClick={caoZuo}>你好世界</button>
        点击次数{count}
      </div>
    </Fragment>
  );
}

export default App;
