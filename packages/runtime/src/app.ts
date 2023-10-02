import { destroyDOM } from './destroy-dom';
import { Dispatcher } from './dispatcher';
import { HNode } from './h';
import { mountDOM } from './mount-dom';

type Reducer<S, P> = (state: S, payload: P) => S;
type View<S> = (
	state: S,
	emit: (eventName: string, payload: any) => void
) => HNode;

interface CreateAppOptions<S> {
	view: View<S>;
	initialState: S;
	reducers?: Record<string, Reducer<S, any>>;
}

function createApp<S>({
	view,
	initialState = {} as S,
	reducers = {},
}: CreateAppOptions<S>) {
	let state = initialState;
	let vdom: ReturnType<View<S>> | null = null;

	const dispatcher = new Dispatcher();
	const subscriptions = [dispatcher.afterEveryCommand(render)];

	function render() {
		if (vdom) {
			destroyDOM(vdom);
		}

		const app = document.getElementById('app');
		if (!app) {
			throw new Error('App element is not defined');
		}

		vdom = view(state, dispatcher.dispatch.bind(dispatcher));
		mountDOM(vdom, app);
	}

	for (const [key, reducer] of Object.entries(reducers)) {
		const subs = dispatcher.subscribe(key, (payload: any) => {
			state = reducer(state, payload);
		});

		subscriptions.push(subs);
	}

	return {
		mount() {
			render();
		},
		unmount() {
			destroyDOM(vdom as HNode);
			vdom = null;

			subscriptions.forEach(sub => sub());
		},
	};
}

export { createApp };
