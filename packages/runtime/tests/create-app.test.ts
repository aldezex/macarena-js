import { test, expect } from 'vitest';

import { createApp, h, hFragment } from '../src';

test('createApp works', () => {
	const app = createApp({
		view: () => hFragment([]),
		initialState: {},
	});

	expect(app).toBeDefined();
});

test('createApp mounts the app', () => {
	document.body.innerHTML = '<div id="app"></div>';

	const app = createApp({
		view: () => hFragment([]),
		initialState: {},
	});

	app.mount();

	const element = document.getElementById('app');
	expect(element).toBeDefined();
});

test('createApp unmounts the app', () => {
	document.body.innerHTML = '<div id="app"></div>';
	const element = document.getElementById('app');

	const app = createApp({
		view: () =>
			h(
				'div',
				{
					className: 'foo',
				},
				['Hello world']
			),
		initialState: {},
	});

	app.mount();

	expect(element?.children.length).toBe(1);

	app.unmount();

	expect(element?.children.length).toBe(0);
});

test('we can subscribe to events and rerender the app', () => {
	document.body.innerHTML = '<div id="app"></div>';
	const el = document.getElementById('app')!;

	const app = createApp({
		initialState: 0,
		reducers: {
			add: (state, amount) => state + amount,
			substract: (state, amount) => state - amount,
		},
		view: (state, emit) =>
			h('div', {}, [
				h(
					'button',
					{
						id: 'add',
						on: {
							click: () => {
								emit('add', 1);
							},
						},
					},
					['+']
				),
				h(
					'button',
					{ id: 'substract', on: { click: () => emit('substract', 1) } },
					['-']
				),
				h('span', {}, [state]),
			]),
	});

	app.mount();

	expect(el.querySelector('span')?.textContent).toBe('0');

	const add = el.querySelector('#add') as HTMLButtonElement;
	const substract = el.querySelector('#substract') as HTMLButtonElement;

	add.click();

	expect(el.querySelector('span')?.textContent).toBe('1');

	substract.click();

	expect(el.querySelector('span')?.textContent).toBe('0');

	add.click();
	add.click();

	expect(el.querySelector('span')?.textContent).toBe('2');

	substract.click();

	expect(el.querySelector('span')?.textContent).toBe('1');

	app.unmount();
});
