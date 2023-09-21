import { destroyDOM } from './destroy-dom';
import {
	removeAttribute,
	removeStyle,
	setAttribute,
	setStyle,
} from './lib/attributes';
import { addEventListener } from './lib/events';
import { mountDOM } from './mount-dom';
import { DOM_TYPES, VNode } from './nodes';
import {
	ARRAY_DIFF_OP,
	areNodesEqual,
	arraysDiff,
	arraysDiffSequence,
	objectsDiff,
} from './algo';

export function patchDOM(
	oldVdom: VNode,
	newVdom: VNode,
	parentEl: HTMLElement
) {
	if (!areNodesEqual(oldVdom, newVdom)) {
		const index = Array.from(parentEl.childNodes).indexOf(oldVdom.el!);
		destroyDOM(oldVdom);
		mountDOM(newVdom, parentEl, index);

		return newVdom;
	}

	newVdom.el = oldVdom.el;

	switch (newVdom.type) {
		case DOM_TYPES.TEXT: {
			patchText(oldVdom, newVdom);
			return newVdom;
		}

		case DOM_TYPES.ELEMENT: {
			patchElement(oldVdom, newVdom);
			break;
		}
	}

	patchChildren(oldVdom, newVdom);

	return newVdom;
}

function patchText(oldVdom: VNode, newVdom: VNode) {
	const el = oldVdom.el;

	if (oldVdom.type === DOM_TYPES.TEXT && newVdom.type === DOM_TYPES.TEXT) {
		const { value: oldText } = oldVdom;
		const { value: newText } = newVdom;

		if (oldText !== newText) {
			el!.nodeValue = newText;
		}
	}
}

function patchElement(oldVdom: VNode, newVdom: VNode) {
	const el = oldVdom.el;

	if (
		oldVdom.type === DOM_TYPES.ELEMENT &&
		newVdom.type === DOM_TYPES.ELEMENT
	) {
		const {
			class: oldClass,
			style: oldStyle,
			on: oldEvents,
			...oldAttrs
		} = oldVdom.props;
		const {
			class: newClass,
			style: newStyle,
			on: newEvents,
			...newAttrs
		} = newVdom.props;
		const { listeners: oldListeners } = oldVdom;

		patchAttrs(el as HTMLElement, oldAttrs, newAttrs);
		patchClasses(el as HTMLElement, oldClass, newClass);
		patchStyles(el as HTMLElement, oldStyle, newStyle);
		newVdom.listeners = patchEvents(
			el as HTMLElement,
			oldListeners,
			oldEvents,
			newEvents
		);
	}
}

function patchAttrs(
	el: HTMLElement,
	oldAttrs: Record<string, any>,
	newAttrs: Record<string, any>
) {
	const { added, removed, updated } = objectsDiff(oldAttrs, newAttrs);

	for (const attr of removed) {
		removeAttribute(el, attr);
	}

	for (const attr of added.concat(updated)) {
		setAttribute(el, attr, newAttrs[attr]);
	}
}

function patchClasses(
	el: HTMLElement,
	oldClass: string | string[],
	newClass: string | string[]
) {
	const oldClasses = toClassList(oldClass);
	const newClasses = toClassList(newClass);

	const { added, removed } = arraysDiff(oldClasses, newClasses);

	if (removed.length > 0) {
		el.classList.remove(...removed);
	}
	if (added.length > 0) {
		el.classList.add(...added);
	}
}

function toClassList(classes: string | string[] = '') {
	return Array.isArray(classes)
		? classes.filter(isNotBlankOrEmptyString)
		: classes.split(/(\s+)/).filter(isNotBlankOrEmptyString);
}

export function isNotEmptyString(str: string) {
	return str !== '';
}

export function isNotBlankOrEmptyString(str: string) {
	return isNotEmptyString(str.trim());
}

type StyleObject = Record<string, string>;

function patchStyles(
	el: HTMLElement,
	oldStyle: StyleObject = {},
	newStyle: StyleObject = {}
) {
	const { added, removed, updated } = objectsDiff(oldStyle, newStyle);

	for (const style of removed) {
		removeStyle(el, style);
	}

	for (const style of added.concat(updated)) {
		setStyle(el, style, newStyle[style]);
	}
}

type EventListeners = Record<string, EventListenerOrEventListenerObject>;

function patchEvents(
	el: HTMLElement,
	oldListeners: EventListeners = {},
	oldEvents: Record<string, any> = {},
	newEvents: Record<string, any> = {}
) {
	const { removed, added, updated } = objectsDiff(oldEvents, newEvents);

	for (const eventName of removed.concat(updated)) {
		el.removeEventListener(eventName, oldListeners[eventName]);
	}

	const addedListeners: EventListeners = {};

	for (const eventName of added.concat(updated)) {
		const listener = addEventListener(eventName, newEvents[eventName], el);
		addedListeners[eventName] = listener;
	}

	return addedListeners;
}

function patchChildren(oldVdom: VNode, newVdom: VNode) {
	const oldChildren = extractChildren(oldVdom);
	const newChildren = extractChildren(newVdom);
	const parentEl = oldVdom.el;

	if (!oldChildren || !newChildren) {
		return;
	}

	const diffSeq = arraysDiffSequence(oldChildren, newChildren, areNodesEqual);

	for (const operation of diffSeq) {
		const { originalIndex, index, item } = operation as unknown as {
			originalIndex: number;
			index: number;
			item: VNode;
		};

		switch (operation.op) {
			case ARRAY_DIFF_OP.ADD: {
				mountDOM(item, parentEl as HTMLElement, index);
				break;
			}

			case ARRAY_DIFF_OP.REMOVE: {
				destroyDOM(item);
				break;
			}

			case ARRAY_DIFF_OP.MOVE: {
				const oldChild = oldChildren[originalIndex];
				const newChild = newChildren[index];
				const el = oldChild.el;
				const elAtTargetIndex = parentEl!.childNodes[index];

				parentEl!.insertBefore(el as HTMLElement, elAtTargetIndex);
				patchDOM(oldChild, newChild, parentEl as HTMLElement);

				break;
			}

			case ARRAY_DIFF_OP.NOOP: {
				patchDOM(
					oldChildren[originalIndex],
					newChildren[index],
					parentEl as HTMLElement
				);
				break;
			}
		}
	}
}

export function extractChildren(vdom: VNode, children: VNode[] = []) {
	if (vdom.type === DOM_TYPES.TEXT) {
		return [];
	}

	if (vdom.children == null) {
		return [];
	}

	for (const child of vdom.children) {
		if (child.type === DOM_TYPES.FRAGMENT) {
			children.push(...extractChildren(child, children));
		} else {
			children.push(child);
		}
	}

	return children;
}
