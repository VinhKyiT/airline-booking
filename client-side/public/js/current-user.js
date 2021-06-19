const userName = document.getElementById("strong-username")
const email = document.getElementById("strong-email")
const date = document.getElementById("strong-date")
const totalValue = document.getElementById("strong-totalValue");

axios.get("http://localhost:3000/api/current-account").then(res => {
    userName.textContent = res.data.username;
    email.textContent = res.data.email;
    date.textContent = res.data.date;
    totalValue.textContent = res.data.totalOrderValue.toLocaleString("vi", {
        style: "currency",
        currency: "VND",
    });
});