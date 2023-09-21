import { DOM_TYPES, VNode } from './nodes';
import { createElementNode } from './nodes/element';
import { createFragmentNodes } from './nodes/fragment';
import { createTextNode } from './nodes/text';

export function mountDOM(vdom: VNode, parentEl: HTMLElement, index?: number) {
	switch (vdom.type) {
		case DOM_TYPES.TEXT: {
			createTextNode(vdom, parentEl, index);
			break;
		}

		case DOM_TYPES.ELEMENT: {
			createElementNode(vdom, parentEl, index);
			break;
		}

		case DOM_TYPES.FRAGMENT: {
			createFragmentNodes(vdom, parentEl, index);
			break;
		}

		default: {
			throw new Error(`Unknown DOM type`);
		}
	}
}

export function insert(
	el: HTMLElement | Text,
	parentEl: HTMLElement,
	index?: number
) {
	if (index == null) {
		parentEl.append(el);
		return;
	}

	if (index < 0) {
		throw new Error(`Index must be a positive integer, got ${index}`);
	}

	const children = parentEl.childNodes;

	if (index >= children.length) {
		parentEl.append(el);
	} else {
		parentEl.insertBefore(el, children[index]);
	}
}
