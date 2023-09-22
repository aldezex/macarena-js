import { createApp } from '../../packages/runtime/dist/runtime.es';
import { h } from '../../packages/runtime/src/h';

const app = createApp({
	state: 0,
	reducers: {
		add: (state, amount) => state + amount,
		substract: (state, amount) => state - amount,
	},
	view: (state, emit) =>
		h('h1', {}, [
			`Count: ${state}`,
			h('div', {}, [
				h('button', { onclick: () => emit('add', 1) }, ['Add']),
				h('button', { onclick: () => emit('substract', 1) }, ['Substract']),
				state > 10 ? 'Count is greater than 10' : null,
			]),
		]),
});

const el = document.body;
app.mount(el);
