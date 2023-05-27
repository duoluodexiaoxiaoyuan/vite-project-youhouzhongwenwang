import { useEffect, useState } from 'react';
import { Button, List, Drawer, Avatar, Pagination  } from 'antd';
import 'antd/dist/antd.css';
import './App.css'
import request from './api/request';

function App() {
  const [open, setOpen] = useState(false);
  const showDrawer = () => {
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
  };

  useEffect(() => {
  }, [])

  return (
    <div>
      <Button type="primary" onClick={showDrawer}>
        打开单词表
      </Button>
      <Drawer
        title="你记录的单词"
        placement="right"
        onClose={onClose}
        open={open}
      > 
      </Drawer>
    </div>
  );
}

export default App;
