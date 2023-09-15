"use client"

import { Button } from "@/app/components/Button"
import Modal from "@/app/components/Modal"
import { Input } from "@/app/components/inputs/Input"
import axios from "axios"
import { useRouter } from "next/navigation"
import React from "react"
import { useForm } from "react-hook-form"
import { toast } from "react-hot-toast"
import { AiOutlineConsoleSql } from "react-icons/ai"

export default function ConfirmDeleteModal({
  isOpen,
  onClose,
  message,
  action
}) {
  const router = useRouter()

  const handleDeleteMessage = () => {
    axios
      .delete(`/api/messages/${message.id}`)
      .then(() => {
        router.refresh()
        onClose()
      })
      .catch((err) => toast.error(err.response.data))
  }

  const onSubmit = data => {
    axios.put(`/api/messages/${message.id}`, {
      ...message,
      edited: true,
      body: data.body
    })
    .then(() => {
      router.refresh()
      onClose()
    })
    .catch(() => toast.error("Something went wrong!"))
  }

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues: {
      body: message.body
    }
  })

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
    >
      {action === "DELETE" ? (
        <>
          <h2 className="text-center font-bold text-xl">Delete the message?</h2>
          <p className="my-4">
            Sure you wanna delete the message? This action cant be returned!
          </p>
          <div className="flex items-center justify-end">
            <Button
              type="button"
              danger
              onClick={handleDeleteMessage}
            >
              Delete
            </Button>
          </div>
        </>
      ) : (
        <>
          <h2 className="text-center font-bold text-xl">Edit the message</h2>
          <form onSubmit = {handleSubmit(onSubmit)}>
            <div className="rounded-2xl border border-neutral-400 py-4 px-2 my-4">
              <Input
                register={register}
                label="Message text"
                name="body"
                errors={errors}
                id="body"
                type="text"
                required
                disabled={false}
              />
            </div>
            <div className="flex justify-end">
              <Button type="submit">Edit</Button>
            </div>
          </form>
        </>
      )}
    </Modal>
  )
}
