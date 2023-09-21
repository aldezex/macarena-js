import { DOM_TYPES, VNode } from '../nodes';

export const ARRAY_DIFF_OP = {
	REMOVE: 'remove',
	NOOP: 'noop',
	ADD: 'add',
	MOVE: 'move',
} as const;

export function objectsDiff(
	oldObject: Record<string, any>,
	newObject: Record<string, any>
) {
	const oldKeys = Object.keys(oldObject);
	const newKeys = Object.keys(newObject);

	return {
		added: newKeys.filter(key => !oldKeys.includes(key)),
		removed: oldKeys.filter(key => !newKeys.includes(key)),
		updated: newKeys.filter(
			key => oldKeys.includes(key) && oldObject[key] !== newObject[key]
		),
	};
}

export function arraysDiff(oldArray: string[], newArray: string[]) {
	return {
		added: newArray.filter(item => !oldArray.includes(item)),
		removed: oldArray.filter(item => !newArray.includes(item)),
	};
}

class ArrayWithOriginalIndexes<T> {
	private array: T[];
	private originalIndexes: number[];
	private equalsFn: (a: T, b: T) => boolean;

	constructor(array: T[], equalsFn: (a: T, b: T) => boolean) {
		this.equalsFn = equalsFn;
		this.array = array;
		this.originalIndexes = array.map((_, i) => i);
	}

	get length() {
		return this.array.length;
	}

	isRemoval(index: number, newArray: T[]) {
		if (index >= this.length) return false;

		const item = this.array[index];
		const indexInNewArray = newArray.findIndex(newItem =>
			this.equalsFn(item, newItem)
		);

		return indexInNewArray === -1;
	}

	removeItem(index: number) {
		const operation = {
			op: ARRAY_DIFF_OP.REMOVE,
			index,
			item: this.array[index],
		};

		this.array.splice(index, 1);
		this.originalIndexes.splice(index, 1);

		return operation;
	}

	isNoop(index: number, newArray: T[]) {
		if (index >= this.length) return false;

		const item = this.array[index];
		const newItem = newArray[index];

		return this.equalsFn(item, newItem);
	}

	originalIndexAt(index: number) {
		return this.originalIndexes[index];
	}

	noopItem(index: number) {
		return {
			op: ARRAY_DIFF_OP.NOOP,
			originalIndex: this.originalIndexAt(index),
			index,
			item: this.array[index],
		};
	}

	isAddition(item: T, fromIdx: number) {
		return this.findIndexFrom(item, fromIdx) === -1;
	}

	findIndexFrom(item: T, fromIdx: number) {
		for (let i = fromIdx; i < this.length; i++) {
			if (this.equalsFn(item, this.array[i])) return i;
		}

		return -1;
	}

	addItem(index: number, item: T) {
		const operation = {
			op: ARRAY_DIFF_OP.ADD,
			index,
			item,
		};

		this.array.splice(index, 0, item);
		this.originalIndexes.splice(index, 0, -1);

		return operation;
	}

	moveItem(item: T, toIndex: number) {
		const fromIndex = this.findIndexFrom(item, toIndex);
		const operation = {
			op: ARRAY_DIFF_OP.MOVE,
			fromIndex,
			toIndex,
			item,
		};

		const [_item] = this.array.splice(fromIndex, 1);
		this.array.splice(toIndex, 0, _item);

		const [_originalIndex] = this.originalIndexes.splice(fromIndex, 1);
		this.originalIndexes.splice(toIndex, 0, _originalIndex);

		return operation;
	}

	removeItemsAfter(index: number) {
		const operations = [];

		while (this.length > index) {
			operations.push(this.removeItem(index));
		}

		return operations;
	}
}

export function arraysDiffSequence<T, U>(
	oldArray: T[],
	newArray: T[],
	equalsFn: (a: T, b: T) => boolean = (a, b) => a === b
) {
	const sequence = [];
	const array = new ArrayWithOriginalIndexes(oldArray, equalsFn);

	for (let i = 0; i < newArray.length; i++) {
		if (array.isRemoval(i, newArray)) {
			sequence.push(array.removeItem(i));
			i--;
			continue;
		}

		if (array.isNoop(i, newArray)) {
			sequence.push(array.noopItem(i));
			continue;
		}

		const item = newArray[i];

		if (array.isAddition(item, i)) {
			sequence.push(array.addItem(i, item));
			continue;
		}

		sequence.push(array.moveItem(item, i));
	}

	sequence.push(...array.removeItemsAfter(newArray.length));

	return sequence;
}

export function areNodesEqual(nodeOne: VNode, nodeTwo: VNode) {
	if (nodeOne.type !== nodeTwo.type) {
		return false;
	}

	if (
		nodeOne.type === DOM_TYPES.ELEMENT &&
		nodeTwo.type === DOM_TYPES.ELEMENT
	) {
		const { tag: tagOne } = nodeOne;
		const { tag: tagTwo } = nodeTwo;

		return tagOne === tagTwo;
	}

	return true;
}
