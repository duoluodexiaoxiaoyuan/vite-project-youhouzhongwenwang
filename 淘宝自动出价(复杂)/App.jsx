import { useEffect, useState, useRef } from 'react';
import { Fragment } from 'react';
import * as XLSX from 'xlsx';
import request from './api/request';
import './App.css'
let timerId = null;
function App() {
  let dirHandle;
  // 设置轮训条件
  const [rotationalTrainingConditions, setRotationalTrainingConditions] = useState(false)
  const [switchScript, setSwitchScript] = useState(false);
  // excel选中的商品
  const [excelSelectedGood, setExcelSelectedGood] = useState({});
  // excel选择的商品的价格
  const [excelSelectedGoodPrice, setExcelSelectedGoodPrice] = useState('')
  // 自己人
  const [companion, setCompanion] = useState([])
  // 是否出去
  const [isChuJiaFlag, setIsChuJiaFlag] = useState(false)
  useEffect(() => {
    if (window.localStorage.getItem('taoBaoGoodsListForScriptAboutChuJia')) {
      getExcelCurrentPrice()
    } else {
      console.log('不显示价格的原因:请确保读取到本地文件的excel内容')
    }
    if (window.localStorage.getItem('taoBaoAutoOperationAboutChuJia') == 1) {
      setSwitchScript(true);
    }
    if (
      window.localStorage.getItem('taoBaoGoodsListForScriptAboutChuJia') &&
      window.localStorage.getItem('taoBaoAutoOperationAboutChuJia') == 1
    ) {
      console.log(
        window.localStorage.getItem('taoBaoGoodsListForScriptAboutChuJia')
      );
      // data是存储到localStorage里面的商品列表
      let excelGoodsList = JSON.parse(
        window.localStorage.getItem('taoBaoGoodsListForScriptAboutChuJia')
      );
      console.log(excelGoodsList);
      // 获取当前页面sku的id
      const skuId = getQueryVariable(window.location.href);
      saveCompanion(excelGoodsList, skuId)
    }
    // setTimeout(() => {
    //   document.getElementsByClassName('submit-btn text-btn')[0].click()
    // }, 2000);
  }, []);

  // 获取excel当前页面的价格
  const getExcelCurrentPrice = () => {
    // data是存储到localStorage里面的商品列表
    let excelGoodsList = JSON.parse(
      window.localStorage.getItem('taoBaoGoodsListForScriptAboutChuJia')
    );
    console.log(excelGoodsList);
    // 获取当前页面sku的id
    const skuId = getQueryVariable(window.location.href);
    excelGoodsList.map((item) => {
      if (item['SKU'] == skuId) {
        setExcelSelectedGoodPrice(item['售价'])
      }
    })

  }

  // 执行轮询
  useEffect(() => {
    console.log('rotationalTrainingConditions为',rotationalTrainingConditions);
    if (rotationalTrainingConditions) {
      timerId = setInterval(() => {
        console.log('轮训中');
        // 开始轮询
        // 只要到了倒计时时间我们才进行出价
        const countdown = getPageCountdown()
        // 将页面倒计时转换为秒
        const pageCountDown = convertCountdownToSeconds(countdown, '页面倒计时');
        console.log('从excel表格中匹配到的商品',excelSelectedGood);
        // excel倒计时
        const excelCpuntDown = convertCountdownToSeconds(excelSelectedGood['距结束时间'], 'excel倒计时')
        console.log('页面倒计时', countdown, '转换为秒以后是多少', pageCountDown);
        console.log('excel距结束时间', excelSelectedGood['距结束时间'], '转换为秒以后是多少', excelCpuntDown);
        const skuId = getQueryVariable(window.location.href);
        isRotationalTraining(pageCountDown, excelCpuntDown, excelSelectedGood, companion, skuId)
      }, 5 * 1000);          
    }
  }, [rotationalTrainingConditions])

  // 进行出价的判断
  useEffect(() => {
    if(isChuJiaFlag) {
      const skuId = getQueryVariable(window.location.href);
      console.log(excelSelectedGood, companion, skuId);
      isChuJia(excelSelectedGood, companion, skuId)
    }
  }, [isChuJiaFlag])

  // 判断是否轮训如果出价就要停止轮训，出完价格以后继续轮训(轮训不轮训是通过我有没有执行出价的操作来判断的)
  const isRotationalTraining = (pageCountDown, excelCpuntDown, selectedGood, companion, skuId) => {
    // 进行判断，根据判断结果来清除轮询或者让它再次轮询
    if (excelCpuntDown > pageCountDown) {
      // 如果excel倒计时大于页面倒计时，那么就开始出价
      console.log('开始出价,清除轮训');
      setRotationalTrainingConditions(false);
      clearInterval(timerId);
      setIsChuJiaFlag(true)
      // isChuJia(selectedGood, companion, skuId)
    } else {
      console.log('没有到达倒计时，继续轮训');
    }
  }

  // jump出价记录页面
  const jumpChuJiaTab = () => {
    window.scrollBy(0, 500);
    const chuJianTab = document.querySelector('#tab2')
    setTimeout(() => {
      console.log('跳转到出价记录tab');
      chuJianTab.click()
    }, 1000);
  }

  // 存储自己和自己人
  const saveCompanion = (goodList, skuId) => {
    goodList.map((item) => {
      if (item['SKU'] == skuId) {
        // 通过读取出价记录来判断哪些是自己人
        const countChuJia = item['读取出价记录'];
        jumpChuJiaTab()
        setTimeout(() => {
          const records = getChuJiaList();
          // 从records里面截取前countChuJia个出价记录
          const companion = records.slice(0, countChuJia)
          setCompanion(companion);
          setExcelSelectedGood(item)
          console.log(companion);
          // 开始轮询判断什么时候进行出价的操作
          setRotationalTrainingConditions(true)
        }, 4000)
      }
    });
    // request(
    //   'get',
    //   'https://item-paimai.taobao.com/api/pmp/1635956073468497/bid-list?currentPage=1'
    // )
    //   .then((res) => {
    //     console.log(res);
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //   });
  };

  // 获取出价记录列表
  const getChuJiaList = () => {
    // 获取表格元素
    const table = document.querySelector('.pm-record-list');
    // 获取表格主体部分
    const tbody = table.querySelector('tbody');
    // 获取所有行记录
    const rows = tbody.querySelectorAll('tr');
    // 定义一个空数组，用于存储每一行记录
    const records = [];
    // 遍历每一行记录，将它们存储到数组中
    rows.forEach((row) => {
      const status = row.querySelector('.record-icon s') ? '出局' : '领先';
      const bidder = row.querySelector('.nickname').textContent;
      const price = row
        .querySelector('.price')
        .textContent.trim()
        .replace('¥', '')
        .replace(',', '');
      const time = row.querySelector('.time').textContent.split(' ')[1];
      records.push({ status, bidder, price, time });
    });
    console.log(records);
    return records;
  };

  // 是否进行出价
  const isChuJia = async (selectedGood, companion, skuId) => {
    console.log(selectedGood);
    // 获取选择商品的价格
    if (selectedGood['SKU'] == skuId) {
      // 获取页面的当前价格
      const value = getPrice()
      console.log('页面当前价格',value);
      if ((value > selectedGood['售价']) && false) {
        const records = getChuJiaList();
        // 截取第一个出价记录
        const firstRecord = records[0];
         // 获取自己人的出价记录(如果是乱码的话或者的竞拍人也显示乱码的)
        const allChuJiaRecordsOwn = await getAllChuJiaRecords()
        if (!allChuJiaRecordsOwn) {
          console.log('error', '没有获取到所有出价记录', allChuJiaRecordsOwn);
          return
        }
        // 首先要判断第一个出价记录不是我自己
        if (firstRecord.bidder != '我') {
          // 从records里面截取selectedGood['前几行没有我']个出价记录
          const needTheFirstFewLinesOfRecords = records.slice(0, selectedGood['前几行没有我'])
          // 判断第一个出价记录是否是自己人并且needTheFirstFewLinesOfRecords前几位置没有我,乱码的情况我们也重新获取了自己人
          console.log(companion, allChuJiaRecordsOwn, needTheFirstFewLinesOfRecords, '出价前的判断');
          if (
            (allChuJiaRecordsOwn.some(
              (item) => item.bidderNo == firstRecord.bidder
            ) ||
              companion.some((item) => item.bidder == firstRecord.bidder)) &&
            (needTheFirstFewLinesOfRecords.every((item) => item.bidder != '我'))
          ) {
            console.log('出价', '页面价格大于excel售价');
            // 模拟鼠标点击进行出价
            clickChuJia();
            // 出完价格以后再开启轮询
            setRotationalTrainingConditions(true);
            setIsChuJiaFlag(false);
          } else {
            // 继续轮训检测
            setRotationalTrainingConditions(true);
            setIsChuJiaFlag(false);
          }
        } else {
            // 继续轮训检测
            setRotationalTrainingConditions(true)
            setIsChuJiaFlag(false)
        }
      } else if (value <= selectedGood['售价']) {
        const records = getChuJiaList();
        // 截取第一个出价记录
        const firstRecord = records[0];
        // 获取所有出价记录
        const allChuJiaRecordsOwn = await getAllChuJiaRecords()
        if (!allChuJiaRecordsOwn) {
          console.log('error', '没有获取到所有出价记录', allChuJiaRecords);
          return
        }
        // 首先要判断第一个出价记录不是我自己
        if (firstRecord.bidder != '我') {
          // 从records里面截取selectedGood['前几行没有我']个出价记录
          const needTheFirstFewLinesOfRecords = records.slice(0, selectedGood['前几行没有我'])
          // 判断第一个出价记录是否是自己人并且needTheFirstFewLinesOfRecords前几位置没有我
          console.log(companion, allChuJiaRecordsOwn, needTheFirstFewLinesOfRecords, '出价前的判断');
          if (
            (allChuJiaRecordsOwn.some(
              (item) => item.bidderNo == firstRecord.bidder
            ) ||
              companion.some((item) => item.bidder == firstRecord.bidder)) &&
            (needTheFirstFewLinesOfRecords.every((item) => item.bidder != '我'))
          ) {
            console.log('出价', '页面价格小于等于excel售价');
            // 模拟鼠标点击进行出价
            clickChuJia();
            setRotationalTrainingConditions(true);
            setIsChuJiaFlag(false);
          } else {
            // 继续轮训检测
            setRotationalTrainingConditions(true);
            setIsChuJiaFlag(false);
          }
        } else {
           // 继续轮训检测
           setRotationalTrainingConditions(true)
           setIsChuJiaFlag(false)
        }
      }
    }
  }

  // 点击页面按钮进行出价
  const clickChuJia = () => {
      // 获取页面当前价
      const value = getPrice()
      // 获取加价幅度
      let addPrice = getAddPrice()
      if (addPrice) {
        // 获取excel加价幅度
        let excelMarkupMargin = excelSelectedGood['加价幅度'] || 1
        addPrice = addPrice * excelMarkupMargin
        console.log('加价幅度倍数*页面的加价幅度', addPrice);
        // 将出价金额设置为当前价加上加价幅度
        const price = parseInt(value) + parseInt(addPrice);
        const chuJiaFlag = setChuJia(price)
        if (chuJiaFlag) {
          setTimeout(() => {
            document.querySelector('#J_GivePrice').click()
            if (isShowAlert) {
              setTimeout(() => {
                document.querySelector('.submit-btn').click()
              }, 2000);
            }
          }, 1000);
        }
      }
  }

  // 判断出价的时候是否会弹出提示
  const isShowAlert = () => {
    let showAlertFlat = false
    if(document.querySelector('.line.tips.border')) {
      return showAlertFlat
    }
    return showAlertFlat
  }


  // 获取加价幅度
  const getAddPrice = () => {
    let addPrice;
    if (document.querySelector('.line2 > span:nth-child(3)')) {
      addPrice = document.querySelector('.line2 > span:nth-child(3)').innerText
    } else {
      console.log('error', '没有获取到加价幅度的值');
    }
    return addPrice;
  }

  // 设置当前出价
  const setChuJia = (price) => {
    let chuJiaInput = document.querySelector('.pm-price-input')
    if (chuJiaInput) {
      chuJiaInput.value = price
      triggerInput(chuJiaInput)
      return true;
    } else {
      console.log('error', '没有获取到出价输入框');
      return false;
    }
  }

  // 触发input元素规则校验和检测的触发
  const triggerInput = (dom) => {
    let myFocus = new Event('focus')
    let myInput = new Event('input')
    let myChange = new Event('change')
    let myBlur = new Event('blur')
    dom.dispatchEvent(myFocus)
    dom.dispatchEvent(myInput)
    dom.dispatchEvent(myChange)
    dom.dispatchEvent(myBlur)
  }

  // 获取页面的当前价格，因为超过三位数有逗号，所以我们需要处理一下
  const getPrice = () => {
    // 获取页面的当前价
    const priceElement = document.querySelector('.pm-current-price');
    const priceString = priceElement.textContent.trim();
    let price;
    if (priceString.includes(',')) {
      // 如果价格字符串中包含逗号，则说明价格是多位数
      price = parseInt(priceString.replace(/,/g, ''), 10);
    } else {
      // 否则价格是三位数
      price = parseInt(priceString, 10);
    }
    return price
  }

  // 获取页面的倒计时
  const getPageCountdown = () => {
    // 获取倒计时元素
    const timeLeft = document.querySelector('.J_TimeLeft');
    if (timeLeft.childNodes.length == 7) {
        // 获取倒计时的小时、分钟和秒数
        const hours = timeLeft.querySelector('.time-num:nth-child(1)').textContent;
        const minutes = timeLeft.querySelector(
          '.time-num:nth-child(3)'
        ).textContent;
        const seconds = timeLeft.querySelector(
          '.time-num:nth-child(5)'
        ).textContent;
        // 将倒计时转换为指定的格式
        const countdown = `${hours.padStart(2, '0')}:${minutes.padStart(
          2,
          '0'
        )}:${seconds.padStart(2, '0')}`;
        return countdown;
    } else if (timeLeft.childNodes.length == 5) {
        // 获取倒计时的分钟和秒数
        const minutes = timeLeft.querySelector(
          '.time-num:nth-child(1)'
        ).textContent;
        const seconds = timeLeft.querySelector(
          '.time-num:nth-child(3)'
        ).textContent;
        // 将倒计时转换为指定的格式
        const countdown = `00:${minutes.padStart(2, '0')}:${seconds.padStart(2, '0')}`;
        return countdown;
    }
  };

  // 将倒计时转换为秒
  const convertCountdownToSeconds = (countdown, description) => {
    if (countdown) {
      // 将倒计时转换为秒数
      const [hours, minutes, seconds] = countdown.split(':');
      const remainingSeconds = parseInt(hours) * 3600 + parseInt(minutes) * 60 + parseInt(seconds);
      return remainingSeconds;
    } else {
      console.log(description, '不存在', countdown);
    }
    
  }

  // 因为领先的竞价人返回的编号可能会乱码，所以需要通过之前出价的时间记录来判断是不是自己人
  const getAllChuJiaRecords = async () => {
    if (document.querySelectorAll('#J_TotalPage').length > 0) {
      // 获取出价记录的页数
      const total = document.querySelectorAll('#J_TotalPage')[0].innerText
      const allChuJiaRecords = await requestCompanionAboutLast(total)
      console.log(allChuJiaRecords);
      return allChuJiaRecords
    }
  }

  // 对请求出价记录接口
  const requestCompanion = (page) => {
    return new Promise((resolve, reject) => {
      const requestId = document.querySelectorAll('#J_AuctionId')[0].value;
      if (!requestId) {
        console.log('请求的requestId没有获取到');
        reject('请求的requestId没有获取到');
        return;
      }
      const promiseArr = [];
      for (let i = 1; i <= page; i++) {
        const promise = request(
          'get',
          `https://item-paimai.taobao.com/api/pmp/${requestId}/bid-list?currentPage=${i}`
        );
        promiseArr.push(promise);
      }
      Promise.all(promiseArr)
        .then((resArr) => {
          let dataArr = resArr.map((res) => res.list).flat();
          dataArr = handleChuJiaRecords(dataArr)
          console.log(dataArr, '所有出价记录');
          resolve(dataArr);
        })
        .catch((err) => {
          console.log(err);
          reject(err);
        });
    });
  };

  // 只取最后两页的数据
  const requestCompanionAboutLast = (page) => {
    return new Promise((resolve, reject) => {
      const requestId = document.querySelectorAll('#J_AuctionId')[0].value;
      if (!requestId) {
        console.log('请求的requestId没有获取到');
        reject('请求的requestId没有获取到');
        return;
      }
      request(
      'get',
      `https://item-paimai.taobao.com/api/pmp/${requestId}/bid-list?currentPage=${page}`
    )
      .then((res) => {
        let dataArr = [...res.list]
        request('get',
          `https://item-paimai.taobao.com/api/pmp/${requestId}/bid-list?currentPage=${page-1}`
        ).then((
          res => {
            dataArr= [...dataArr, ...res.list,]
            dataArr = handleChuJiaRecords(dataArr)
            // 从dataArr截取excel读取出价记录的数量
            const count = excelSelectedGood['读取出价记录']
            dataArr = dataArr.slice(-count)
            console.log(dataArr, '所有出价记录');
            resolve(dataArr);
          }
        )).catch(
          err => {
            console.log(err);
            reject(err);
          }
        )
        
      })
      .catch((err) => {
        console.log(err);
        reject(err);
      });
    });
  };

  // 处理返回出价记录的结构
  const handleChuJiaRecords = (dataArr) => {
    const formattedData = dataArr.map((item) => {
      const {
        bidBasic: {
          auctionId,
          bidPrice,
          bidTime,
          bidderNo,
          clientFrom,
          itemId,
          quantity,
          status,
          type,
          isCurrentBidder,
        },
      } = item;
      const date = new Date(bidTime);
      const hours = date.getHours() < 10 ? `0${date.getHours()}` : date.getHours();
      const minutes = date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes();
      const seconds = date.getSeconds() < 10 ? `0${date.getSeconds()}` : date.getSeconds();
      const timeString = `${hours}:${minutes}:${seconds}`;
      return {
        auctionId,
        bidPrice,
        bidTime: timeString,
        bidderNo,
        clientFrom,
        itemId,
        quantity,
        status,
        type,
        isCurrentBidder,
      };
    })
    return formattedData
  }

  

  // 金额用逗号分割
  const splitNum = (str) => {
    if (!str) {
      return '';
    }
    const strArr = (str + '')
      .split('')
      .reverse()
      .join('')
      .replace(/(\d{3})(?=\d)/g, '$1,')
      .split('')
      .reverse();
    return strArr.join('');
  };

  const onImportExcel = (file) => {
    console.log(file);
    // 获取上传的文件对象
    // const { files } = file.target;
    // 通过FileReader对象读取文件
    const fileReader = new FileReader();
    // 以二进制方式打开文件
    //  fileReader.readAsBinaryString(files[0]);
    fileReader.readAsBinaryString(file);
    fileReader.onload = (event) => {
      try {
        const { result } = event.target;
        // 以二进制流方式读取得到整份excel表格对象
        const workbook = XLSX.read(result, { type: 'binary' });
        let data = []; // 存储获取到的数据
        // 遍历每张工作表进行读取（这里默认只读取第一张表）
        for (const sheet in workbook.Sheets) {
          if (workbook.Sheets.hasOwnProperty(sheet)) {
            // 利用 sheet_to_json 方法将 excel 转成 json 数据
            data = data.concat(
              XLSX.utils.sheet_to_json(workbook.Sheets[sheet])
            );
            break; // 如果只取第一张表，就取消注释这行
          }
        }
        console.log('42', data);
        window.localStorage.setItem(
          'taoBaoGoodsListForScriptAboutChuJia',
          JSON.stringify(data)
        );
        getExcelCurrentPrice()
      } catch (e) {
        // 这里可以抛出文件类型错误不正确的相关提示
        console.log('文件类型不正确');
        return;
      }
    };
  };

  // 获取url上面的参数
  const getQueryVariable = (url) => {
    const regex = /(\d+)\.htm/;
    const match = url.match(regex);
    if (match) {
      return match[1];
    }
    return false;
  };

  // 授权目录
  const authorizedDirectory = async () => {
    dirHandle = await window.showDirectoryPicker({ mode: 'readwrite' });
    console.log(dirHandle);
  };

  // 读取文件
  const readFile = async () => {
    // 读取目录
    for await (const item of dirHandle.values()) {
      const fileData = await item.getFile();
      const reader = new FileReader();
      reader.readAsText(fileData, 'utf8'); // input.files[0]为第一个文件  reader.result就是文件里面的内容
      reader.onloadend = (res) => {
        onImportExcel(fileData);
      };
    }
  };

  // 开启(关闭)脚本的操作
  const operationScript = () => {
    if (!switchScript) {
      setSwitchScript(true); // 开启脚本自动操作
      window.localStorage.setItem('taoBaoAutoOperationAboutChuJia', 1);
    } else {
      setSwitchScript(false); //关闭脚本自动操作
      window.localStorage.setItem('taoBaoAutoOperationAboutChuJia', 0);
    }
  };

  return (
    <Fragment>
      <div class="jb_content">
        <div>淘宝上传excel匹配页面对应的内容</div>
        {/* <input type='file' accept='.xlsx, .xls' onChange={(file) => { onImportExcel(file) }} /> */}
        <button onClick={authorizedDirectory}>点我授权目录</button>
        <button onClick={readFile}>读取本地文件</button>
        <div>
          当前脚本自动操作: {switchScript ? '开' : '关'}
          <button onClick={operationScript}>
            {switchScript ? '关闭' : '开启'}
          </button>
        </div>
        <div>轮询状态: {rotationalTrainingConditions ? '正在轮训' : '关闭轮训'}</div>
        <div>
          {/* <button onClick={() => {
            setRotationalTrainingConditions(true);
          }}>开启轮训</button>
          <button onClick={() => {
            setRotationalTrainingConditions(false);
            clearInterval(timerId)
          }}>关闭轮训</button> */}
          {/* <button onClick={() => {
            getAllChuJiaRecords()
          }}>测试获取所有出价记录</button> */}
          <div>excel售价: <span style={{fontSize: '33px', color: 'red'}}>{excelSelectedGoodPrice}</span></div>
        </div>
      </div>
    </Fragment>
  );
}

export default App;
