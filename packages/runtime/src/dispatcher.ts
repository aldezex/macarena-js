export class Dispatcher {
	subs = new Map<string, Array<Function>>();
	afterHandlers: Function[] = [];

	subscribe(command: string, handler: Function) {
		if (!this.subs.has(command)) {
			this.subs.set(command, []);
		}

		const handlers = this.subs.get(command)!;
		if (handlers.includes(handler)) {
			return () => {};
		}

		handlers.push(handler);

		return () => {
			const index = handlers.indexOf(handler);
			handlers.splice(index, 1);
		};
	}

	afterEveryCommand(handler: Function) {
		this.afterHandlers.push(handler);

		return () => {
			const index = this.afterHandlers.indexOf(handler);
			this.afterHandlers.splice(index, 1);
		};
	}

	dispatch(command: string, payload: any) {
		const handlers = this.subs.get(command);

		if (handlers) {
			handlers.forEach(handler => handler(payload));
		} else {
			console.warn(`No handlers for command: ${command}`);
		}

		this.afterHandlers.forEach(handler => handler());
	}
}
