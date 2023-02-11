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
        name: '哔哩哔哩获取正在直播的up列表',
        icon: 'https://pic2.zhimg.com/v2-58bd7241580b48ecc6aeed62dda2939b_1440w.jpg?source=172ae18b',
        namespace: 'npm/vite-plugin-monkey',
        match: ['https://t.bilibili.com/*'],
        description: '哔哩哔哩获取正在直播的up列表,关注的up多了可能急需这个功能，要不然得每次点更多才可以拿到'
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
