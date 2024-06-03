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
    RotateCw,
    ChevronDown,
    PencilLine,
    Trash2
} from "lucide-react"

import { z } from "zod"
import { KeyboardEvent, useEffect, useRef, useState } from "react"
import { useForm } from "react-hook-form"

import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormField, FormControl, FormItem } from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import MessageList from "@/components/MessageList"
import { appendMessageList, resetMessageList, setMessageList } from "@/store/modules/messageList"
import { useAppDispatch } from "@/hooks"
import { messageType } from "@/schemas"
import { nanoid } from 'nanoid';
import { request } from "@/utils"
import { Separator } from "@/components/ui/separator"
import { message as antdMessage } from "antd"
import {
    Tooltip,
    TooltipProvider,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import HistoryList from "@/components/HistoryList"

import {
    Drawer,
    DrawerContent,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer"
import ExampleList from "@/components/Example"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useParams } from "react-router-dom"

const messageSchema = z.object({
    content: z.string().max(
        2000, { message: "发送消息不能超出2000个字符" }
    ),
})


export default function Layout() {

    const dispatch = useAppDispatch();
    const textAreaRef = useRef<HTMLTextAreaElement>(null);
    const [showMessage, setShowMessage] = useState(false);
    const params = useParams();
    const id = params.id;

    const [historyList, setHistoryList] = useState([]);
    const [sending, setSending] = useState(false);

    const form = useForm<z.infer<typeof messageSchema>>({
        resolver: zodResolver(messageSchema),
        defaultValues: {
            content: "",
        },
    })

    const sendMessage = async (values: z.infer<typeof messageSchema>) => {
        // 校验消息是否只包含无效字符
        setShowMessage(true);
        setSending(true)
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
        setSending(false)
    };


    const handleKeyDown = (e: KeyboardEvent<HTMLFormElement>) => {
        if (e.key === "Enter") {
            e.preventDefault()
            sendMessage(form.getValues())
        }
    }

    const handleHistory = async () => {
        const res = await request.get('/conversations');
        setHistoryList(res.data.data);
    }

    const clearMessage = () => {
        dispatch(resetMessageList())
        setShowMessage(false)
    }

    useEffect(() => {
        const fetchData = async () => {
            const res = await request.post('/messages', { conversation_id: id });
            if (res.status === 200) {
                dispatch(resetMessageList())
                console.log(res.data.data)
                dispatch(setMessageList(res.data.data))
            } else {
                antdMessage.error("获取对话失败")
            }
        }
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id])


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
                                    onClick={() => clearMessage()}
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
                                    onClick={() => clearMessage()}
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
                                <Drawer>
                                    <DrawerTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={handleHistory}
                                        >
                                            <History className="size-5" />
                                        </Button>
                                    </DrawerTrigger>
                                    <DrawerContent className="w-1/2 mx-auto h-5/6">
                                        <DrawerTitle className="mx-auto my-4">
                                            历史对话
                                        </DrawerTitle>
                                        <HistoryList className="mt-4" historyList={historyList} />
                                    </DrawerContent>
                                </Drawer>
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
                                <div className={`${showMessage ? "" : "hidden"}`}>
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
                            </div>
                            <div className="row-start-2 row-end-9">
                                <div className={`h-full ${showMessage ? "hidden" : ""}`} >
                                    <h1 className="font-serif font-bold text-center">
                                        LLM-PLUS
                                    </h1>
                                    <ExampleList sendMessage={sendMessage} />
                                </div>

                                <MessageList className={`${showMessage ? "" : "hidden"}`} />
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
                                        <Button variant="ghost" size="icon" disabled={sending ? true : false}>
                                            <Upload className="size-4" />
                                        </Button>
                                        <Button type="submit" size="sm" className="ml-auto" disabled={sending ? true : false}>
                                            <div className={`w-full text-center ${sending ? "hidden" : ""}`}>
                                                发送消息
                                                <CornerDownLeft className="size-3.5 inline" />
                                            </div>
                                            <RotateCw
                                                className={`size-4 animate-spin ${sending ? "" : "hidden"}`} />
                                        </Button>
                                    </div>
                                </form>
                            </Form>
                        </div>
                    </div>
                </div>
            </div >
        </TooltipProvider >
    )
}
