import { useEffect, useState } from 'react';
import { Button, List, Drawer, Avatar, Pagination  } from 'antd';
import 'antd/dist/antd.css';
import './App.css'
import request from './api/request';

function App() {
  const [open, setOpen] = useState(false);
  const [upListData, setUpListData] = useState([])
  // 当前页数
  const [currentPage, setCurrentPage] = useState(1)
  // 总数
  const [totalData, setTotalData] = useState(1)
  const showDrawer = () => {
    console.log(upListData)
    if (document.querySelector('.bili-header')) {
      document.querySelector('.bili-header').style.display='none'
    } else if (document.querySelector('.international-header.report-wrap-module')) {
      document.querySelector('.international-header.report-wrap-module').style.display = 'none'
    }
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
    if (document.querySelector('.bili-header')) {
      document.querySelector('.bili-header').style.display=''
    } else if (document.querySelector('.international-header.report-wrap-module')) {
      document.querySelector('.international-header.report-wrap-module').style.display = ''
    }
  };

  useEffect(() => {
   request('get','https://api.live.bilibili.com/xlive/web-ucenter/user/following?page=1&page_size=9').then(
    res => {
      console.log(res)
      setUpListData(res.data.list)
      console.log(res.data.totalPage)
      setTotalData(res.data.count)
    }
   ).catch(
    err => {
      console.log(err)
    }
   )
  }, [])

  // 跳转页面
  const jumpPage = (jumpPage) => {
    request('get',`https://api.live.bilibili.com/xlive/web-ucenter/user/following?page=${jumpPage}&page_size=9`).then(
    res => {
      console.log(res)
      setUpListData(res.data.list)
      console.log(res.data.totalPage)
      setTotalData(res.data.count)
    }
   ).catch(
    err => {
      console.log(err)
    }
   )
  }

  return (
    <div>
      <Button type="primary" onClick={showDrawer}>
        打开直播up列表
      </Button>
      <Drawer
        title="你关注的up"
        placement="right"
        onClose={onClose}
        open={open}
      >
        <List
          itemLayout="horizontal"
          dataSource={upListData}
          renderItem={(item) => (
            <List.Item>
              <List.Item.Meta
                avatar={<Avatar src={item.face} />}
                title={
                  <div>
                    <span
                      style={{
                        backgroundColor: `${
                          item.live_status === 1 ? 'skyblue' : ''
                        }`,
                      }}
                    >
                      {item.uname}-{item.live_status === 1 ? '开播' : '未开播'}
                    </span>
                    -
                    <a href={`https://space.bilibili.com/${item.uid}`} target="_blank" style={{backgroundColor: 'pink'}}>
                      进入主页
                    </a>
                  </div>
                }
                description={
                  <a
                    href={`https://live.bilibili.com/${item.roomid}`}
                    target="_blank"
                  >
                    直播标题: {item.title}
                  </a>
                }
              />
            </List.Item>
          )}
        />
        <Pagination
          current={currentPage}
          total={totalData}
          pageSize={9}
          size="small"
          simple
          onChange={(page) => {
            console.log(page);
            setCurrentPage(page);
            jumpPage(page);
          }}
        />
      </Drawer>
    </div>
  );
}

export default App;
