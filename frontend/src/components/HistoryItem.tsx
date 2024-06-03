import { Card } from "@/components/ui/card"
import { ScrollText, Trash2, PencilLine } from "lucide-react"
import { Button } from "./ui/button"
import { useNavigate } from "react-router-dom"


export default function HistoryItem({ title, id }: { title: string, id: string }) {
    const navigate = useNavigate();
    const handleClick = () => {
        navigate(`/c/${id}`)
    }

    return (
        <div>
            <Card
                onClick={() => handleClick()}
                className="flex items-center justify-start py-2 px-4 mx-6 hover:shadow-lg group mb-2 hover:cursor-pointer hover:bg-blue-50">
                <span>
                    <ScrollText size={20} className="ml-4" />
                </span>
                <span className="w-5/6 ml-2 mr-4 text-xl">
                    {title}
                </span>
                <span className="hidden group-hover:flex items-center justify-end gap-2">
                    <Button variant="ghost" className="h-2/3 p-1 hover:bg-blue-100">
                        <PencilLine size={20} />
                    </Button>
                    <Button variant="ghost" className="h-2/3 p-1 hover:bg-blue-100">
                        <Trash2 size={20} className="text-red-400" />
                    </Button>
                </span>
            </Card>
        </div>
    )
}