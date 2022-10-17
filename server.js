const http = require('http');
const Koa = require('koa');
const koaBody = require('koa-body');
const cors = require('koa2-cors');
const app = new Koa();

class Ticket {
    constructor(id, name, status, created) {
        this.id = id,
        this.name = name,
        this.status = status,
        this.created = created
    }
}

class TicketFull {
    constructor(id, name, description, status, created) {
        this.id = id,
        this.name = name,
        this.description = description,
        this.status = status,
        this.created = created
    }
}

app.use(cors());

app.use(koaBody({
    text: true,
    urlencoded: true,
    multipart: true,
    json: true
}));

const tickets = [
    {
        id: 0,
        name: 'Поменять краску в принтере',
        description: 'Принтер HP, картридж на складе',
        status: true,
        created: new Date('2022-10-10, 08:40').toString().slice(3, 21)
    },
    {
        id: 1,
        name: 'Установить обновления для ПК',
        description: 'Windows 11',
        status: false,
        created: new Date('2022-10-15, 13:35').toString().slice(3, 21)
    },
    {
        id: 2,
        name: 'Вызвать сантехника',
        description: 'Течет кран в сан-узле',
        status: false,
        created: new Date('2022-10-15, 12:40').toString().slice(3, 21)
    }
];

function getAllTickets() {
    const arr = [];
    tickets.forEach((el) => {
        arr.push(new Ticket(el.id, el.name, el.status, el.created))
    })
    return arr;
}

function findTicketById(id) {
    const result = tickets.find((ticket) => ticket.id === id);
    return result;
}

app.use(async ctx => {
    const params = new URLSearchParams(ctx.request.querystring);
    const obj = { method: params.get('method'), id: params.get('id') };
    const { method, id } = obj;
    const { body } = ctx.request;

    switch (method) {
        case 'allTickets':
            ctx.response.body = getAllTickets();
            return;

        case 'ticketById':
            if (ctx.request.query.id) {
                ctx.response.body = findTicketById(+id);
            }
            return;

        case 'createTicket':
            const nextId = tickets.length;
            tickets.push(new TicketFull(
                nextId,
                body.title,
                body.description,
                false,
                new Date().toString().slice(3, 21)
            ))
            ctx.response.body = tickets[nextId];
            return;

        case 'editTicket':
            const index = body.id;
            tickets[index].name = body.title;
            tickets[index].description = body.description;
            ctx.response.body = tickets[index];
            return;

        case 'deleteTicket':
            const ind = tickets.findIndex((ticket) => +ticket.id === +id);
            ctx.response.body = 'del';
            tickets.splice(ind, 1);
            return;

        default:
            ctx.response.status = 404;
            return;
    }
});

app.use(async (ctx) => {
    console.log('request.querystring:', ctx.request.querystring);
    console.log('request.body', ctx.request.body);
    ctx.response.status = 204;

    console.log(ctx.response);
});

const port = process.env.PORT || 7070;
const server = http.createServer(app.callback()).listen(port, () => console.log(`server is listening on port ${port}`));