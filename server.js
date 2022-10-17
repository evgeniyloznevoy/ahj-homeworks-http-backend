const http = require('http');
const Koa = require('koa');
const Router = require('@koa/router');
const Mount = require('koa-mount');
const BodyParser = require('koa-bodyparser');
const cors = require('@koa/cors');

const tickets = ticketList()

const v1Router = new Router();

v1Router.get('/tickets', (ctx, next) => {
    ctx.body = tickets;
});

v1Router.get('/tickets/:id', (ctx, next) => {
    const id = Number(ctx.params.id)
    const e = tickets.find(e => e.id === id)
    if (e === undefined) {
        ctx.status = 404;
        return
    }
    ctx.body = e;
});

v1Router.post('/tickets', (ctx, next) => {
    let maxID = -1;
    tickets.forEach((e) => maxID = Math.max(maxID, e.id))
    let task = ctx.request.body;
    task.id = maxID + 1
    tickets.push(task)
    ctx.status = 200;
});

const appV1 = new Koa();

appV1.use(BodyParser());

appV1.use(v1Router.routes())

const app = new Koa();

app.use(cors());
app.use(Mount('/v1', appV1));

const port = process.env.PORT || 80;
const server = http.createServer(app.callback()).listen(port, () => console.log(`server is listening on port ${port}`));

function ticketList() {
    return [
        {
            id: 1,
            name: "Обновить Windows",
            description: "Установить свежее обновление операционной системы",
            status: 0,
            created: "2022-10-10T23:50:00"
        },
        {
            id: 2,
            name: "Купить новый дрель",
            description: "Сходить в магазин за новой дрелью",
            status: 0,
            created: "2022-10-12T17:00:00"
        },
        {
            id: 3,
            name: "Повесить полку",
            description: "Повесить полку на кухне",
            status: 1,
            created: "2022-10-13T15:00:00"
        },
        {
            id: 4,
            name: "Позвонить сантехнику",
            description: "Вызвать сантехника для ремонта душа",
            status: 0,
            created: "2022-10-13T13:00:00"
        },
    ]

}