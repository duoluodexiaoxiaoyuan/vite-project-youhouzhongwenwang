import { useEffect, useState } from 'react';
import { Fragment } from 'react';
import * as XLSX from 'xlsx';
import './App.css'

function App() {
  let dirHandle;
  const [switchScript, setSwitchScript] = useState(false)
  // excelSheet
  const [excelSheet, setExcelSheet] = useState('')
  useEffect(() => {
    if (window.localStorage.getItem('taoBaoAutoOperation') == 1) {
      setSwitchScript(true)
    }
    // 获取excel的sheet
    if (window.localStorage.getItem('taoBaoExcelSheetAboutAutoCommit')) {
      setExcelSheet(window.localStorage.getItem('taoBaoExcelSheetAboutAutoCommit'))
    }
    if (window.localStorage.getItem('taoBaoGoodsListForScript') && window.localStorage.getItem('taoBaoAutoOperation') == 1 && window.location.href.indexOf('edit_auction.htm') > -1) {
      console.log(window.localStorage.getItem('taoBaoGoodsListForScript'));
      // data是存储到localStorage里面的商品列表
      let data = JSON.parse(window.localStorage.getItem('taoBaoGoodsListForScript'))
      console.log(data);
      // 获取当前页面sku的id
      const skuId = getQueryVariable('item_id');
      setTimeout(() => {
        // 如果存在我们就要对页面进行操作
        if (skuId) {
          const matchGoods = data.filter((item) => item.SKU == skuId);
          if (matchGoods.length == 1) {
            for (let key in matchGoods[0]) {
              if (key == '七天无理由（1代表勾）（0代表不勾）') {
                console.log('选中7天无理由');
                if (matchGoods[0][key] == 1) {
                  document.getElementsByClassName(
                    'J_Tags J_Tagsservice_block'
                  )[0].checked = true;
                } else {
                  document.getElementsByClassName(
                    'J_Tags J_Tagsservice_block'
                  )[0].checked = false;
                }
              } else if (key == '先鉴别后发货') {
                console.log('选中先鉴别后发货', matchGoods[0][key], key);
                // 1的时候勾选先鉴别后，0为不勾选
                if (matchGoods[0][key] == 1) {
                  document.querySelector(
                    '.J_Tags.J_Tagsindustry_block'
                  ).checked = true;
                } else {
                  document.querySelector(
                    '.J_Tags.J_Tagsindustry_block'
                  ).checked = false;
                }
              } else if (key == '起  拍  价') {
                if (matchGoods[0][key] !== undefined && matchGoods[0][key] !== null && matchGoods[0][key] !== 0) {
                  document.getElementsByName('minimumBidInput')[0].value = splitNum(matchGoods[0][key])
                  document.getElementsByName('_fm.au._0.mi')[0].value =matchGoods[0][key]
                }
              } else if (key == '保证金') {
                if (matchGoods[0][key] !== undefined && matchGoods[0][key] !== null && matchGoods[0][key] !== 0) {
                  document.getElementsByName('_fm.au._0.free')[1].checked=true 
                  document.querySelector('#J_DepositNumBox').style.display=''
                  document.querySelector('#J_DepositNum').value = matchGoods[0][key]
                }
              } else if (key == '拍卖类型') {
                if (matchGoods[0][key] == '增价拍') {
                  document.querySelector('#J_Increase').checked=true
                } else if (matchGoods[0][key] == '降价拍') {
                  document.querySelector('#J_Dutch').checked=true
                } else if (matchGoods[0][key] == '即刻拍') {
                  document.querySelector('#J_Immediate').checked=true
                }
              } else if (key == '即刻拍时间') {
                if (matchGoods[0][key] !== undefined && matchGoods[0][key] !== null && matchGoods[0][key] !== 0 && matchGoods[0]['拍卖类型'] == '即刻拍') {
                  document.querySelector('#J_ImmediateAuctionTime').value = matchGoods[0][key]
                }
              } else if (key == '关注免保') {
                followFreeDeposit
                if (matchGoods[0][key] == 1) {
                  document.querySelector(
                    '#followFreeDeposit'
                  ).checked = true;
                } else {
                  document.querySelector(
                    '#followFreeDeposit'
                  ).checked = false;
                }

              }
            }
            // 修改编辑并放入仓库的点击时间
            setTimeout(() => {
              console.log('点击修改编辑并放入仓库');
              // 第二个版本需要不保存
              // document.getElementsByClassName('submit-btn text-btn')[0].click()
            }, 5000);
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
         // 判断workbook.SheetNames中是否包含excelSheet,如果包含就直接读取对应的Sheet表，如果不包含就读取第一张表
         if (workbook.SheetNames.includes(excelSheet)) {
          // 遍历每张工作表进行读取
          for (const sheet in workbook.Sheets) {
            if (workbook.Sheets.hasOwnProperty(sheet)) {
              if (sheet === excelSheet) {
                // 利用 sheet_to_json 方法将 excel 转成 json 数据
                data = data.concat(
                  XLSX.utils.sheet_to_json(workbook.Sheets[sheet])
                );
              }
            }
          }
         } else {
            console.log('excelSheet的值',excelSheet)
            // 遍历每张工作表进行读取（这里默认只读取第一张表）
            for (const sheet in workbook.Sheets) {
              if (workbook.Sheets.hasOwnProperty(sheet)) {
                // 利用 sheet_to_json 方法将 excel 转成 json 数据
                data = data.concat(
                  XLSX.utils.sheet_to_json(workbook.Sheets[sheet])
                );
                break; // 这里有break是为了只读第一个表
              }
            }
         }
         console.log('42',data);
         window.localStorage.setItem("taoBaoGoodsListForScript", JSON.stringify(data))
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
      window.localStorage.setItem("taoBaoAutoOperation", 1)
    } else {
      setSwitchScript(false)  //关闭脚本自动操作
      window.localStorage.setItem("taoBaoAutoOperation", 0)
    }
    
  }

  // 设置读取的excelSheet
  const readExcelSheet = (e) => {
    setExcelSheet(e.target.value);
    window.localStorage.setItem('taoBaoExcelSheetAboutAutoCommit', e.target.value);
  }

  return (
    <Fragment>
       <div class='jb_content'>
        <div>淘宝上传excel匹配页面对应的内容</div>
        {/* <input type='file' accept='.xlsx, .xls' onChange={(file) => { onImportExcel(file) }} /> */}
        <button onClick={authorizedDirectory}>点我授权目录</button>
        <button onClick={readFile}>读取本地文件</button>
        <input type="text" placeholder='默认读取第一个sheet' onChange={readExcelSheet} value={excelSheet} />
        <div>当前脚本自动操作: {switchScript ? '开' : '关'}<button onClick={operationScript}>{switchScript ? '关闭': '开启'}</button></div>
       </div>
    </Fragment>
  );
}

export default App;
