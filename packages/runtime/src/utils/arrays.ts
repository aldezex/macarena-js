import { HNode } from '../h';

export function withoutNulls(array: HNode[]) {
	return array.filter(item => item !== null);
}
