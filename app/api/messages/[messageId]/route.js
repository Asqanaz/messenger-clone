import { NextResponse } from "next/server"
import prisma from "@/app/libs/prismadb"
import getCurrentUser from "@/app/actions/getCurrentUser"

export async function DELETE(_, { params }) {
  try {
    const currentUser = await getCurrentUser()

    if (!currentUser) {
      return new NextResponse("Unauthorized", { status: 401 })
    }
    
    const { messageId } = await params

    const message = await prisma.message.findUnique({
      where: {
        id: messageId
      }
    })

    if (message.senderId !== currentUser.id) {
      return new NextResponse("You cant delete the message", { status: 400 })
    }


    const deletedMessage = await prisma.message.delete({
      where: {
        id: messageId
      }
    })

    return NextResponse.json(deletedMessage)
  } catch (error) {
    console.log(error, "ERROR_MESSAGE_DELETE")
    return new NextResponse("Internal Error", { status: 500 })
  }
}

export async function PUT(request, { params }) {
  try {
    const { messageId } = params

    const res = await request.json()

    const { body, edited } = await res

    const updatedMessage = await prisma.message.update({
      where: {
        id: messageId
      },
      data: {
        body,
        edited
      }
    })

    return NextResponse.json(updatedMessage)
  } catch (error) {
    console.log(error, "ERROR_MESSAGE_UPDATE")
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}
