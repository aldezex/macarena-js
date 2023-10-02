import { HNode, hText } from '../h';

export function mapTextNodes(array: HNode[]) {
	return array.map(item =>
		typeof item === 'string' || typeof item === 'number' ? hText(item) : item
	);
}
