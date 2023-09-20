export const DOM_TYPES = {
	TEXT: 'text',
	ELEMENT: 'element',
	FRAGMENT: 'fragment',
} as const;

export type VNodeText = {
	type: typeof DOM_TYPES.TEXT;
	value: string;
	el: Text | null;
};

export type VNodeElement = {
	tag: string;
	props: Record<string, any>;
	children: VNode[];
	type: typeof DOM_TYPES.ELEMENT;
	el: HTMLElement | null;
	listeners?: Record<string, any>;
};

export type VNodeFragment = {
	type: typeof DOM_TYPES.FRAGMENT;
	children: VNode[];
	el: HTMLElement | null;
};

export type VNode = VNodeElement | VNodeFragment | VNodeText;
export type ChildrenVNode = VNodeElement | VNodeFragment | string;
