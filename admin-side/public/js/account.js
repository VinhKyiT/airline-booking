var nameProfile = document.getElementById("profile-name");

axios.get("http://localhost:3001/api/account").then(res => {
    nameProfile.textContent = res.data.name

    if (res.data.role !== "admin"){
        var navContainer = document.getElementById("nav-container");
        var li_user = document.getElementById("li-user")
        var li_role = document.getElementById("li-role")
        navContainer.removeChild(li_user);
        navContainer.removeChild(li_role);
    }
});

var showInput = function () {
    var textEmail = document.getElementById("text-email");
    var textUsername = document.getElementById("text-username");
    var textName = document.getElementById("text-name");
    var textPhone = document.getElementById("text-phone");
    var btnEdit = document.getElementById("btn_edit");

    
    textEmail.classList.add("d-none");
    textUsername.classList.add("d-none");
    textName.classList.add("d-none");
    textPhone.classList.add("d-none");
    btnEdit.classList.add("d-none");
    
    var Email = document.getElementById("email");
    var Username = document.getElementById("username");
    var Name = document.getElementById("name");
    var Phone = document.getElementById("phone");
    var GroupBtn = document.getElementById("group-btn");

    Email.classList.remove("invisible");
    Username.classList.remove("invisible");
    Name.classList.remove("invisible");
    Phone.classList.remove("invisible");
    GroupBtn.classList.remove("d-none");
};