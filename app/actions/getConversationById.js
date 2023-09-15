import prisma from "@/app/libs/prismadb"
import getCurrentUser from "./getCurrentUser"
import { redirect } from "next/navigation"

export default async function getConversationById(conversationId) {
  try {
    const currentUser = await getCurrentUser()

    if (!currentUser?.email) {
      return null
    }

    const conversation = await prisma.conversation.findUnique({
      where: {
        id: conversationId
      },
      include: {
        users: true,
        groupFounder: true
      }
    })

    if (!currentUser.conversationIds.find(convo => convo === conversationId)) {
      redirect("/conversations")
    }

    return conversation
  } catch (err) {
    console.log('ERROR_GET_CONVERSATIONS', err.message)
    return null
  }
}
