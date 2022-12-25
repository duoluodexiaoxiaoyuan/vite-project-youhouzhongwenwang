import { useEffect, useState } from 'react';
import { Fragment } from 'react';
import * as XLSX from 'xlsx';
import './App.css'

function App() {
  let dirHandle;
  const [switchScript, setSwitchScript] = useState(false)
  useEffect(() => {
    if (window.localStorage.getItem('jdAutoOperation') == 1) {
      setSwitchScript(true)
    }
    if (window.localStorage.getItem('jdGoodsListForScript') && window.localStorage.getItem('jdAutoOperation') == 1 && window.location.href.indexOf('skuDetailId') > -1) {
      console.log(window.localStorage.getItem('jdGoodsListForScript'));
      // data是存储到localStorage里面的商品列表
      let data = JSON.parse(window.localStorage.getItem('jdGoodsListForScript'))
      console.log(data);
      // 获取当前页面sku的id
      const skuId = getQueryVariable('skuId');
      setTimeout(() => {
        // 如果存在我们就要对页面进行操作
        if (skuId) {
          const matchGoods = data.filter((item) => item.SKU == skuId);
          if (matchGoods.length == 1) {
            for (let key in matchGoods[0]) {
              if (key == '库存量') {
                console.log('库存量');
                if (matchGoods[0][key] !== undefined && matchGoods[0][key] !== null && matchGoods[0][key] !== 0) {
                  let storage = document.querySelector('.step-module__col2 > div > div > div > input')
                  storage.value =matchGoods[0][key]
                  triggerInput(storage)
                }
              } else if (key == '起拍价') {
                console.log('起拍价', matchGoods[0][key], key);
                if (matchGoods[0][key] !== undefined && matchGoods[0][key] !== null && matchGoods[0][key] !== 0) {
                  let strPrice = document.querySelector('.el-form.el-formUi--label-left > div:nth-child(2) > div > div > div:nth-child(2) > div > div > div > div > input')
                  strPrice.value =matchGoods[0][key]
                  triggerInput(strPrice)
                }
              } else if (key == '保证金') {
                if (matchGoods[0][key] !== undefined && matchGoods[0][key] !== null && matchGoods[0][key] !== 0) {
                  let securityFund = document.querySelector("#app > div.create-module-list > div.step-modules > form > div:nth-child(2) > div > div > div:nth-child(2) > div:nth-child(1) > div.el-form-item.is-success > div > div > input")
                  if (matchGoods[0][key] == '空') {
                    securityFund.value = ''
                  } else {
                    securityFund.value = matchGoods[0][key]
                  }
                  triggerInput(securityFund)
                }
              } else if (key == '最小加价幅度') {
                if (matchGoods[0][key] !== undefined && matchGoods[0][key] !== null && matchGoods[0][key] !== 0) {
                  let minPriceIncreases = document.querySelector("#app > div.create-module-list > div.step-modules > form > div:nth-child(2) > div > div > div:nth-child(3) > div:nth-child(2) > div > div > div > input  ")
                  minPriceIncreases.value = matchGoods[0][key]
                  triggerInput(minPriceIncreases)
                }
              } else if (key == '循环周期') {
                if (matchGoods[0][key] !== undefined && matchGoods[0][key] !== null && matchGoods[0][key] !== 0) {
                  let cycleTime = document.querySelector("#app > div.create-module-list > div.step-modules > form > div:nth-child(2) > div > div > div:nth-child(3) > div:nth-child(3) > div > div > div > input")
                  if (matchGoods[0][key] == '空') {
                    cycleTime.value = ''
                  } else {
                    cycleTime.value = matchGoods[0][key]
                  }
                  triggerInput(cycleTime)
                }
              } 
            }
             // 开始时间和结束时间必须操作的直接写到最上面
             try {
              let currentDay = new Date()
              let startDate = filterTime(currentDay.setMinutes(currentDay.getMinutes()+20),1)  ; //当前时间加20分钟
              let endDate = filterTime(currentDay.setDate(currentDay.getDate()+2))+ " 12:00:00" // 当前时间加一天
              let startDateDom = document.querySelector('.el-date-editor.el-range-editor.el-input__inner.el-date-editor--datetimerange.el-range-editor--small > input:nth-child(2)')
              let endDateDom = document.querySelector('.el-date-editor.el-range-editor.el-input__inner.el-date-editor--datetimerange.el-range-editor--small > input:nth-child(4)')
              let dingcengPicker = document.querySelector("#app > div.create-module-list > div.step-modules > form > div:nth-child(2) > div > div > div:nth-child(3) > div:nth-child(8) > div:nth-child(1) > div > div")
              triggerInput1(startDateDom)
              setTimeout(() => {
                   console.log(dingcengPicker.__vue__.picker)
                   triggerInput(startDateDom)
                   startDateDom.value = startDate
                  triggerInput(startDateDom)
                  endDateDom.value = endDate
                  triggerInput(endDateDom)
                  let buttonSubmit = document.querySelector('.el-button.el-picker-panel__link-btn.el-button--default.el-button--mini.is-plain')
                  setTimeout(() => {
                      buttonSubmit.click()
                      // 点击发布拍品
                      document.querySelector('#module-publishBtn').click()
                      // 弹出的二次确认点击确定
                      setTimeout(() => {
                        document.querySelector('.el-button.el-button--default.el-button--small.el-button--primary ').click()
                      }, 1000);
                  },1000)
              }, 1000)
            } catch (error) {
              console.log('操作开始时间和结束时间的时候报错了',error);
            }
          } else {
            console.log(
              '当前页面匹配到excel中有两个相同的skuid不知道操作哪一个，请检查'
            );
          }
        } else {
          console.log('脚本对当前页面无效');
        }
      }, 5000);
    }
    // document.getElementsByClassName('J_Tags J_Tagsservice_block')[0].checked=false
    // setTimeout(() => {
    //   document.getElementsByClassName('submit-btn text-btn')[0].click()
    // }, 2000);
  }, []);


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

  const triggerInput1 = (dom) => {
    let myFocus = new Event('focus')
    dom.dispatchEvent(myFocus)
  }

  // type:0 =>2021-09-12 默认
  // type:1 =>2021-09-12 10:34:12
  // type:2 =>09-12 10:34:12
  // type:3 =>09-12 
  // type:4 =>2021/09/12 
  // type:5 =>2021/09/12 10:34:12
  // type:6 =>09/12 10:34:12
  // type:7 =>09/12 
  const filterTime = (str, type = 0) => {
    console.log('str', str);
    console.log('type', type);
    let date = new Date(str);
    let y = date.getFullYear();
    let m = (date.getMonth() + 1 + '').padStart(2, '0');
    let d = (date.getDate() + '').padStart(2, '0');
    let hh = (date.getHours() + '').padStart(2, '0');
    let mm = (date.getMinutes() + '').padStart(2, '0');
    let ss = (date.getSeconds() + '').padStart(2, '0');
    let time;
    switch (type) {
      case 0:
        time = `${y}-${m}-${d}`;
        break;
      case 1:
        time = `${y}-${m}-${d} ${hh}:${mm}:${ss}`;
        break;
      case 2:
        time = `${m}-${d} ${hh}:${mm}:${ss}`;
        break;
      case 3:
        time = `${m}-${d}`;
        break;
      case 4:
        time = `${y}/${m}/${d}`;
        break;
      case 5:
        time = `${y}/${m}/${d} ${hh}:${mm}:${ss}`;
        break;
      case 6:
        time = `${m}/${d} ${hh}:${mm}:${ss}`;
        break;
      case 7:
        time = `${m}/${d}`;
        break;
    }
    return time;
  };

  // 金额用逗号分割
  const  splitNum = (str)=> {
    if (!str) {
      return '';
    }
    const strArr = (str + '').split('').reverse().join('').replace(/(\d{3})(?=\d)/g, '$1,')
      .split('')
      .reverse();
    return strArr.join('');
  }


  const onImportExcel = (file) => {
      console.log(file);
      // 获取上传的文件对象
      // const { files } = file.target;
      // 通过FileReader对象读取文件
      const fileReader = new FileReader();
      // 以二进制方式打开文件
      //  fileReader.readAsBinaryString(files[0]);
      fileReader.readAsBinaryString(file);
      fileReader.onload = event => {
       try {
         const { result } = event.target;
         // 以二进制流方式读取得到整份excel表格对象
         const workbook = XLSX.read(result, { type: 'binary' });
         let data = []; // 存储获取到的数据
         // 遍历每张工作表进行读取（这里默认只读取第一张表）
         for (const sheet in workbook.Sheets) {
           if (workbook.Sheets.hasOwnProperty(sheet)) {
             // 利用 sheet_to_json 方法将 excel 转成 json 数据
             data = data.concat(XLSX.utils.sheet_to_json(workbook.Sheets[sheet]));
             break; // 如果只取第一张表，就取消注释这行
           }
         }
         console.log('42',data);
         window.localStorage.setItem("jdGoodsListForScript", JSON.stringify(data))
       } catch (e) {
         // 这里可以抛出文件类型错误不正确的相关提示
         console.log('文件类型不正确');
         return;
       }
     };
  }

  // 获取url上面的参数
  const getQueryVariable = (variable) =>{
    let query = window.location.search.substring(1);
    let vars = query.split("&");
    for (let i=0;i<vars.length;i++) {
            let pair = vars[i].split("=");
            if(pair[0] == variable){return pair[1];}
    }
    return(false);
  }

  // 授权目录
  const authorizedDirectory = async() => {
    dirHandle = await window.showDirectoryPicker({ mode: "readwrite" });
    console.log(dirHandle);
  }

  // 读取文件
  const readFile = async() => {
    // 读取目录
    for await (const item of dirHandle.values()) {
      const fileData = await item.getFile();
      const reader = new FileReader()
      reader.readAsText(fileData,'utf8') // input.files[0]为第一个文件  reader.result就是文件里面的内容
      reader.onloadend = (res) => {
        onImportExcel(fileData)
      }
    }
  }

  // 开启(关闭)脚本的操作
  const operationScript = () => {
    if(!switchScript) {
      setSwitchScript(true)  // 开启脚本自动操作
      window.localStorage.setItem("jdAutoOperation", 1)
    } else {
      setSwitchScript(false)  //关闭脚本自动操作
      window.localStorage.setItem("jdAutoOperation", 0)
    }
    
  }

  return (
    <Fragment>
       <div class='jb_content'>
        <div>京东上传excel匹配页面对应的内容</div>
        {/* <input type='file' accept='.xlsx, .xls' onChange={(file) => { onImportExcel(file) }} /> */}
        <button onClick={authorizedDirectory}>点我授权目录</button>
        <button onClick={readFile}>读取本地文件</button>
        <div>当前脚本自动操作: {switchScript ? '开' : '关'}<button onClick={operationScript}>{switchScript ? '关闭': '开启'}</button></div>
       </div>
    </Fragment>
  );
}

export default App;
