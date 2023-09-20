import { ChildrenVNode, DOM_TYPES, VNodeFragment } from '../nodes';
import { withoutNulls } from '../utils/arrays';
import { mapTextNodes } from './text';

export function hFragment(vNodes: ChildrenVNode[]): VNodeFragment {
	const children = mapTextNodes(withoutNulls(vNodes));

	return {
		type: DOM_TYPES.FRAGMENT,
		children,
	};
}
