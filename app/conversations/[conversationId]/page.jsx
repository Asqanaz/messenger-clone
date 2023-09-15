import getConversationById from "@/app/actions/getConversationById"
import getMessages from "@/app/actions/getMessages"
import EmptyState from "@/app/components/EmptyState"
import Header from "./components/Header"
import Body from "./components/Body"
import Form from "./components/Form"
import { redirect } from "next/navigation"

export default async function ConversationId({ params }) {
  const conversation = await getConversationById(params.conversationId)

  const messages = await getMessages(params.conversationId)

  if (!conversation) {
    redirect("/conversations")
  }


  return (
    <div className="lg:pl-80 h-full">
      <div className="h-full flex flex-col">
        <Header conversation={conversation} />
        <Body initialMessages={messages} />
        <Form />
      </div>
    </div>
  )
}
