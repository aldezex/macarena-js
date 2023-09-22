import { destroyDOM } from '../destroy-dom';
import { setAttributes } from '../lib/attributes';
import { addEventListeners, removeEventListeners } from '../lib/events';
import { insert, mountDOM } from '../mount-dom';
import { VNodeElement } from '../nodes';

export function createElementNode(
	vdom: VNodeElement,
	parentEl: HTMLElement,
	index?: number
) {
	const { tag, props, children } = vdom;

	const element = document.createElement(tag);
	addProps(element, props, vdom);
	vdom.el = element;

	children.forEach(child => mountDOM(child, element, undefined));
	insert(element, parentEl, index);
}

export function removeElementNode(vdom: VNodeElement) {
	const { el, children, listeners } = vdom;

	el?.remove();
	children.forEach(destroyDOM);

	if (listeners && el) {
		removeEventListeners(listeners, el);
		delete vdom.listeners;
	}
}

function addProps(
	el: HTMLElement,
	props: Record<string, unknown>,
	vdom: VNodeElement
) {
	const { on: events, ...attrs } = props;

	vdom.listeners = addEventListeners(
		events as Record<string, EventListener>,
		el
	);
	setAttributes(el, attrs);
}
