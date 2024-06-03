import HistoryItem from "./HistoryItem";

interface historyItemType {
    id: string,
    title: string,
    create_time: string
}


export default function HistoryList({ historyList, className, ...props }: {
    historyList: Array<historyItemType>,
    className: string
}) {
    return (
        <div {...props} className={`overflow-y-scroll my-4 ${className}`}>
            {
                historyList.map((item) => {
                    return <HistoryItem title={item.title} key={item.id} id={item.id} />
                })
            }
        </div>
    )
}