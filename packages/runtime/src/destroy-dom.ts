import { DOM_TYPES, VNode } from './nodes';
import { removeElementNode } from './nodes/element';
import { removeFragmentNodes } from './nodes/fragment';
import { removeTextNode } from './nodes/text';

export function destroyDOM(vdom: VNode) {
	const { type, el } = vdom;

	switch (type) {
		case DOM_TYPES.ELEMENT: {
			removeElementNode(vdom);
			break;
		}

		case DOM_TYPES.FRAGMENT: {
			removeFragmentNodes(vdom);
			break;
		}

		case DOM_TYPES.TEXT: {
			removeTextNode(vdom);
			break;
		}

		default: {
			throw new Error(`Unknown DOM type: ${type}`);
		}
	}

	vdom.el = null;
}
