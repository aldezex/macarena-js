import { mutableHTMLElementKeys } from './keys';

function removeStyles(element: HTMLElement, style: string[]) {
	style.forEach(styleKey => {
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

function removeAttribute(el: HTMLElement, name: string): void {
	if (mutableHTMLElementKeys.has(name)) {
		(el as any)[name] = null; // again, we know it's mutable
	}
	el.removeAttribute(name);
}

function setAttributes(
	el: HTMLElement,
	attributes: Record<string, string>
): void {
	const { className, style, ...rest } = attributes;

	delete rest.key;

	if (className) {
		applyClasses(el, className);
	}

	if (style) {
		Object.entries(style).forEach(([key, value]) => {
			el.style.setProperty(key, value);
		});
	}

	Object.entries(rest).forEach(([key, value]) => {
		setAttribute(el, key, value);
	});
}

export { setAttributes };
