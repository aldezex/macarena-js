import { ChildrenVNode, DOM_TYPES, VNodeText } from '../nodes';

export function mapTextNodes(arr: ChildrenVNode[]) {
	return arr.map(item =>
		typeof item === 'string' || typeof item === 'number' ? hString(item) : item
	);
}

export function hString(str: string): VNodeText {
	return { type: DOM_TYPES.TEXT, value: str, el: null };
}

export function createTextNode(vdom: VNodeText, parentEl: HTMLElement) {
	const { value } = vdom;

	const textNode = document.createTextNode(value);
	vdom.el = textNode;

	parentEl.append(textNode);
}

export function removeTextNode(vdom: VNodeText) {
	const { el } = vdom;
	el?.remove();
}
