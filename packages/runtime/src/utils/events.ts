export function addEventListener(
	eventName: string,
	handler: EventListener,
	el: HTMLElement
) {
	el.addEventListener(eventName, handler);
	return handler;
}

export function addEventListeners(
	listeners: {
		[eventName: string]: EventListener;
	} = {},
	el: HTMLElement
) {
	const addedListeners: {
		[eventName: string]: EventListener;
	} = {};

	Object.entries(listeners).forEach(([eventName, handler]) => {
		const listener = addEventListener(eventName, handler, el);
		addedListeners[eventName] = listener;
	});

	return addedListeners;
}

export function removeEventListeners(
	listeners: {
		[eventName: string]: EventListener;
	} = {},
	el: ChildNode
) {
	Object.entries(listeners).forEach(([eventName, handler]) => {
		el.removeEventListener(eventName, handler);
	});
}

export type DOMEventName =
	| 'abort'
	| 'animationend'
	| 'animationiteration'
	| 'animationstart'
	| 'blur'
	| 'change'
	| 'click'
	| 'contextmenu'
	| 'copy'
	| 'cut'
	| 'dblclick'
	| 'drag'
	| 'dragend'
	| 'dragenter'
	| 'dragexit'
	| 'dragleave'
	| 'dragover'
	| 'dragstart'
	| 'drop'
	| 'error'
	| 'focus'
	| 'input'
	| 'keydown'
	| 'keypress'
	| 'keyup'
	| 'load'
	| 'mousedown'
	| 'mouseenter'
	| 'mouseleave'
	| 'mousemove'
	| 'mouseout'
	| 'mouseover'
	| 'mouseup'
	| 'paste'
	| 'pointerdown'
	| 'pointerenter'
	| 'pointerleave'
	| 'pointermove'
	| 'pointerout'
	| 'pointerover'
	| 'pointerup'
	| 'resize'
	| 'scroll'
	| 'select'
	| 'submit'
	| 'touchcancel'
	| 'touchend'
	| 'touchmove'
	| 'touchstart'
	| 'transitionend'
	| 'wheel';
