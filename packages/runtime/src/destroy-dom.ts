import { DOM_TYPES, HElement, HFragment, HNode, HText } from './h';
import { removeEventListeners } from './utils/events';

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

	delete node.el;
}

function removeElementNode(node: HElement): void {
	const { el, children, listeners } = node;

	if (!el) {
		throw new Error('DOM element is not defined');
	}

	el.remove();
	children.forEach(child => {
		destroyDOM(child as HNode);
	});

	if (listeners) {
		removeEventListeners(listeners, el);
		delete node.listeners;
	}
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
