import { DOM_TYPES, HNode } from '../h';

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

export function arraysDiffSequence<T>(
	oldArray: T[],
	newArray: T[],
	equalsFn: (a: T, b: T) => boolean = (a, b) => a === b
): { op: string; index: number; item: T; from: number }[] {
	const { removals, movedPositions } = findRemovals(
		oldArray,
		newArray,
		equalsFn
	);
	const additionsAndMoves = findAdditionsAndMoves(
		oldArray,
		newArray,
		equalsFn,
		movedPositions
	);

	const sequence = [...removals, ...additionsAndMoves];
	sequence.sort((a, b) => a.index - b.index);

	return sequence as { op: string; index: number; item: T; from: number }[];
}

export function arraysDiff(oldArray: string[], newArray: string[]) {
	return {
		added: newArray.filter(
			newItem => !oldArray.some(oldItem => oldItem === newItem)
		),
		removed: oldArray.filter(
			oldItem => !newArray.some(newItem => newItem === oldItem)
		),
	};
}

export function applyArraysDiffSequence<T, U>(
	oldArray: T[],
	diffSeq: { op: string; index: number; item: T; from: number }[]
) {
	return diffSeq.reduce((array, { op, item, index, from }) => {
		switch (op) {
			case ARRAY_DIFF_OP.ADD: {
				array.splice(index, 0, item);
				break;
			}

			case ARRAY_DIFF_OP.REMOVE: {
				array.splice(index, 1);
				break;
			}

			case ARRAY_DIFF_OP.MOVE: {
				array.splice(index, 0, array.splice(from, 1)[0]);
				break;
			}
		}

		return array;
	}, oldArray);
}

export function areNodesEqual(nodeOne: HNode, nodeTwo: HNode) {
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

function findRemovals<T>(
	oldArray: T[] = [],
	newArray: T[] = [],
	equalsFn: (a: T, b: T) => boolean = (a, b) => a === b
) {
	const foundIndicesInNewArray = new Set();

	const movedPositions = Array(oldArray.length).fill(0);
	const sequence = [];

	for (let i = 0; i < oldArray.length; i++) {
		const item = oldArray[i];
		const indexInNewArray = newArray.findIndex(
			(newItem, newIndex) =>
				equalsFn(item, newItem) && !foundIndicesInNewArray.has(newIndex)
		);
		const wasRemoved = indexInNewArray === -1;

		if (wasRemoved) {
			sequence.push({
				op: ARRAY_DIFF_OP.REMOVE,
				index: i,
				item,
			});

			for (let index = i + 1; index < movedPositions.length; index++) {
				movedPositions[index] -= 1;
			}
		} else {
			foundIndicesInNewArray.add(indexInNewArray);
		}
	}

	return { removals: sequence, movedPositions };
}

function findAdditionsAndMoves<T>(
	oldArray: T[] = [],
	newArray: T[] = [],
	equalsFn: (a: T, b: T) => boolean = (a, b) => a === b,
	movedPositions: number[] = []
) {
	const foundIndicesInOldArray = new Set();
	const sequence: { op: string; index: number; item: T; from?: number }[] = [];

	for (let index = 0; index < newArray.length; index++) {
		const item = newArray[index];
		const from = oldArray.findIndex(
			(oldItem, oldIndex) =>
				equalsFn(item, oldItem) && !foundIndicesInOldArray.has(oldIndex)
		);

		const isAdded = from === -1;
		const isPossiblyMoved = !isAdded && from !== index;
		const isMoved = isPossiblyMoved && !hasOppositeMove(sequence, from, index);

		if (isAdded) {
			sequence.push({
				op: ARRAY_DIFF_OP.ADD,
				index,
				item,
				from: undefined,
			});

			for (let i = index; i < movedPositions.length; i++) {
				movedPositions[i] += 1;
			}
		} else if (isMoved) {
			const positions = index - from;

			if (positions !== movedPositions[from]) {
				sequence.push({ op: ARRAY_DIFF_OP.MOVE, from, index, item });

				if (positions < 0) {
					for (let i = 0; i < from; i++) {
						movedPositions[i] += 1;
					}
				} else {
					for (let i = from + 1; i < index; i++) {
						movedPositions[i] -= 1;
					}
				}
			} else {
				sequence.push({ op: ARRAY_DIFF_OP.NOOP, from, index, item });
			}

			foundIndicesInOldArray.add(from);
		} else {
			sequence.push({ op: ARRAY_DIFF_OP.NOOP, from, index, item });
			foundIndicesInOldArray.add(from);
		}
	}

	return sequence;
}

function hasOppositeMove<T>(
	sequence: { op: string; index: number; item: T; from?: number }[] = [],
	from: number,
	to: number
) {
	return sequence.some(
		({ op, from: _from, index: _to }) =>
			op === ARRAY_DIFF_OP.MOVE && _from === to && _to === from
	);
}
