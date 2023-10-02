import { DOM_TYPES, HElement, HFragment, HNode, HText } from './h';

function destroyDOM(node: HNode): void {
	const { type } = node;

	switch (type) {
		case DOM_TYPES.ELEMENT:
			removeElementNode(node as HElement);
			break;

		case DOM_TYPES.FRAGMENT:
			removeFragmentNodes(node as HFragment);
			break;

		case DOM_TYPES.TEXT:
			removeTextNode(node as HText);
			break;

		default:
			throw new Error(`Unknown DOM type: ${type}`);
	}

	node.el = undefined;
}

function removeElementNode(node: HElement): void {
	if (!node.el) {
		throw new Error('DOM element is not defined');
	}

	node.children
		.filter(child => child !== null)
		.forEach(child => {
			destroyDOM(child as HNode);
		});

	node.el.remove();
}

function removeFragmentNodes(node: HFragment): void {
	node.children
		.filter(child => child !== null)
		.forEach(child => {
			destroyDOM(child as HNode);
		});
}

function removeTextNode(node: HText): void {
	if (!node.el) {
		throw new Error('DOM element is not defined');
	}
	node.el.remove();
}

export { destroyDOM };
