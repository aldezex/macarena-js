import { DOM_TYPES, HChild, HElement, HFragment, HNode, HText } from './h';
import { withoutNulls } from './utils/arrays';
import { addEventListeners } from './utils/events';
import { applyClasses, applyStyles, setAttribute } from './utils/props';
import { mapTextNodes } from './utils/text';

function createElement(node: HElement): HTMLElement {
	return document.createElement(node.tag);
}

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
	const element = createElement(node);
	node.el = element;

	const { styles, className, on: events, ...props } = node.props;

	if (events) {
		node.listeners = addEventListeners(events, element);
	}

	if (styles) {
		applyStyles(element, styles);
	}

	if (className) {
		applyClasses(element, className);
	}

	for (const [key, value] of Object.entries(props)) {
		setAttribute(element, key, value);
	}

	appendChildren(element, node.children);
	parent.appendChild(element);
}

function mountFragment(node: HFragment, parent: HTMLElement): void {
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
