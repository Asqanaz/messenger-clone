import getCurrentUser from "@/app/actions/getCurrentUser"
import { NextResponse } from "next/server"
import prisma from "@/app/libs/prismadb"
import { pusherServer } from "@/app/libs/pusher"

export async function POST(request) {
  try {
    const currentUser = await getCurrentUser()
    const body = await request.json()
    const { userId, isGroup, members, name } = body

    if (!currentUser?.id || !currentUser?.email) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    if (isGroup && (!members || members.length < 2 || !name)) {
      return new NextResponse("Invalid data", { status: 400 })
    }

    if (isGroup) {
      const newConversation = await prisma.conversation.create({
        data: {
          name,
          isGroup,
          users: {
            connect: [
              ...members.map(member => ({
                id: member.value
              })),
              {
                id: currentUser.id
              }
            ]
          },
          messages: {
            connectOrCreate: {
              // where: {
              //   sender: 
              // },
              create: [...members.map(member => {
                if (member.value === currentUser.id) {
                  return {
                    body: `${member.name} created the group chat`,
                    log: true
                  }
                }
      
                return {
                  body: `${member.name} joined the group`,
                  log: true
                }
              })]
            }
          },
          groupFounder: {
            connect: {
              id: currentUser.id
            }
          }
        },
        include: {
          users: true,
          groupFounder: true
        }
      })

      console.log([
        ...newConversation.users.map(user => {
          if (user.id === currentUser.id) {
            return {
              body: `${user.name} created the group chat`,
              conversation: {
                connect: {
                  id: newConversation.id
                }
              },
              sender: {
                connect: {
                  id: user.id
                }
              },
              log: true
            }
          }

          return {
            body: `${user.name} joined the group`,
            conversation: {
              connect: {
                id: newConversation.id
              }
            },
            sender: {
              connect: {
                id: user.id
              }
            },
            log: true
          }
        })
      ])

      await prisma.message.createMany({
        data: [
          ...newConversation.users.map(user => {
            if (user.id === currentUser.id) {
              return {
                body: `${user.name} created the group chat`,
                conversation: {
                  connect: {
                    id: newConversation.id
                  }
                },
                sender: {
                  connect: {
                    id: user.id
                  }
                },
                log: true
              }
            }

            return {
              body: `${user.name} joined the group`,
              conversation: {
                connect: {
                  id: newConversation.id
                }
              },
              sender: {
                connect: {
                  id: user.id
                }
              },
              log: true
            }
          })
        ]
      })

      newConversation.users.forEach(user => {
        if (user.email) {
          pusherServer.trigger(user.email, "conversation:new", newConversation)
        }
      })

      return NextResponse.json(newConversation)
    }

    const existingConversation = await prisma.conversation.findMany({
      where: {
        OR: [
          {
            userIds: {
              equals: [currentUser.id, userId]
            }
          },
          {
            userIds: {
              equals: [userId, currentUser.id]
            }
          }
        ]
      }
    })

    const singleConversation = existingConversation[0]

    if (singleConversation) {
      return NextResponse.json(singleConversation)
    }

    const newConversation = await prisma.conversation.create({
      data: {
        users: {
          connect: [
            {
              id: currentUser.id
            },
            {
              id: userId
            }
          ]
        }
      },
      include: {
        users: true
      }
    })

    newConversation.users.map(user => {
      if (user.email) {
        pusherServer.trigger(user.email, "conversation:new", newConversation)
      }
    })

    return NextResponse.json(newConversation)
  } catch (err) {
    console.log("ERROR_GROUP_CHAT_CREATE", err)
    return new NextResponse("Internal Error", { status: 500 })
  }
}
