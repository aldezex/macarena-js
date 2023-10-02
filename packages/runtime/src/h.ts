import { withoutNulls } from './utils/arrays';
import { DOMEventName } from './utils/events';
import { mapTextNodes } from './utils/text';

const DOM_TYPES = {
	ELEMENT: 'ELEMENT',
	FRAGMENT: 'FRAGMENT',
	TEXT: 'TEXT',
} as const;

type DomType = (typeof DOM_TYPES)[keyof typeof DOM_TYPES];

type HBase = {
	el?: ChildNode;
};

type Props = {
	styles?: {
		[key: string]: string;
	};
	className?: string | string[];
	on?: {
		[key in DOMEventName]?: EventListener;
	};
	[key: string]: any;
};

export type HElement = HBase & {
	tag: string;
	props: Props;
	children: HChild[];
	type: typeof DOM_TYPES.ELEMENT;
	listeners?: {
		[key in DOMEventName]?: EventListener;
	};
};

export type HFragment = HBase & {
	children: HChild[];
	type: typeof DOM_TYPES.FRAGMENT;
};

export type HText = HBase & {
	text: string;
	type: typeof DOM_TYPES.TEXT;
};

type HNode = HElement | HFragment | HText;
type HChild = HNode | string | number | null;

function h(tag: string, props: Props, children: HChild[] = []): HElement {
	return {
		tag,
		props,
		children: mapTextNodes(withoutNulls(children as HNode[])),
		type: DOM_TYPES.ELEMENT,
	};
}

function hFragment(children: HChild[]): HFragment {
	return {
		children: mapTextNodes(withoutNulls(children as HNode[])),
		type: DOM_TYPES.FRAGMENT,
	};
}

function hText(text: string): HText {
	return {
		text,
		type: DOM_TYPES.TEXT,
	};
}

export { DOM_TYPES, h, hFragment, hText, HNode, DomType, HChild };
