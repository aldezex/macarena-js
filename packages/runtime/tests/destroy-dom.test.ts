import { test, expect } from 'vitest';
import { h, hFragment, hText, destroyDOM, mountDOM } from '../src';

test('removeElementNode removes element and children from DOM', async () => {
	const child = h('span', {}, []);
	const node = h('div', {}, [child]);

	mountDOM(node, document.body);

	expect(document.querySelector('div')).not.toBeNull();
	expect(document.querySelector('span')).not.toBeNull();

	destroyDOM(node);

	expect(document.querySelector('div')).toBeNull();
	expect(document.querySelector('span')).toBeNull();
});

test('removeFragmentNodes removes fragment and children from DOM', async () => {
	const child = h('span', {}, []);
	const node = hFragment([child]);

	mountDOM(node, document.body);

	expect(document.querySelector('span')).not.toBeNull();

	destroyDOM(node);

	expect(document.querySelector('span')).toBeNull();
});

test('removeTextNode removes text node from DOM', async () => {
	const node = hText('Hello, world!');

	mountDOM(node, document.body);

	expect(document.body.textContent).toContain('Hello, world!');

	destroyDOM(node);

	expect(document.body.textContent).not.toContain('Hello, world!');
});

test('destroyDOM throws error if element is not defined', async () => {
	const node = h('div', {}, []);

	expect(() => destroyDOM(node)).toThrowError('DOM element is not defined');
});

test('destroyDOM throws error if type is unknown', async () => {
	const node = {
		type: 'unknown',
	};

	expect(() => destroyDOM(node as any)).toThrowError(
		'Unknown DOM type: unknown'
	);
});

test('destroyDOM removes complex tree from DOM', async () => {
	const virtualDOM = h('div', {}, [
		'hello',
		h('span', {}, []),
		hFragment([
			'world',
			h('span', {}, []),
			h('ul', {}, [
				h('li', {}, ['Item 1']),
				h('li', {}, ['Item 2']),
				hFragment([h('li', {}, ['Item 3']), 'extra text']),
			]),
		]),
	]);

	mountDOM(virtualDOM, document.body);

	expect(document.querySelector('div')).not.toBeNull();
	expect(document.querySelector('span')).not.toBeNull();
	expect(document.querySelector('ul')).not.toBeNull();
	expect(document.querySelectorAll('li').length).toBe(3);

	destroyDOM(virtualDOM);

	expect(document.querySelector('div')).toBeNull();
	expect(document.querySelector('span')).toBeNull();
	expect(document.querySelector('ul')).toBeNull();
	expect(document.querySelectorAll('li').length).toBe(0);
});
