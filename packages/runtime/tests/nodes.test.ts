import { describe, expect, it, test } from 'vitest';

import { DOM_TYPES } from '../src/nodes';
import { hString } from '../src/nodes/text';
import { hFragment } from '../src/nodes/fragment';
import { h } from '../src/h';

describe('We can create text nodes', () => {
	it('should create a text node', () => {
		const want = {
			type: DOM_TYPES.TEXT,
			value: 'Hello world!',
			el: null,
		};

		const got = hString('Hello world!');

		expect(got).toEqual(want);
	});
});

describe('We can create fragments', () => {
	it('should create a fragment', () => {
		const want = {
			type: DOM_TYPES.FRAGMENT,
			el: null,
			children: [
				{
					type: DOM_TYPES.TEXT,
					value: 'Hello world!',
					el: null,
				},
			],
		};

		const got = hFragment(['Hello world!']);

		expect(got).toEqual(want);
	});
});

describe('We can create elements', () => {
	it('should create an element', () => {
		const want = {
			type: DOM_TYPES.ELEMENT,
			tag: 'div',
			props: {},
			children: [
				{
					el: null,
					type: DOM_TYPES.TEXT,
					value: 'Hello world!',
				},
			],
		};

		const got = h('div', {}, ['Hello world!']);

		expect(got).toEqual(want);
	});

	it('should create element with props', () => {
		const want = {
			type: DOM_TYPES.ELEMENT,
			tag: 'div',
			props: {
				id: 'foo',
				class: 'bar',
			},
			children: [
				{
					type: DOM_TYPES.TEXT,
					value: 'Hello world!',
					el: null,
				},
			],
		};

		const got = h('div', { id: 'foo', class: 'bar' }, ['Hello world!']);

		expect(got).toEqual(want);
	});
});

describe('We can create more complex VDOMS', () => {
	it('should create a complex VDOM', () => {
		const want = {
			type: DOM_TYPES.ELEMENT,
			tag: 'div',
			props: {},
			children: [
				{
					el: null,
					type: DOM_TYPES.TEXT,
					value: 'Hello world!',
				},
				{
					type: DOM_TYPES.ELEMENT,
					tag: 'span',
					props: {},
					children: [
						{
							type: DOM_TYPES.TEXT,
							value: 'Hello world!',
							el: null,
						},
						{
							type: DOM_TYPES.ELEMENT,
							tag: 'p',
							props: {},
							children: [
								{
									el: null,
									type: DOM_TYPES.TEXT,
									value: 'Hello world!',
								},
							],
						},
					],
				},
				{
					type: DOM_TYPES.ELEMENT,
					tag: 'p',
					props: {},
					children: [
						{
							type: DOM_TYPES.TEXT,
							value: 'Hello world!',
							el: null,
						},
					],
				},
			],
		};

		const got = h('div', {}, [
			'Hello world!',
			h('span', {}, ['Hello world!', h('p', {}, ['Hello world!'])]),
			h('p', {}, ['Hello world!']),
		]);

		expect(got).toEqual(want);
	});
});
