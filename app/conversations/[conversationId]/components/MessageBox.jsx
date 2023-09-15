"use client"

import Avatar from "@/app/components/Avatar"
import axios from "axios"
import clsx from "clsx"
import { format } from "date-fns"
import { useSession } from "next-auth/react"
import Image from "next/image"
import { useState } from "react"
import { toast } from "react-hot-toast"
import MessageEdit from "./MessageEdit"
import ImageModal from "./ImageModal"

export default function MessageBox({ isLast, data }) {
  const session = useSession()
  const [imageModalOpen, setImageModalOpen] = useState(false)

  const [isContextMenuOpen, setIsContextMenuOpen] = useState(false)
  const isOwn = session?.data?.user?.email === data?.sender?.email

  const seenList = (data.seen || [])
    .filter(user => user.email !== data?.sender?.email)
    .map(user => user.name)
    .join(", ")

  //   const handleDeleteMessage = async () => {
  //     axios.delete(`/api/messages/${data.id}`).catch(() => toast.error("Ooops!!"))
  //   }
  
  const container = clsx("flex gap-3 p-4", isOwn && "justify-end")

  const avatar = clsx(isOwn && "order-2")

  const body = clsx("flex flex-col gap-2", isOwn && "items-end")

  const message = clsx(
    "text-sm w-fit cursor-pointer relative",
    isOwn ? "bg-sky-500 text-white" : "bg-gray-100",
    data?.image ? "rounded-md p-0" : "rounded-full py-2 px-3"
  )

  console.log(data)

  if(data.log) {
    return <div className="flex items-center justify-center p-4">
        <i className="text-sm text-neutral-400">{data.body}</i>
    </div>
  }

  return (
    <div className={container}>
      <div className={avatar}>
        <Avatar user={data.sender} />
      </div>
      <div className={body}>
        <div className="flex items-center gap-1">
          <div className="text-sm text-gray-500">{data.sender.name}</div>
          <div className="text-xs text-gray-400">
            {format(new Date(data.createdAt), "p")}
          </div>
        </div>
        <div
          className={message}
          onContextMenu={e => {
            e.preventDefault()
            setIsContextMenuOpen(open => isOwn && !open)
          }}
        >
          <ImageModal
            src={data.image}
            isOpen={imageModalOpen}
            onClose={() => setImageModalOpen(false)}
          />
          {data?.image ? (
            <Image
              onClick={() => setImageModalOpen(true)}
              alt="Image"
              height="288"
              width="288"
              src={data.image}
              className="object-cover cursor-pointer hover:scale-110 transition translate"
            />
          ) : (
            <div>{data.body}</div>
          )}
          <MessageEdit isOpen={isContextMenuOpen} message = {data}/>
          {
            data?.edited && <div className="flex justify-end">
              <i className="text-[10px] font-light">Edited: {format(new Date(data.updatedAt), 'p')}</i>
            </div>
          }
        </div>
        {isLast && isOwn && seenList.length > 0 && (
          <div className="text-xs font-light text-gray-500">
            {`Seen by ${seenList}`}
          </div>
        )}
      </div>
    </div>
  )
}
