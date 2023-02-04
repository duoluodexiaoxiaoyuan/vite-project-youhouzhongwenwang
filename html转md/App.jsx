import { useEffect, useState } from 'react';
import { Fragment } from 'react';
import TurndownService from 'turndown'
import { gfm, tables, strikethrough } from 'turndown-plugin-gfm'
import { Button, message } from 'antd';
import 'antd/dist/antd.css';
import './App.css'

function App() {
  const [copyContent, setCopyContent] = useState("")

  useEffect(() => {
    // 拿到当前页面的所有的js代码
    let jsCodeList = document.querySelectorAll('pre')
    // 拿到当前页面的所有js代码的div
    let jsCodeDivList = document.querySelectorAll('.line-numbers-mode')
    jsCodeDivList.forEach((item, index) => {
      item.onclick = function() {
        // console.log('你点击到我了',item.children[0]);
        let turndownService = new TurndownService()
        turndownService.use(gfm)
        turndownService.use([tables, strikethrough])
        let markdown = turndownService.turndown(item.children[0])
        console.log(markdown)
        setCopyContent(markdown)
      }
    })
    
  }, [])

  useEffect(() => {
    console.log('jinru')
    onCopy(copyContent)
  }, [copyContent])

  // 复制内容
  const onCopy = (copyContent) => {
    if(copyContent) {
      let oInput = document.createElement('textarea')
      oInput.value = copyContent
      document.body.appendChild(oInput)
      oInput.select() // 选择对象;
      document.execCommand('Copy') // 执行浏览器复制命令
      console.log('nihao');
      message.success('复制成功!');
      oInput.remove()
    }
  }
  return (
    <div>
      你好
    </div>
  )
}

export default App;
