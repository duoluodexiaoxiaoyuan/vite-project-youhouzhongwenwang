import { useEffect, useState } from 'react';
import { Button, List, Drawer, Avatar, Pagination, Input, Tabs  } from 'antd';
import { GM_cookie, unsafeWindow, monkeyWindow, GM_addElement, GM_getValue, GM_setValue, GM_setClipboard } from '$';
import FormRender, { useForm } from 'form-render';
import schema from './schema/starPageHref';
import 'antd/dist/antd.css';
import './App.css'
import request from './api/request';

const { TextArea } = Input;

const JumpButton = (props) => {
  const { hrefUrl, addons } = props
  return (
    <Button onClick={() => {
      console.log(addons['dataIndex'][0])
      console.log(hrefUrl[addons['dataIndex'][0]].input2)
      window.open(hrefUrl[addons['dataIndex'][0]].input2)
    }}>跳转</Button>
  )
}

function App() {
  const [open, setOpen] = useState(false);
  const [jumpPageHref, setJumpPageHref] = useState('');
  // 剪切板内容
  const [clipboardContent, setClipboardContent] = useState([]);
  const form = useForm();
  const showDrawer = () => {
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
  };
  const onFinish = (formData) => {
    console.log('formData:', formData);
    GM_setValue('starPageHref', formData)
  };

  const jumpPage = (event) => {
    setJumpPageHref(event.target.value)
    GM_setValue('jumpPageHref', event.target.value)
  }

  const openJumpHref = () => {
    let clipboardContent = []
    if (window.location.href.indexOf('bilibili') !== -1) {
      clipboardContent = getBilibiliContent()
      setClipboardContent(clipboardContent)
      console.log(clipboardContent)
      GM_setClipboard(clipboardContent.join('\n'))
    }
    window.open(GM_getValue('jumpPageHref'))
  }

  // 获取b站的内容
  const getBilibiliContent = () => {
    const bilibiliList = []
    const bilibiliTitle = document.querySelector("#viewbox_report > h1").innerText;
    const bilibiliUpName = document.querySelector('.up-detail-top a').innerText;
    bilibiliList.push(window.location.href, bilibiliTitle, bilibiliUpName);
    // 将剪切板内容进行存储
    GM_setValue('clipboardContent', bilibiliList)
    return bilibiliList;
  }

  useEffect(() => {
    if(GM_getValue('starPageHref')) {
      form.setValues(GM_getValue('starPageHref'))
    }
    if(GM_getValue('jumpPageHref')) {
      setJumpPageHref(GM_getValue('jumpPageHref'))
    }
  }, [])

  return (
    <div>
      <Button type="primary" onClick={showDrawer}>
        打开收藏链接
      </Button>
      <div style={{ marginTop: '10px' }}>
        <Button type="primary" onClick={openJumpHref}>
          收藏
        </Button>
      </div>
      <Drawer
        title="你收藏的链接"
        placement="right"
        onClose={onClose}
        open={open}
      >
        <Tabs defaultActiveKey="1" onTabClick={(key) => {
              if (key == 2) {
                // 获取剪切板内容
              const clipboardContent = GM_getValue('clipboardContent')
              console.log(clipboardContent)
              setClipboardContent(clipboardContent)
            //  const clipboardContent = GM_getClipboard()
            //  console.log(clipboardContent)
              }
          }}>
          <Tabs.TabPane tab="收藏网址" key="1">
            <div>
              <span>跳转地址:</span>
              <Input
                placeholder="请输入你要跳转到的网址"
                onChange={jumpPage}
                value={jumpPageHref}
              />
            </div>
            <FormRender
              schema={schema}
              form={form}
              maxWidth={400}
              onFinish={onFinish}
              footer={true}
              widgets={{ JumpButton }}
            />
          </Tabs.TabPane>
          <Tabs.TabPane tab="内容剪切板" key="2" >
            {clipboardContent && clipboardContent.length> 0 ? (clipboardContent.reverse()).map((item, index) => {
              return <div key={index}>{item}</div>
            }): null}
          </Tabs.TabPane>
        </Tabs>
      </Drawer>
    </div>
  );
}

export default App;
