import { destroyDOM } from './destroy-dom';
import { Dispatcher } from './dispatcher';
import { mountDOM } from './mount-dom';
import { VNode } from './nodes';
import { patchDOM } from './patch-dom';

interface App {
	state: any;
	view: (state: any, emit: (event: string, payload: any) => void) => VNode;
	reducers: Record<string, (state: any, payload: any) => any>;
}

export function createApp({ state = {}, view, reducers = {} }: App) {
	let parentEl: HTMLElement | null = null;
	let vdom: ReturnType<typeof view> | null = null;

	const dispatcher = new Dispatcher();
	const subscriptions = [dispatcher.afterEveryCommand(render)];

	for (const actionName in reducers) {
		const reducer = reducers[actionName];

		const subs = dispatcher.subscribe(actionName, (payload: any) => {
			state = reducer(state, payload);
		});

		subscriptions.push(subs);
	}

	function emit(eventName: string, payload: any) {
		dispatcher.dispatch(eventName, payload);
	}

	function render() {
		const newDom = view(state, emit);
		patchDOM(vdom!, newDom, parentEl!);
	}

	return {
		mount(el: HTMLElement) {
			parentEl = el;
			vdom = view(state, emit);
			mountDOM(vdom, el);

			return this;
		},
		unmount() {
			destroyDOM(vdom!);
			vdom = null;

			subscriptions.forEach(unsuscribe => unsuscribe());
		},
		emit(eventName: string, payload: any) {
			emit(eventName, payload);
		},
	};
}
