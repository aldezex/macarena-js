import { createApp } from '../../packages/runtime/dist/runtime.es';
import { h } from '../../packages/runtime/src/h';

const app = createApp({
	state: [
		{ todo: 'Walk the dog', done: true },
		{ todo: 'Learn JavaScript', done: false },
		{ todo: 'Watch TV', done: false },
	],
	reducers: {
		addTodo: (state, payload) => [...state, payload],
		completeTodo: (state, payload) =>
			state.map((todo, index) => {
				if (index === payload) {
					return { ...todo, done: !todo.done };
				}
				return todo;
			}),
	},
	view: (state, emit) =>
		h('h1', {}, [
			`Todos`,
			h('div', {}, [
				h('input', {
					type: 'text',
					onkeyup: event => {
						if (event.keyCode === 13) {
							emit('addTodo', {
								done: false,
								todo: event.target.value,
							});
							event.target.value = '';
						}
					},
				}),
				...state.map((todo, index) => {
					return h('div', {}, [
						h(
							'input',
							{
								type: 'checkbox',
								checked: todo.done,
								onclick: () => emit('completeTodo', index),
							},
							[]
						),
						h(
							'span',
							{
								style: {
									opacity: todo.done ? 0.5 : 1,
								},
							},
							[todo.todo]
						),
					]);
				}),
			]),
		]),
});

const el = document.body;
app.mount(el);
