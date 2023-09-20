import { ChildrenVNode, DOM_TYPES, VNodeText } from '../nodes';

export function mapTextNodes(arr: ChildrenVNode[]) {
	return arr.map(item => (typeof item === 'string' ? hString(item) : item));
}

export function hString(str: string): VNodeText {
	return { type: DOM_TYPES.TEXT, value: str };
}
