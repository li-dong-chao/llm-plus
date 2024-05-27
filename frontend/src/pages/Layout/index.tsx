import {
    Bot,
    CornerDownLeft,
    Settings2,
    Triangle,
    MessageSquarePlus,
    CircleUserIcon,
    Upload,
    History,
    DatabaseZap,
    Boxes,
    ChevronDown,
    Trash2,
    PencilLine
} from "lucide-react"

import { z } from "zod"
import { KeyboardEvent, useRef } from "react"
import { useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom"

import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormField, FormControl, FormItem } from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import MessageList from "@/components/MessageList"
import { appendMessageList } from "@/store/modules/messageList"
import { useAppDispatch } from "@/hooks"
import { messageType } from "@/schemas"
import { nanoid } from 'nanoid';
import { request } from "@/utils"
import { Separator } from "@/components/ui/separator"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { message as antdMessage } from "antd"
import {
    Tooltip,
    TooltipProvider,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip"


const messageSchema = z.object({
    content: z.string().max(
        2000, { message: "发送消息不能超出2000个字符" }
    ),
})


export default function Layout() {

    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const textAreaRef = useRef<HTMLTextAreaElement>(null);

    const form = useForm<z.infer<typeof messageSchema>>({
        resolver: zodResolver(messageSchema),
        defaultValues: {
            content: "",
        },
    })

    const sendMessage = async (values: z.infer<typeof messageSchema>) => {
        // 校验消息是否只包含无效字符
        form.control._disableForm(true);
        if (values.content.trim()) {
            const message: messageType = {
                id: nanoid(),
                content: values.content,
                avatar: "https://github.com/shadcn.png",
                type: "human"
            }
            dispatch(appendMessageList(message))
            form.reset({ content: "" })
            const res = await request.post('/chatbot', { message: values.content, bot_id: "0" })
            if (res.status === 200) {
                const respMessage: messageType = {
                    id: nanoid(),
                    content: res.data.data,
                    avatar: "https://github.com/shadcn.png",
                    type: "assistant"
                }
                dispatch(appendMessageList(respMessage))
            }
            else {
                antdMessage.error(res.data.detail)
            }
            // 由于是异步发送请求，需要设置一个定时器来自动将焦点设置到输入框
            setTimeout(() => {
                if (textAreaRef.current) {
                    textAreaRef.current.focus()
                }
            }, 10)
        } else {
            antdMessage.info("消息内容不可全为空~")
        }
        form.control._disableForm(false);
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLFormElement>) => {
        if (e.key === "Enter") {
            e.preventDefault()
            sendMessage(form.getValues())
        }
    }

    return (
        <TooltipProvider>
            <div className="h-screen bg-blue-50 w-full relative">
                <div className="flex flex-col rounded-lg absolute top-1/2 -translate-y-1/2 shadow-2xl bg-white ml-4">
                    <nav className="p-2">
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => navigate("/")}
                                >
                                    <Triangle className="size-5 fill-foreground" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent side="right" sideOffset={5}>
                                <p>首页</p>
                            </TooltipContent>
                        </Tooltip>
                    </nav>
                    <Separator className="w-3/4 mx-auto h-[1px]" />
                    <nav className="grid gap-1 p-2">
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => navigate("/chat")}
                                >
                                    <MessageSquarePlus className="size-5" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent side="right" sideOffset={5}>
                                <p>新建对话</p>
                            </TooltipContent>
                        </Tooltip>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                >
                                    <History className="size-5" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent side="right" sideOffset={5}>
                                <p>历史记录</p>
                            </TooltipContent>
                        </Tooltip>
                    </nav>
                    <Separator className="w-3/4 mx-auto h-[1px]" />
                    <nav className="grid gap-1 p-2">
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                >
                                    <Bot className="size-5" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent side="right" sideOffset={5}>
                                <p>Chat</p>
                            </TooltipContent>
                        </Tooltip>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                >
                                    <DatabaseZap className="size-5" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent side="right" sideOffset={5}>
                                <p>Rag</p>
                            </TooltipContent>
                        </Tooltip>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                >
                                    <Boxes className="size-5" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent side="right" sideOffset={5}>
                                <p>Agent</p>
                            </TooltipContent>
                        </Tooltip>
                    </nav>
                    <Separator className="w-3/4 mx-auto h-[1px]" />
                    <nav className="grid gap-1 p-2">
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                >
                                    <Settings2 className="size-5" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent side="right" sideOffset={5}>
                                <p>设置</p>
                            </TooltipContent>
                        </Tooltip>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                >
                                    <CircleUserIcon className="size-5" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent side="right" sideOffset={5}>
                                <p>个人信息</p>
                            </TooltipContent>
                        </Tooltip>
                    </nav>
                </div>
                <div className="h-screen w-3/5 mx-auto">
                    <div className="w-full h-screen grid grid-rows-12">
                        <div className="row-start-1 row-end-10 grid grid-rows-8">
                            <div className="row-start-1 row-end-1 flex justify-center items-center">
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button variant="ghost">
                                            未命名对话
                                            <ChevronDown size={16} className="ml-2" />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-full grid grid-rows-2 gap-2">
                                        <Button variant="ghost">
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
                            <div className="row-start-2 row-end-9">
                                <MessageList />
                            </div>
                        </div>
                        <div className="row-start-10 row-end-13 flex items-end justify-center pb-8">
                            <Form {...form}>
                                <form
                                    className="relative overflow-hidden rounded-lg border w-full shadow-2xl bg-background focus-within:ring-1 focus-within:ring-ring"
                                    onSubmit={form.handleSubmit(sendMessage)}
                                    onKeyDown={handleKeyDown}
                                >
                                    <FormField
                                        control={form.control}
                                        name="content"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormControl
                                                    ref={textAreaRef}
                                                    autoFocus
                                                >
                                                    <Textarea
                                                        id="content"
                                                        placeholder="你可以在这里问我任何问题~"
                                                        className="min-h-12 resize-none text-base border-0 p-3 shadow-none focus-visible:ring-0"
                                                        {...field}
                                                    />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                    <div className="flex items-center p-2 pt-0">
                                        <Button variant="ghost" size="icon">
                                            <Upload className="size-4" />
                                        </Button>
                                        <Button type="submit" size="sm" className="ml-auto gap-1.5">
                                            发送消息
                                            <CornerDownLeft className="size-3.5" />
                                        </Button>
                                    </div>
                                </form>
                            </Form>
                        </div>
                    </div>
                </div>
            </div >
        </TooltipProvider>
    )
}
