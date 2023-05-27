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
        name: '单词本记录',
        icon: 'https://bpic.588ku.com/element_origin_min_pic/19/06/25/5eba9cb233c28bd907e69c04ba6e1a89.jpg',
        namespace: 'npm/vite-plugin-monkey',
        match: ['https://github.com/', 'https://react.dev/reference/react'],
        description: '哔哩哔哩获取正在直播的up列表,关注的up多了可能急需这个功能，要不然得每次点更多才可以拿到',
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
