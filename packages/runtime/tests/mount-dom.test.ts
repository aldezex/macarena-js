// mountDOM.spec.ts
import { test, expect } from 'vitest';
import { h, hFragment, hText, mountDOM, HNode } from '../src';

test('mountDOM mounts HText', () => {
	const parentNode = document.createElement('div');
	const node: HNode = hText('hello');
	mountDOM(node, parentNode);

	const child = parentNode.childNodes[0];
	if (child?.nodeType === 3) {
		expect((child as Text).nodeValue).toBe('hello');
	} else {
		throw new Error('The child is not a text node');
	}
});

test('mountDOM mounts HElement', () => {
	const parentNode = document.createElement('div');
	const node: HNode = h('span', {}, []);
	mountDOM(node, parentNode);

	const child = parentNode.childNodes[0];
	if (child?.nodeType === 1) {
		expect((child as HTMLElement).tagName).toBe('SPAN');
	} else {
		throw new Error('The child is not an element node');
	}
});

test('mountDOM mounts HFragment', () => {
	const parentNode = document.createElement('div');
	const node: HNode = hFragment([hText('hello'), h('span', {}, [])]);
	mountDOM(node, parentNode);

	const textChild = parentNode.childNodes[0] as Text;
	const elementChild = parentNode.childNodes[1] as HTMLElement;

	if (textChild?.nodeType === 3 && elementChild?.nodeType === 1) {
		expect(textChild.nodeValue).toBe('hello');
		expect(elementChild.tagName).toBe('SPAN');
	} else {
		throw new Error(
			'The child is not a text node or the element is not an element node'
		);
	}
});

test('mountDOM mounts complex tree', () => {
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

	const parent = document.createElement('div');
	mountDOM(virtualDOM, parent);

	const serialized = parent.innerHTML;
	const expected =
		'<div>hello<span></span>world<span></span><ul><li>Item 1</li><li>Item 2</li><li>Item 3</li>extra text</ul></div>';

	expect(serialized).toBe(expected);
});
