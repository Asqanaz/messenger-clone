"use client"

import clsx from "clsx"
import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai"
import ConfirmDeleteModal from "./ConfirmDeleteModal"
import { useState } from "react"

export default function MessageEdit({ isOpen, message }) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [action, setAction] = useState(null)

  return (
    <>
      <ConfirmDeleteModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        message={message}
        action = {action}
      />
      <div
        className={clsx(
          "absolute -top-[24px] left-0",
          isOpen ? "block" : "hidden"
        )}
      >
        <div className={clsx("flex items-center gap-x-3 bg-neutral-400")}>
          <div className="p-2">
            <AiOutlineDelete
              size={16}
              onClick={() => {
                setIsModalOpen(true)
                setAction("DELETE")
              }}
            />
          </div>
          <div className="p-2">
            <AiOutlineEdit
              size={16}
              onClick={() => {
                setIsModalOpen(true)
                setAction("EDIT")
              }}
            />
          </div>
        </div>
      </div>
    </>
  )
}
