
export class Message {
    id: string;
    type: string;
    content: string;

    constructor(id: string, type: string, content: string) {
        this.id = id;
        this.type = type;
        this.content = content;
    }

    get avatar(): string {
        // TODO: 根据用户来自动获取头像
        if (this.type) {
            return "https://github.com/shadcn.png"
        }
        else {
            return "https://github.com/shadcn.png"
        }
    }
}
