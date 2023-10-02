import { mutableHTMLElementKeys } from './keys';

function applyStyles(
	element: HTMLElement,
	styles: {
		[key: string]: string;
	}
) {
	for (const [key, value] of Object.entries(styles)) {
		element.style.setProperty(key, value);
	}
}

function removeStyles(element: HTMLElement, styles: string[]) {
	styles.forEach(styleKey => {
		element.style.removeProperty(styleKey);
	});
}

function applyClasses(element: HTMLElement, className: string | string[]) {
	element.className = '';

	if (Array.isArray(className)) {
		element.classList.add(...className);
	}

	if (typeof className === 'string') {
		element.className = className;
	}
}

function setAttribute(el: HTMLElement, name: string, value: string): void {
	if (value == null) {
		removeAttribute(el, name);
	} else if (name.startsWith('data-')) {
		el.setAttribute(name, value);
	} else {
		if (mutableHTMLElementKeys.has(name)) {
			(el as any)[name] = value; // we know it's mutable, so any is fine
		}
	}
}

export function removeAttribute(el: HTMLElement, name: string): void {
	if (mutableHTMLElementKeys.has(name)) {
		(el as any)[name] = null; // again, we know it's mutable
	}
	el.removeAttribute(name);
}

export { applyStyles, removeStyles, applyClasses, setAttribute };
