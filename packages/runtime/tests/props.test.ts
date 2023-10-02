import { test, expect, vi } from 'vitest';

import { destroyDOM, h, mountDOM } from '../src/';

test('mountDOM and applyStyles works together', () => {
	const vDOM = h('div', { styles: { color: 'blue', 'font-size': '20px' } }, []);
	mountDOM(vDOM, document.body);

	const element = document.querySelector('div');
	expect(element?.style.color).toBe('blue');
	expect(element?.style.fontSize).toBe('20px');

	destroyDOM(vDOM);
});

test('mountDOM and applyClasses works together', () => {
	const vDOM = h('div', { className: 'foo bar' }, [
		h('div', { className: ['foo', 'bar'] }, []),
	]);
	mountDOM(vDOM, document.body);

	const element = document.querySelector('div');
	expect(element?.classList.contains('foo')).toBe(true);
	expect(element?.classList.contains('bar')).toBe(true);
	expect(element?.className).toBe('foo bar');

	const element2 = document.querySelector('div div');
	expect(element2?.classList.contains('foo')).toBe(true);
	expect(element2?.classList.contains('bar')).toBe(true);
	expect(element2?.className).toBe('foo bar');

	destroyDOM(vDOM);
});

test('we can add and remove attributes', () => {
	const vDOM = h('div', { id: 'foo', className: 'bar', 'data-test': 'test' });
	mountDOM(vDOM, document.body);

	const element = document.querySelector('div');
	expect(element?.id).toBe('foo');
	expect(element?.className).toBe('bar');
	expect(element?.getAttribute('data-test')).toBe('test');

	destroyDOM(vDOM);
});

test('we can add and remove event listeners', () => {
	const onClick = vi.fn();

	const vDOM = h('div', {
		on: {
			click: onClick,
		},
	});
	mountDOM(vDOM, document.body);

	const element = document.querySelector('div');
	element?.click();

	expect(onClick).toHaveBeenCalledTimes(1);

	destroyDOM(vDOM);
});
