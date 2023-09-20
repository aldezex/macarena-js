export const DOM_TYPES = {
	TEXT: 'text',
	ELEMENT: 'element',
	FRAGMENT: 'fragment',
} as const;

export type VNodeText = {
	type: typeof DOM_TYPES.TEXT;
	value: string;
};

export type VNodeElement = {
	tag: string;
	props: Record<string, any>;
	children: VNode[];
	type: typeof DOM_TYPES.ELEMENT;
};

export type VNodeFragment = {
	type: typeof DOM_TYPES.FRAGMENT;
	children: VNode[];
};

export type VNode = VNodeElement | VNodeFragment | VNodeText;
export type ChildrenVNode = VNodeElement | VNodeFragment | string;
