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
        name: '京东脚本',
        icon: 'https://ts1.cn.mm.bing.net/th?id=OIP-C.hpjQBHE4wfYFA1nm4KhTDwAAAA&w=173&h=185&c=8&rs=1&qlt=90&o=6&dpr=1.3&pid=3.1&rm=2',
        namespace: 'npm/vite-plugin-monkey',
        match: ['https://pauction.shop.jd.com/platform/gem/index/create?*', 'http://127.0.0.1:5500/%E5%9F%BA%E7%A1%80/html/let%E6%98%AF%E5%90%A6%E4%BC%9A%E6%8C%82%E8%BD%BD%E5%88%B0windows%E4%B8%8A.html'],
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
