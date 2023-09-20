import { ChildrenVNode } from '../nodes';

export function withoutNulls(arr: ChildrenVNode[]) {
	return arr.filter(item => item !== null);
}
