import { defineConfig } from 'vite';
import { sveltekit } from '@sveltejs/kit/vite';
import tailwind from '@tailwindcss/vite';

export default defineConfig({
	plugins: [sveltekit(), tailwind()],
	server: {
		proxy: {
			'/api': {
				target: 'https://book.sequoialab.ru',
				changeOrigin: true,
				secure: false
			}
		}
	}
});
