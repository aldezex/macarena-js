class Dispatcher {
	private subs = new Map<string, Set<Function>>();
	private afterHandlers = new Set<Function>();

	subscribe(commandName: string, handler: Function) {
		if (!this.subs.has(commandName)) {
			this.subs.set(commandName, new Set());
		}

		const handlers = this.subs.get(commandName);

		if (!handlers) {
			return () => {};
		}

		if (handlers.has(handler)) {
			return () => {};
		}

		handlers.add(handler);

		return () => {
			handlers.delete(handler);
		};
	}

	afterEveryCommand(handler: Function) {
		this.afterHandlers.add(handler);

		return () => {
			this.afterHandlers.delete(handler);
		};
	}

	dispatch(eventName: string, ...args: any[]) {
		const handlers = this.subs.get(eventName);

		if (!handlers) {
			console.warn(`No handlers for event ${eventName}`);
			return;
		}

		handlers.forEach(handler => {
			handler(...args);
		});

		this.afterHandlers.forEach(handler => {
			handler();
		});
	}
}

export { Dispatcher };
