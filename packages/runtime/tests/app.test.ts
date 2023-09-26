import { describe, expect, it } from 'vitest';

import { createApp } from '../src/app';
import { h } from '../src/h';
import { hString } from '../src/nodes/text';
import { hFragment } from '../src/nodes/fragment';

describe('createApp', () => {
	it('We can mount an app', () => {
		const app = createApp({
			state: 0,
			reducers: {
				add: (state, amount) => state + amount,
			},
			view: (state, emit) =>
				h('button', { on: { click: () => emit('add', 1) } }, [state]),
		});

		const el = document.createElement('div');
		app.mount(el);

		expect(el.innerHTML).toBe('<button>0</button>');

		const button = el.querySelector('button')!;
		button.click();

		expect(el.innerHTML).toBe('<button>1</button>');
	});

	it('We can create a more complex app', () => {
		const app = createApp({
			state: 0,
			reducers: {
				add: (state, amount) => state + amount,
				decrease: (state, amount) => state - amount,
			},
			view: (state, emit) =>
				h('div', {}, [
					h('button', { on: { click: () => emit('add', 1) } }, ['+']),
					h('button', { on: { click: () => emit('decrease', 1) } }, ['-']),
					h('span', {}, [state]),
				]),
		});

		const el = document.createElement('div');
		app.mount(el);

		expect(el.innerHTML).toBe(
			'<div><button>+</button><button>-</button><span>0</span></div>'
		);

		const buttons = el.querySelectorAll('button');
		buttons[0].click();
		buttons[0].click();
		buttons[1].click();

		expect(el.innerHTML).toBe(
			'<div><button>+</button><button>-</button><span>1</span></div>'
		);
	});

	it('We can unmount an app', () => {
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
						state == 0 ? h('p', {}, ['Count is zero']) : null,
					]),
				]),
		});

		const el = document.createElement('div');
		app.mount(el);

		expect(el.innerHTML).toBe(
			'<h1>Count: 0<div><button>Add</button><button>Substract</button><p>Count is zero</p></div></h1>'
		);

		const buttons = el.querySelectorAll('button');

		buttons[0].click();

		expect(el.innerHTML).toBe(
			'<h1>Count: 1<div><button>Add</button><button>Substract</button></div></h1>'
		);

		buttons[1].click();
		buttons[1].click();

		expect(el.innerHTML).toBe(
			'<h1>Count: -1<div><button>Add</button><button>Substract</button></div></h1>'
		);

		app.unmount();

		expect(el.innerHTML).toBe('');
	});
});
