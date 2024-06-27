import {
    ChevronDown,
    PencilLine,
    Trash2
} from "lucide-react"
import { useEffect, useRef } from "react";
import Message from "@/components/Message";
import { useAppSelector, useAppDispatch } from "@/hooks"
import { Message as _Message } from "@/lib/message";
import { nanoid } from "nanoid";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { setConversationTitle } from "@/store/modules/conversation"
import { message } from "antd"

export default function Conversation({ className = "" }: {
    className?: string
}) {

    const containRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const conversation = useAppSelector(state => state.conversation.conversation)
    const dispatch = useAppDispatch()

    useEffect(() => {
        // 实现对话时窗口自动下拉，始终展示最新的聊天内容
        if (containRef.current) {
            containRef.current.scrollTop = containRef.current.scrollHeight;
        }
    }, [conversation])

    const renameTitle = () => {
        if (inputRef.current) {
            inputRef.current.readOnly = false
            inputRef.current.focus()
            // dispatch(setConversationTitle(inputRef.current.value))
            // message.success("修改名称完成")
        }
    }

    return (
        <div className={`grid grid-rows-9 ${className}`}>
            <div className="row-start-1 row-end-1 flex justify-center items-center">
                <Popover>
                    <PopoverTrigger asChild>
                        <Button variant="ghost" className="hover:bg-blue-100 hover:shadow-md">
                            {conversation.title.length > 12
                                ? `${conversation.title.slice(0, 12)}...`
                                : conversation.title}
                            <ChevronDown size={16} className="ml-2" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full grid grid-rows-2 gap-2">
                        <Input defaultValue={conversation.title} className="px-1 py-1" ref={inputRef} readOnly />
                        <Button variant="ghost" onClick={() => renameTitle()}>
                            <PencilLine size={16} className="mr-2" />
                            修改名称
                        </Button>
                        <Button variant="ghost" className="text-red-400 hover:text-red-400">
                            <Trash2 size={16} className="mr-2" />
                            删除对话
                        </Button>
                    </PopoverContent>
                </Popover>
            </div>
            <div className={`row-start-2 row-end-9 overflow-y-scroll h-full py-2`} ref={containRef}>
                {
                    conversation.messages.map((item) => {
                        const message = new _Message(item.id, item.type, item.content)
                        return <Message
                            avatar={message.avatar ? message.avatar.toString() : ""}
                            content={item.content.toString()}
                            type={item.type.toString()}
                            key={item.id ? item.id.toString() : nanoid()}
                        />
                    })
                }
            </div>
        </div >
    )
}