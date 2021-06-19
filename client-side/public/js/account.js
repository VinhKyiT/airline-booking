var showInput = function(){
    var textEmail = document.getElementById("text-email")
    var textUsername = document.getElementById("text-username")
    var textName = document.getElementById("text-name")
    var textPhone = document.getElementById("text-phone")
    var textCmnd = document.getElementById("text-cmnd");
    var textGender = document.getElementById("text-gender");
    var textJob = document.getElementById("text-job");
    var textDate = document.getElementById("text-date_of_birth");
    var btnEdit = document.getElementById("btn_edit");
    var btnEditDate = document.getElementById("btn_edit_date");

    var Email = document.getElementById("email")
    var Username = document.getElementById("username")
    var Name = document.getElementById("name")
    var Phone = document.getElementById("phone")
    var Cmnd = document.getElementById("cmnd");
    var Gender1 = document.getElementById("gender1");
    var Gender2 = document.getElementById("gender2");
    var Job = document.getElementById("job");
    var DateOfBirth = document.getElementById("date_of_birth");
    var GroupBtn = document.getElementById("group-btn");

    textEmail.classList.add("d-none");
    textUsername.classList.add("d-none");
    textName.classList.add("d-none");
    textPhone.classList.add("d-none");
    textCmnd.classList.add("d-none");
    textGender.classList.add("d-none");
    textJob.classList.add("d-none");
    btnEdit.classList.add("d-none");
    textDate.classList.add('d-none')

    Email.classList.remove("hidden");
    Username.classList.remove("hidden");
    Name.classList.remove("hidden");
    Phone.classList.remove("hidden");
    Cmnd.classList.remove("hidden");
    Gender1.classList.remove("d-none");
    Gender2.classList.remove("d-none");
    Job.classList.remove("hidden");
    DateOfBirth.classList.remove("hidden");
    GroupBtn.classList.remove("d-none");
    btnEditDate.classList.remove("d-none");
    
}

var showDate = function(){
    var DateOfBirth = document.getElementById("date_of_birth");
    var status = DateOfBirth.disabled

    if (status){
        DateOfBirth.disabled = false;
        document.getElementById("text-edit-date").textContent = "  Tắt";
    }else{
        DateOfBirth.disabled = true;
        document.getElementById("text-edit-date").textContent = "  Cập nhật";
    }
}