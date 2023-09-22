import { defineConfig } from 'vite';

export default defineConfig({
	build: {
		lib: {
			entry: 'src/app.ts',
			fileName: format => `runtime.${format}.js`,
			name: 'runtime',
		},
	},
});
