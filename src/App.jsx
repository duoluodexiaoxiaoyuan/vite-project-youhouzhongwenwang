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

  const jumpHomePage = (uid) => {
    window.open(`https://space.bilibili.com/${uid}`)
  }

  const getImgStyle = (status) => {
    let selectFilter = status === 1 ? 'grayscale(0)' : 'grayscale(100%)'

    return {
      filter: selectFilter,
      cursor: 'pointer'
    }
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
            <List.Item
              style={{
                backgroundColor: `${item.live_status === 1 ? 'skyblue' : ''}`,
              }}
            >
              <List.Item.Meta
                avatar={
                  <Avatar
                    src={item.face}
                    className={item.live_status === 1 ? 'imgOrigin' : 'imgGray'}
                    // style={getImgStyle(item.live_status)}
                    onClick={()=> {
                      jumpHomePage(item.uid)
                    }}
                    // ref={(node) => {
                    //   if (node && item.live_status === 0) {
                    //     node.style.setProperty('filter', 'grayscale(100%)', 'important');
                    //   }
                    // }}
                  />
                }
                title={
                  <div>
                    <span
                      style={{
                        backgroundColor: `${
                          item.live_status === 1 ? 'skyblue' : ''
                        }`,
                      }}
                    >
                      {item.uname}
                      {/* {item.live_status === 1 ? '开播' : '未开播'} */}
                    </span>
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
