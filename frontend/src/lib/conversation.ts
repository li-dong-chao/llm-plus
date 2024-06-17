import { Message } from "./message";

export class Conversation {
    private messages: Message[] = []

    constructor(messages: Message[]) {
        this.messages = messages
    }

    addMessage(message: Message): void {
        this.messages.push(message)
    }
}
