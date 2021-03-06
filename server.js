const Koa = require('koa');
const koaBody = require('koa-body');
const cors = require('koa2-cors');

const app = new Koa();

let port = process.env.PORT;
if (port == null || port === '') {
  port = 8000;
}

app.use(koaBody({ multipart: true }));
app.use(cors({
  origin: '*',
}));

const tickets = [{
  id: '0',
  name: 'Wake up',
  description: '',
  status: 'false',
  created: '1607705840212',
},
{
  id: '1',
  name: 'Take a shower',
  description: 'You\'re dirty',
  status: 'false',
  created: '1607705840212',
}];

app.use(async (ctx) => {
  const { method, id } = ctx.request.query;

  switch (method) {
    case 'allTickets':
      ctx.response.body = tickets.map((ticket) => ({
        id: ticket.id, name: ticket.name, status: ticket.status, created: ticket.created,
      }));
      return;
    case 'ticketById':
      ctx.response.body = tickets.find((ticket) => ticket.id === id);
      if (!ctx.response.body) {
        ctx.response.status = 404;
      }
      return;
    case 'createTicket':
      ctx.request.body.id = (tickets.length).toString();
      tickets.push(ctx.request.body);
      ctx.response.status = 201;
      return;
    case 'changeTicket':
      tickets.splice(tickets
        .findIndex((ticket) => ticket.id === id), 1, ctx.request.body);
      ctx.response.status = 200;
      return;
    case 'changeStatus':
      tickets.forEach((ticket) => {
        if (ticket.id === id) {
          // eslint-disable-next-line no-param-reassign
          ticket.status = (!(ticket.status === 'true')).toString();
        }
      });
      ctx.response.status = 200;
      return;
    case 'deleteTicket':
      tickets.splice(tickets.findIndex((ticket) => ticket.id === id), 1);
      ctx.response.status = 200;
      return;
    default:
      ctx.response.status = 404;
  }
});

app.listen(port, () => console.log(`HelpDesk server listening on port ${port}!`));
