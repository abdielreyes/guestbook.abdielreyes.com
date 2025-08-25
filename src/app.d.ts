// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
		interface Message {
			id: string;
			body: string;
			author?: string;
			comments?: string[];
			active?: boolean;
			expand?: {
				comments: Message[];
			};
			created?: string;
		}
	}
}

export {};
