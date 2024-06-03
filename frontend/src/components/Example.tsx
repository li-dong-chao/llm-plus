import { nanoid } from "nanoid"
import { SquareTerminal, Cake, TentTree } from "lucide-react"
import { Button } from "./ui/button"



export default function ExampleList({ className = "", sendMessage }: {
    className?: string,
    sendMessage: Function
}) {

    const examples = [
        { content: "编写python快排代码", icon: <SquareTerminal size={26} className="mx-auto" /> },
        { content: "帮我写一个朋友的生日祝福", icon: <Cake size={26} className="mx-auto" /> },
        { content: "帮我制定户外旅行攻略", icon: <TentTree size={26} className="mx-auto" /> },
    ]

    return (
        <div className={`grid grid-cols-3 gap-4 h-1/3 mt-24 px-4 ${className}`}>
            {
                examples.map((item) => {
                    return (
                        <Button
                            className="inline-block border rounded-2xl shadow-md hover:shadow-xl hover:bg-blue-100/70 text-black bg-white h-full py-0"
                            key={nanoid()}
                            onClick={() => sendMessage({ content: item.content })}
                        >
                            <div className="py-6">
                                {item.icon}
                            </div>
                            <div className="text-center text-base">
                                {item.content}
                            </div>
                        </Button>
                    )
                })
            }
        </div>
    )
}