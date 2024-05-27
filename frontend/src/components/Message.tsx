import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Copy, ThumbsUp } from "lucide-react"


export default function Message({ avatar, content, type }: {
    avatar: string,
    content: string,
    type: string
}) {
    return (
        <>
            {
                type.toString() === "assistant" ?
                    <div className="hover:bg-blue-100 hover:shadow-md rounded-2xl  pt-2">
                        <div className="flex justify-start px-4 mt-2">
                            <div>
                                <Avatar>
                                    <AvatarImage src={avatar} />
                                    <AvatarFallback>AI</AvatarFallback>
                                </Avatar>
                            </div>
                            <Card className="ml-2 px-4 py-2 text-base shadow-lg rounded-2xl">
                                {content}
                            </Card>
                        </div>
                        <div className="flex justify-start pl-16 my-1 gap-2">
                            <Button
                                variant="ghost"
                                size="sm"
                                className="mt-0 rounded-lg"
                            >
                                <Copy className="size-4" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="mt-0 rounded-lg"
                            >
                                <ThumbsUp className="size-4" />
                            </Button>
                        </div>
                    </div>
                    :
                    <div className="flex justify-end px-4 my-2 py-2 rounded-2xl hover:bg-blue-100 hover:shadow-md">
                        <Card className="mr-2 px-4 py-2 text-base shadow-lg rounded-2xl">
                            {content}
                        </Card>
                        <div>
                            <Avatar>
                                <AvatarImage src="https://github.com/shadcn.png" />
                                <AvatarFallback>User</AvatarFallback>
                            </Avatar>
                        </div>
                    </div>
            }
        </>
    )

}