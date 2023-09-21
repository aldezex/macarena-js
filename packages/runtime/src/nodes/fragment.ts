import { destroyDOM } from '../destroy-dom';
import { mountDOM } from '../mount-dom';
import { ChildrenVNode, DOM_TYPES, VNodeFragment } from '../nodes';
import { withoutNulls } from '../utils/arrays';
import { mapTextNodes } from './text';

export function hFragment(vNodes: ChildrenVNode[]): VNodeFragment {
	const children = mapTextNodes(withoutNulls(vNodes));

	return {
		type: DOM_TYPES.FRAGMENT,
		children,
		el: null,
	};
}

export function createFragmentNodes(
	vdom: VNodeFragment,
	parentEl: HTMLElement,
	index?: number
) {
	const { children } = vdom;
	vdom.el = parentEl;

	children.forEach((child, i) =>
		mountDOM(child, parentEl, index ? index + i : undefined)
	);
}

export function removeFragmentNodes(vdom: VNodeFragment) {
	const { children } = vdom;
	children.forEach(destroyDOM);
}
