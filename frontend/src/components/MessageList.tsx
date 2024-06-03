import { useEffect, useRef } from "react";
import MessageItem from "@/components/MessageItem";
import { useAppSelector } from "@/hooks"

export default function MessageList({ className = "" }: {
    className?: string
}) {

    const containRef = useRef<HTMLDivElement>(null);
    const messageList = useAppSelector(state => state.messageList.messageList)

    useEffect(() => {
        // 实现对话时窗口自动下拉，始终展示最新的聊天内容
        if (containRef.current) {
            containRef.current.scrollTop = containRef.current.scrollHeight;
        }
    }, [messageList])

    return (
        <>
            <div className={`overflow-y-scroll h-full py-2 ${className}`} ref={containRef}>
                {
                    messageList.map((item) => {
                        return <MessageItem
                            avatar={item.avatar.toString()}
                            content={item.content.toString()}
                            type={item.type.toString()}
                            key={item.id.toString()}
                        />
                    })
                }
            </div>
        </>
    )
}