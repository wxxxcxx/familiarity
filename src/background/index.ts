export { }

console.log(
    "Live now; make now always the most precious time. Now will never come again."
)

chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        title: '查询单词',
        contexts: [
            'selection'
        ],
        id: 'query'
    })
    chrome.contextMenus.create({
        title: '保存单词',
        contexts: [
            'selection'
        ],
        id: 'save'
    })
})

chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === 'query') {
        chrome.tabs.sendMessage(tab.id!, {
            type: 'query',
            word: info.selectionText
        })
    }
    if (info.menuItemId === 'save') {
        chrome.tabs.sendMessage(tab.id!, {
            type: 'save',
            word: info.selectionText
        })
    }
})