import { useEffect } from 'react';
import { useState, Fragment } from 'react';

function App() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let timer = setInterval(() => {
      if(document.getElementById("postmessage")) {
        let postMessageTextArea = document.getElementById("postmessage")
        // 失去焦点的时候就需要判断一下输入的字符长度，如果小于10自动补全
        postMessageTextArea.onblur = function() {
          if (postMessageTextArea.value.length < 10) {
            let str = "!!!!!!!!!!"
            // 用户输入的长度
            let inputValue = postMessageTextArea.value || ''
            console.log(str.substring(0,10 -inputValue.length));
            // 补全10个字符
            postMessageTextArea.value = inputValue + str.substring(0,10 -inputValue.length) 
          }
        }
      }
    }, 2000);
  }, [])

  return (
    <Fragment>
      {/* <div className="App">
        你好世界，我是脚本
      </div> */}
    </Fragment>
  );
}

export default App;
