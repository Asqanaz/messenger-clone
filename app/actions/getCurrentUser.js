import prisma from "@/app/libs/prismadb"
import getSession from "./getSession"

export default async function getCurrentUser() {
    try {
        const session = await getSession()

        if(!session?.user?.email) {
            return null
        }

        const currentUser = await prisma.user.findUnique({
            where: {
                email: session.user.email
            },
            include: {
                founderIn: true
            }
        })

        if(!currentUser) {
            return null
        }

        return currentUser
    }
    catch (err) {
        return null
    }
}
