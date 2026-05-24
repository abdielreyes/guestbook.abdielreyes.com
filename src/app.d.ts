// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		interface Comment {
			id: string;
			body: string;
			author?: string;
			message_id?: string;
			active?: boolean;
			created?: string;
		}

		interface Message {
			id: string;
			body: string;
			author?: string;
			comments?: string[];
			active?: boolean;
			expand?: {
				comments: Comment[];
			};
			created?: string;
		}
	}
}

export {};
