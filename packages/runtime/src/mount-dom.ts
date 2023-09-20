import { DOM_TYPES, VNode } from './nodes';
import { createElementNode } from './nodes/element';
import { createFragmentNodes } from './nodes/fragment';
import { createTextNode } from './nodes/text';

export function mountDOM(vdom: VNode, parentEl: HTMLElement) {
	switch (vdom.type) {
		case DOM_TYPES.TEXT: {
			createTextNode(vdom, parentEl);
			break;
		}

		case DOM_TYPES.ELEMENT: {
			createElementNode(vdom, parentEl);
			break;
		}

		case DOM_TYPES.FRAGMENT: {
			createFragmentNodes(vdom, parentEl);
			break;
		}

		default: {
			throw new Error(`Unknown DOM type`);
		}
	}
}
