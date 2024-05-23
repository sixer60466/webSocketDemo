const WebSocket = require('ws')
const uuidv4 = require('uuid').v4

const wss1 = new WebSocket.WebSocketServer({ noServer: true });

wss1.on('connection', function connection(ws) {
    ws.on('error', console.error);
    console.log('連線成功')

    const uuid = uuidv4()

    ws.uuid = uuid; // 判斷是哪一個用戶使用

    // 發出第一個訊息給用戶，表示用戶是誰
    const user = {
        context: 'user',
        uuid,
    }
    // 發訊息給用戶
    ws.send(JSON.stringify(user)) // 只能發送字串

    //監聽
    ws.on('message', (req) => {
        const msg = JSON.parse(req)
        const newMessage = {
            context: 'msg',
            uuid,
            content: msg.content
        }
        sendAllUser(newMessage)
    })

    //推播
    const sendAllUser = (msg) => {
        wss1.clients.forEach(function each(client) {
            //推播給自己以外的用戶
            if (client.readyState === WebSocket.OPEN && client.uuid !== msg.uuid) {
                client.send(JSON.stringify(msg));
            }
        });
    }
});

module.exports = wss1