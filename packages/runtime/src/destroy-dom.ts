import { DOM_TYPES, VNode } from './nodes';
import { removeElementNode } from './nodes/element';
import { removeFragmentNodes } from './nodes/fragment';
import { removeTextNode } from './nodes/text';

export function destroyDOM(vdom: VNode) {
	switch (vdom.type) {
		case DOM_TYPES.ELEMENT:
			return removeElementNode(vdom);
		case DOM_TYPES.FRAGMENT:
			return removeFragmentNodes(vdom);
		case DOM_TYPES.TEXT:
			return removeTextNode(vdom);
	}
}
