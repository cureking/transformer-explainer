import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
	css: {
		preprocessorOptions: {
			scss: {
				additionalData: `@import 'src/styles/variables.scss';`
			}
		}
	},
	// d3 的 transition 依赖 d3-transition 的副作用注入原型；若解析出多份 d3-selection 会丢方法
	resolve: {
		dedupe: ['d3', 'd3-selection', 'd3-transition', 'd3-scale', 'd3-shape']
	},
	// gsap 的 CJS/ESM 双入口在 Vite 5 的 SSR 外部化下会出现 named export 解析失败，
	// 交给 Vite 打包（而非 Node 直接 import）可同时兼容 dev 与 build
	ssr: {
		noExternal: ['gsap']
	},
	server: {
		fs: {
			// Allow serving files from one level up to the project root
			allow: ['..']
		}
	}
});
