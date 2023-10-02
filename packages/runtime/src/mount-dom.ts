import { DOM_TYPES, HChild, HElement, HFragment, HNode, HText } from './h';
import { withoutNulls } from './utils/arrays';
import { addEventListeners } from './utils/events';
import { setAttributes } from './utils/props';
import { mapTextNodes } from './utils/text';

export function normalizeChildren(array: HChild[]): HNode[] {
	return withoutNulls(
		mapTextNodes(array.filter(item => item !== null) as HNode[])
	);
}

function appendChildren(
	element: HTMLElement,
	children: HChild[],
	index?: number
): void {
	const normalizedChildren = normalizeChildren(children);
	normalizedChildren.forEach((child, i) => {
		mountDOM(child, element, index ? index + i : undefined);
	});
}

function mountElement(
	node: HElement,
	parent: HTMLElement,
	index?: number
): void {
	const { tag, props, children } = node;

	const element = document.createElement(tag);
	addProps(element, props, node);
	node.el = element;

	children.forEach((child: HChild) => {
		mountDOM(child as HNode, element);
	});

	insert(element, parent, index);
}

function addProps(
	element: HTMLElement,
	props: Record<string, any>,
	node: HElement
): void {
	const { on: events, ...rest } = props;

	node.listeners = addEventListeners(events, element);
	setAttributes(element, rest);
}

function mountFragment(
	node: HFragment,
	parent: HTMLElement,
	index?: number
): void {
	node.el = parent;

	appendChildren(parent, node.children, index);
}

function mountText(node: HText, parent: HTMLElement, index?: number): void {
	const textNode = document.createTextNode(node.text);
	node.el = textNode;

	insert(textNode, parent, index);
}

function mountDOM(node: HNode, parent: HTMLElement, index?: number): void {
	switch (node.type) {
		case DOM_TYPES.ELEMENT:
			mountElement(node, parent, index);
			break;
		case DOM_TYPES.FRAGMENT:
			mountFragment(node, parent, index);
			break;
		case DOM_TYPES.TEXT:
			mountText(node, parent, index);
			break;
	}
}

function insert(el: Node, parent: Node, index?: number): void {
	if (index == null) {
		parent.appendChild(el);
		return;
	}

	if (index < 0) {
		throw new Error('Index must be positive');
	}

	const child = parent.childNodes;

	if (index >= child.length) {
		parent.appendChild(el);
	} else {
		parent.insertBefore(el, child[index]);
	}
}

export { mountDOM };
