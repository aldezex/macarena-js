export function setAttributes(el: HTMLElement, attrs: Record<string, any>) {
	const { class: className, style, ...otherAttrs } = attrs;
	const styles = style as Record<string, string>;

	if (className) {
		setClass(el, className);
	}

	if (styles) {
		Object.entries(styles).forEach(([prop, value]) => {
			setStyle(el, prop, value);
		});
	}

	for (const [name, value] of Object.entries(otherAttrs)) {
		setAttribute(el, name, value);
	}
}

function setClass(el: HTMLElement, className: string | string[]) {
	el.className = '';

	if (typeof className === 'string') {
		el.className = className;
	}

	if (Array.isArray(className)) {
		el.classList.add(...className);
	}
}

export function setStyle(el: HTMLElement, key: string, value: string) {
	el.style.setProperty(key, value);
}

export function removeStyle(el: HTMLElement, key: string) {
	el.style.removeProperty(key);
}

export function setAttribute(el: HTMLElement, name: string, value: string) {
	if (value == null) {
		removeAttribute(el, name);
	} else if (name.startsWith('data-')) {
		el.setAttribute(name, value);
	} else {
		(el as any)[name] = value;
	}
}

export function removeAttribute(el: HTMLElement, name: string) {
	(el as any)[name] = null;
	el.removeAttribute(name);
}
