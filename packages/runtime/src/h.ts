import { ChildrenVNode, DOM_TYPES, VNodeElement } from './nodes';
import { mapTextNodes } from './nodes/text';
import { withoutNulls } from './utils/arrays';

export function h(
	tag: string,
	props: Record<string, any> = {},
	children: ChildrenVNode[] = []
) {
	return {
		tag,
		props,
		children: mapTextNodes(withoutNulls(children)),
		type: DOM_TYPES.ELEMENT,
	} as VNodeElement;
}
