import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import monkey, { cdn } from 'vite-plugin-monkey';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    monkey({
      entry: 'src/main.jsx',
      userscript: {
        name: "快速跳转语雀进行内容收藏",
        version: '0.0.0',
        icon: 'https://ts1.cn.mm.bing.net/th?id=OIP-C.hpjQBHE4wfYFA1nm4KhTDwAAAA&w=173&h=185&c=8&rs=1&qlt=90&o=6&dpr=1.3&pid=3.1&rm=2',
        namespace: 'npm/vite-plugin-monkey',
        author: 'xiaolaji',
        description: '快速跳转语雀进行内容收藏',
        grant: ['GM.addElement'],
        $extra: {
          grant: ['GM_cookie', 'GM_getValue', 'GM_setValue'],
        },
        match: ['https://www.bilibili.com/*', 
        'http://127.0.0.1:5500/%E5%9F%BA%E7%A1%80/html/%E6%B5%8B%E8%AF%95%E8%84%9A%E6%9C%AC%E7%9A%84%E6%89%A7%E8%A1%8C%E6%97%B6%E6%9C%BA.html',
        'https://www.yuque.com/*'
      ],
      },
      build: {
        sourcemap: 'inline',
        externalGlobals: {
          react: cdn.jsdelivr('React', 'umd/react.production.min.js'),
          'react-dom': cdn.jsdelivr(
            'ReactDOM',
            'umd/react-dom.production.min.js',
          ),
        },
      },
    }),
  ],
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
        additionalData: '@root-entry-name: default;',
      },
    },
  },
});
