import { useEffect } from 'react';
import { useState, Fragment } from 'react';
import * as XLSX from 'xlsx';
import './App.css'

function App() {
  let dirHandle;
  useEffect(() => {
    console.log(1111);
    // document.getElementsByClassName('J_Tags J_Tagsservice_block')[0].checked=false
    // setTimeout(() => {
    //   document.getElementsByClassName('submit-btn text-btn')[0].click()
    // }, 2000);
  }, [])

  const onImportExcel = (file) => {
     // 获取上传的文件对象
     const { files } = file.target;
     // 通过FileReader对象读取文件
     const fileReader = new FileReader();
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
             // break; // 如果只取第一张表，就取消注释这行
           }
         }
         // 获取当前页面sku的id
         const skuId = getQueryVariable('item_id')
         // 如果存在我们就要对页面进行操作
         if (skuId) {
            const matchGoods = data.filter((item) => item.SKU == skuId)
            if (matchGoods.length == 1) {
              for(let key in matchGoods[0]) {
                if (key == '七天无理由（1代表勾）（0代表不勾）') {
                  console.log('选中7天无理由')
                  if (matchGoods[0][key] == 1) {
                    document.getElementsByClassName('J_Tags J_Tagsservice_block')[0].checked=true
                  } else {
                    document.getElementsByClassName('J_Tags J_Tagsservice_block')[0].checked=false
                  }
                } else if (key == '先鉴别后发货') {
                  console.log('选中先鉴别后发货', matchGoods[0][key], key);
                  // 1的时候勾选先鉴别后，0为不勾选
                  if (matchGoods[0][key] == 1) {
                    document.querySelector('.J_Tags.J_Tagsindustry_block').checked = true
                  } else {
                    document.querySelector('.J_Tags.J_Tagsindustry_block').checked = false
                  }
                }
              }
            } else {
              console.log('当前页面匹配到excel中有两个相同的skuid不知道操作哪一个，请检查');
            }

         } else {
          console.log('脚本对当前页面无效')
         }
         console.log('42',data);

       } catch (e) {
         // 这里可以抛出文件类型错误不正确的相关提示
         console.log('文件类型不正确');
         return;
       }
     };
     // 以二进制方式打开文件
     fileReader.readAsBinaryString(files[0]);
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
        console.log(res);
        // console.log(res.target.result);
        onImportExcel(fileData)
      }
    }
  }

  return (
    <Fragment>
       <div class='jb_content'>
        <div>淘宝上传excel匹配页面对应的内容</div>
        <input type='file' accept='.xlsx, .xls' onChange={(file) => { onImportExcel(file) }} />
        <button onClick={authorizedDirectory}>点我授权目录</button>
        <button onClick={readFile}>读取本地文件</button>
       </div>
    </Fragment>
  );
}

export default App;
