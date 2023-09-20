import { describe, expect, it } from 'vitest';

import { createTextNode, hString, removeTextNode } from '../src/nodes/text';
import { createElementNode, removeElementNode } from '../src/nodes/element';
import {
	createFragmentNodes,
	hFragment,
	removeFragmentNodes,
} from '../src/nodes/fragment';
import { h } from '../src/h';

describe('We can mount and destroy text nodes', () => {
	it('should mount a text node', () => {
		const parentEl = document.createElement('div');

		const text = hString('Hello world!');
		createTextNode(text, parentEl);

		expect(parentEl.childNodes[0]).toBe(text.el);
		expect(text.el?.textContent).toBe('Hello world!');
	});

	it('should mount a text node and destroy it', () => {
		const parentEl = document.createElement('div');

		const text = hString('Hello world!');
		createTextNode(text, parentEl);

		expect(parentEl.childNodes[0]).toBe(text.el);
		expect(text.el?.textContent).toBe('Hello world!');

		removeTextNode(text);
		expect(parentEl.childNodes[0]).toBe(undefined);
	});
});

describe('We can mount and destroy element nodes', () => {
	it('should mount an element node', () => {
		const parentEl = document.createElement('div');

		const element = h('div', {}, []);
		createElementNode(element, parentEl);

		expect(parentEl.childNodes[0]).toBe(element.el);
		expect(element.el?.tagName).toBe('DIV');
	});

	it('should mount an element node with props and childrens', () => {
		const parentEl = document.createElement('div');

		const element = h('div', { id: 'test', className: 'bg-red-400' }, [
			h(
				'span',
				{
					className: 'text-white',
				},
				['Hello world!']
			),
		]);

		createElementNode(element, parentEl);

		expect(parentEl.childNodes[0]).toBe(element.el);
		expect(element.el?.tagName).toBe('DIV');
		expect(element.el?.getAttribute('id')).toBe('test');
		expect(element.el?.getAttribute('class')).toBe('bg-red-400');
		expect(element.el?.childNodes[0].tagName).toBe('SPAN');
		expect(element.el?.childNodes[0].getAttribute('class')).toBe('text-white');
	});

	it('should mount an element node with props and childrens and destroy it', () => {
		const parentEl = document.createElement('div');

		const element = h('div', { id: 'test', className: 'bg-red-400' }, [
			h(
				'span',
				{
					className: 'text-white',
				},
				['Hello world!']
			),
		]);

		createElementNode(element, parentEl);

		expect(parentEl.childNodes[0]).toBe(element.el);
		expect(element.el?.tagName).toBe('DIV');
		expect(element.el?.getAttribute('id')).toBe('test');
		expect(element.el?.getAttribute('class')).toBe('bg-red-400');
		expect(element.el?.childNodes[0].tagName).toBe('SPAN');
		expect(element.el?.childNodes[0].getAttribute('class')).toBe('text-white');

		removeElementNode(element);
		expect(parentEl.childNodes[0]).toBe(undefined);
	});
});

describe('We can mount and destroy fragment nodes', () => {
	it('should mount a fragment node', () => {
		const parentEl = document.createElement('div');

		const fragment = hFragment([]);
		createFragmentNodes(fragment, parentEl);

		expect(parentEl.childNodes.length).toEqual(0);
	});

	it('should mount a fragment node with childrens', () => {
		const parentEl = document.createElement('div');

		const fragment = hFragment([
			h('div', {}, []),
			h('div', {}, []),
			h('div', {}, []),
			h('div', {}, []),
		]);
		createFragmentNodes(fragment, parentEl);

		expect(parentEl.childNodes.length).toEqual(4);
	});

	it('should mount a fragment node with childrens and destroy it', () => {
		const parentEl = document.createElement('div');

		const fragment = hFragment([
			h('div', {}, []),
			h('div', {}, []),
			h('div', {}, []),
			h('div', {}, []),
		]);

		createFragmentNodes(fragment, parentEl);

		expect(parentEl.childNodes.length).toEqual(4);

		removeFragmentNodes(fragment);

		expect(parentEl.childNodes.length).toEqual(0);
	});
});
