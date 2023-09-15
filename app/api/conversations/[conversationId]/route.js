import getCurrentUser from "@/app/actions/getCurrentUser"
import { NextResponse } from "next/server"
import prisma from '@/app/libs/prismadb'
import { pusherServer } from "@/app/libs/pusher"


export async function DELETE(request, {params}) {
    try {
        const {conversationId} = params
        const currentUser = await getCurrentUser()

        if(!currentUser) {
            return new NextResponse("Unauthorized", {status: 401})
        }

        const existingConversation = await prisma.conversation.findUnique({
            where: {
                id: conversationId
            },
            include: {
                users: true,
                groupFounder: true
            }
        })

        if(!existingConversation) {
            return new NextResponse("Invalid ID", {status: 400})
        }
        
        if(!currentUser.founderIn.find(convos => convos.id === conversationId)) {
            await prisma.message.create({
                data: {
                    body: `${currentUser.name} left the group`,
                    conversation: {
                        connect: {
                            id: conversationId
                        }
                    },
                    sender: {
                        connect: {
                            id: currentUser.id
                        }
                    },
                    log: true
                },
                include: {
                    sender: true
                }
            })

            const leaveConversation = await prisma.conversation.update({
                where: {
                    id: conversationId
                },
                data: {
                    users: {
                        disconnect: {
                            id: currentUser.id
                        }
                    }
                }
            })

            return NextResponse.json(leaveConversation)
        }


        const deletedConversation = await prisma.conversation.deleteMany({
            where: {
                id: conversationId,
                userIds: {
                    hasSome: [currentUser.id]
                }
            }
        })

        existingConversation.users.forEach(user => {
            if(user.email) {
                pusherServer.trigger(user.email, 'conversation:remove', existingConversation)
            }
        })

        return NextResponse.json(deletedConversation)

    } catch (error) {
        console.log(error, 'ERROR_CONVERSATION_DELETE')
        return new NextResponse("internal error", {status: 500})
    }
}