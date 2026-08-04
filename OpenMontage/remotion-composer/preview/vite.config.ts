import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';
import {fileURLToPath} from 'node:url';
import {dirname, resolve} from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));

// 独立的场景模板预览工具：以 preview/ 为根的 Vite + React 应用，
// 复用 ../src 下的场景源码与 ../node_modules，不影响 Remotion 渲染管线。
export default defineConfig({
	root: here,
	base: './',
	// 复用 Remotion 的 public/ 资源目录，使「最终效果」模式下 staticFile()
	// 引用的 UnityBG.mp4、数字人 VRM/FBX 等资源能被预览服务器正确加载。
	publicDir: resolve(here, '../public'),
	plugins: [react()],
	server: {
		host: true,
		port: 5174,
	},
	build: {
		outDir: resolve(here, 'dist'),
		emptyOutDir: true,
	},
});
