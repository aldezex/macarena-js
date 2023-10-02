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

function appendChildren(element: HTMLElement, children: HChild[]): void {
	const normalizedChildren = normalizeChildren(children);
	normalizedChildren.forEach(child => {
		mountDOM(child, element);
	});
}

function mountElement(node: HElement, parent: HTMLElement): void {
	const { tag, props, children } = node;

	const element = document.createElement(tag);
	addProps(element, props, node);
	node.el = element;

	children.forEach((child: HChild) => {
		mountDOM(child as HNode, element);
	});

	parent.appendChild(element);
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

function mountFragment(node: HFragment, parent: HTMLElement): void {
	node.el = parent;

	appendChildren(parent, node.children);
}

function mountText(node: HText, parent: HTMLElement): void {
	const textNode = document.createTextNode(node.text);
	node.el = textNode;

	parent.appendChild(textNode);
}

function mountDOM(node: HNode, parent: HTMLElement): void {
	switch (node.type) {
		case DOM_TYPES.ELEMENT:
			mountElement(node, parent);
			break;
		case DOM_TYPES.FRAGMENT:
			mountFragment(node, parent);
			break;
		case DOM_TYPES.TEXT:
			mountText(node, parent);
			break;
	}
}

export { mountDOM };
