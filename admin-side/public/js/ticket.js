var ticketItem = function(ticket){
    return `
    <tr>
        <td>${ticket.code}</td>
        <td>${ticket.route}</td>
        <td>${ticket.ticket_class}</td>
        <td>${ticket.price.toLocaleString('vi', {style : 'currency', currency : 'VND'})}</td>
        ${
            (() => {
                if (ticket.status === "Vẫn còn"){
                    return `<td><span class="badge badge-success"><a href="/tickets/change-status/${ticket._id}" class="text-white text-decoration-none" title="Click to change status">${ticket.status}</a></span></td>`;
                }else if (ticket.status === "Đã đặt"){
                    return `<td><span class="badge badge-danger"><a href="/tickets/change-status/${ticket._id}" class="text-white text-decoration-none" title="Click to change status">${ticket.status}</a></span></td>`;
                }
            })()
        }
        
    </tr>`
}

var select_route = document.getElementById("select-route");
var select_ticket_class = document.getElementById("select-ticket-class");

var changeTicket = function(){
    axios.get(`http://localhost:3001/api/ticket/${select_route.value}/${select_ticket_class.value}`).then(res => {
        var textInner = ''
        res.data.forEach(ticket => {
            textInner += ticketItem(ticket);
        })

        document.getElementById("ticket").innerHTML = textInner;
    })
}

var search = function(){
    var code = document.getElementById("input-search").value;
    axios.get(`http://localhost:3001/api/ticket/${select_route.value}/${select_ticket_class.value}/${code}`).then(res => {
        console.log(res.data)
        var textInner = ''
        res.data.forEach(ticket => {
            textInner += ticketItem(ticket);
        })

        document.getElementById("ticket").innerHTML = textInner;
    })
}

changeTicket()

