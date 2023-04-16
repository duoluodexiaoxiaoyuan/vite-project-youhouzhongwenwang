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
        name: '淘宝出价',
        icon: 'https://pic2.zhimg.com/v2-58bd7241580b48ecc6aeed62dda2939b_1440w.jpg?source=172ae18b',
        namespace: 'npm/vite-plugin-monkey',
        match: ['https://item-paimai.taobao.com/pmp_item/*'],
        description: '淘宝出价',
        license: 'MIT'
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
