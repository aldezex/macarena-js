import { destroyDOM } from '../destroy-dom';
import { insert, mountDOM } from '../mount-dom';
import { ChildrenVNode, DOM_TYPES, VNode, VNodeFragment } from '../nodes';
import { withoutNulls } from '../utils/arrays';
import { mapTextNodes } from './text';

export function hFragment(vNodes: ChildrenVNode[], props = {}): VNodeFragment {
	const children = mapTextNodes(withoutNulls(vNodes)) as VNode[];

	for (const child of children) {
		if (child && child.type !== DOM_TYPES.TEXT) {
			child.props = { ...child.props, ...props };
		}
	}

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

	const fragment = document.createDocumentFragment();
	vdom.el = parentEl;

	children.forEach((child, i) => mountDOM(child, parentEl));
	insert(fragment, parentEl, index);
}

export function removeFragmentNodes(vdom: VNodeFragment) {
	const { children } = vdom;
	children.forEach(destroyDOM);
}
