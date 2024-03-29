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
        name: '淘宝脚本自动读取excel提交',
        icon: 'https://ts1.cn.mm.bing.net/th?id=OIP-C.hpjQBHE4wfYFA1nm4KhTDwAAAA&w=173&h=185&c=8&rs=1&qlt=90&o=6&dpr=1.3&pid=3.1&rm=2',
        namespace: 'npm/vite-plugin-monkey',
        match: ['https://paimai.taobao.com/console/edit_auction.htm?*', 'https://paimai.taobao.com/console/unialbum/index.htm#/auction/list'],
      },
      build: {
        // sourcemap: 'inline',
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
});
