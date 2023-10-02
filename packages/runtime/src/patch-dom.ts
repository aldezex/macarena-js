import { destroyDOM } from './destroy-dom';
import { DOM_TYPES, HElement, HFragment, HNode } from './h';
import { mountDOM } from './mount-dom';
import {
	ARRAY_DIFF_OP,
	areNodesEqual,
	arraysDiff,
	arraysDiffSequence,
	objectsDiff,
} from './patch';
import { addEventListener } from './utils/events';
import { removeAttribute, setAttribute } from './utils/props';

export function patchDOM(
	oldVdom: HNode,
	newVdom: HNode,
	parentEl: HTMLElement
) {
	if (!areNodesEqual(oldVdom, newVdom)) {
		const index = findIndexInParent(parentEl, oldVdom.el as HTMLElement);
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

	patchChildren(oldVdom as HElement | HFragment, newVdom);

	return newVdom;
}

function findIndexInParent(parentEl: HTMLElement, el: HTMLElement | Text) {
	const index = Array.from(parentEl.childNodes).indexOf(el);
	if (index < 0) {
		return undefined;
	}

	return index;
}

function patchText(oldVdom: HNode, newVdom: HNode) {
	const el = oldVdom.el;

	if (oldVdom.type === DOM_TYPES.TEXT && newVdom.type === DOM_TYPES.TEXT) {
		const { text: oldText } = oldVdom;
		const { text: newText } = newVdom;

		if (oldText !== newText) {
			el!.nodeValue = newText;
		}
	}
}

function patchElement(oldVdom: HNode, newVdom: HNode) {
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
		el.style.removeProperty(style);
	}

	for (const style of added.concat(updated)) {
		el.style.setProperty(style, newStyle[style]);
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

function patchChildren(
	oldVdom: HElement | HFragment,
	newVdom: HElement | HFragment
) {
	const oldChildren = (oldVdom.children as HNode[]) ?? [];
	const newChildren = (newVdom.children as HNode[]) ?? [];

	const parentEl = oldVdom.el;

	const diffSeq = arraysDiffSequence(oldChildren, newChildren, areNodesEqual);

	for (const operation of diffSeq) {
		const { from, index, item } = operation;

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
				const el = oldChildren[from].el;
				const elAtTargetIndex = parentEl!.childNodes[index];

				parentEl!.insertBefore(el as HTMLElement, elAtTargetIndex);
				patchDOM(
					oldChildren[from],
					newChildren[index],
					parentEl as HTMLElement
				);

				break;
			}

			case ARRAY_DIFF_OP.NOOP: {
				patchDOM(
					oldChildren[from],
					newChildren[index],
					parentEl as HTMLElement
				);
				break;
			}
		}
	}
}
