import type { PlasmoMessaging } from "@plasmohq/messaging"
import { Storage } from "@plasmohq/storage"
import * as utils from "../../utils"

const syncStorage = new Storage({
    area: "sync",
})

const handler: PlasmoMessaging.MessageHandler = async (request, response) => {
    const items = await syncStorage.getAll()
    const words = []
    for (const key in items) {
        if (key.startsWith('word.')) {
            const word = key.substring('word.'.length)
            words.push(word)
        }
    }
    response.send({
        code: 0,
        words: words
    })
}

export default handler