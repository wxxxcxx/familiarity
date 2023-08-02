import type { PlasmoMessaging } from "@plasmohq/messaging"
import { Storage } from "@plasmohq/storage"
import * as utils from "../../utils"

const syncStorage = new Storage({
    area: "sync",
})

const handler: PlasmoMessaging.MessageHandler = async (request, response) => {
    const items = await syncStorage.getAll()
    const keys = []
    for (const key in items) {
        if (key.startsWith('word.')) {
            const queryKey = key.substring('word.'.length)
            keys.push(queryKey)
        }
    }
    response.send({
        code: 0,
        keys: keys
    })
}

export default handler