export function dispatcher() {
	const subs = new Map<string, Array<Function>>();
	const afterHandlers: Function[] = [];

	function subscribe(command: string, handler: Function) {
		if (!subs.has(command)) {
			subs.set(command, []);
		}

		const handlers = subs.get(command);

		if (!handlers) {
			return () => {};
		}

		if (handlers.includes(handler)) {
			return () => {};
		}

		handlers.push(handler);

		return () => {
			const index = handlers.indexOf(handler);
			handlers.splice(index, 1);
		};
	}

	function afterEveryCommand(handler: Function) {
		afterHandlers.push(handler);

		return () => {
			const index = afterHandlers.indexOf(handler);
			afterHandlers.splice(index, 1);
		};
	}

	function dispatch(command: string, payload: any) {
		const handlers = subs.get(command);

		if (handlers) {
			handlers.forEach(handler => handler(payload));
		} else {
			console.warn(`No handlers for command: ${command}`);
		}

		afterHandlers.forEach(handler => handler());
	}

	return {
		subscribe,
		afterEveryCommand,
		dispatch,
	};
}
