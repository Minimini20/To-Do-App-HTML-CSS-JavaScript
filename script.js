let TC = document.querySelector(".ticket-container");
let allFilters = document.querySelectorAll(".filter");
let deleteButton = document.querySelector(".delete");
let modalVisible = false;
let selectedPriority = "pink";

function loadTickets(priority){
    let allTaskData = localStorage.getItem("allTasks");
    if(allTaskData!=null){
        let data = JSON.parse(allTaskData);
        if(priority){
            data = data.filter(function(d){
                return d.selectedPriority == priority;
            })
        }
        TC.innerHTML = "";
        for(let i=0;i<data.length;i++){
                let ticket = document.createElement("div");
            ticket.classList.add("ticket");
            ticket.innerHTML =  `<div class="ticket-color ticket-color-${data[i].selectedPriority}"></div>
                        <div class="ticket-id">${data[i].taskId}</div>
                        <div class="task">
                            ${data[i].task}
                        </div>`;
            ticket.addEventListener("click", function(e) {
                if(e.currentTarget.classList.contains("active")) {
                    e.currentTarget.classList.remove("active");
                } else {
                    e.currentTarget.classList.add("active");
                }
            });
            TC.appendChild(ticket);
        }
    }
}

for (let i = 0; i < allFilters.length; i++) {
    allFilters[i].addEventListener("click", filterHandler);
}

function filterHandler(e){
    if(e.currentTarget.classList.contains("active")){
        e.currentTarget.classList.remove("active");
        loadTickets();
    }
    else{
        let selectedFilter = document.querySelector(".filter.active");
        if(selectedFilter){
            selectedFilter.classList.remove("active");
        }
        e.currentTarget.classList.add("active");
        
        loadTickets(e.currentTarget.children[0].classList[0].split("-")[0]);
    }
}

let addButton= document.querySelector(".add");
addButton.addEventListener("click", showModal);

function showModal(e) {
    if(!modalVisible) {
        let modal  = document.createElement("div");
        modal.classList.add("modal");
        modal.innerHTML = `<div class="task-to-be-added" spellcheck="false" data-type="false" contenteditable="true">
                        <span class="placeholder">Enter your text here</span>
                    </div>
                    <div class="priority-list">
                        <div class="pink-modal-filter modal-filter active">Home</div>
                        <div class="blue-modal-filter modal-filter">College</div>
                        <div class="yellow-modal-filter modal-filter">Pepcoding</div>
                        <div class="green-modal-filter modal-filter">Self-Study</div>
                    </div>`;
    TC.appendChild(modal);
    selectedPriority = "pink";
    let taskTyper = document.querySelector(".task-to-be-added");
    taskTyper.addEventListener("click", function(e) {
        if(e.currentTarget.getAttribute("data-type") == "false") {
            e.currentTarget.innerHTML = "";
            e.currentTarget.setAttribute("data-type","true");
        }
    });
    taskTyper.addEventListener("keypress", addTicket.bind(this,taskTyper));
    modalVisible= true;
    let modalFilters = document.querySelectorAll(".modal-filter");

    for(let i = 0; i < modalFilters.length; i++) {
        modalFilters[i].addEventListener("click", selectPriority);
    }
    }
}

function selectPriority(e) {
    let activeFilter = document.querySelector(".modal-filter.active");
    activeFilter.classList.remove("active");
    // console.log(getComputedStyle(e.currentTarget).backgroundColor);
    selectedPriority = e.currentTarget.classList[0].split("-")[0];
    e.currentTarget.classList.add("active");
}

function addTicket(taskTyper,e) {
    if(e.key == "Enter" && e.shiftKey == false && taskTyper.innerText.trim() != "") {
        // let ticket = document.createElement("div");
        // ticket.classList.add("ticket");
        let id = uid();
        let task = taskTyper.innerText;
        // ticket.innerHTML =  `<div class="ticket-color ticket-color-${selectedPriority}"></div>
        //             <div class="ticket-id">${id}</div>
        //             <div class="task">
        //                 ${task}
        //             </div>`;
        document.querySelector(".modal").remove();
        modalVisible = false;
        // ticket.addEventListener("click", function(e) {
        //     if(e.currentTarget.classList.contains("active")) {
        //         e.currentTarget.classList.remove("active");
        //     } else {
        //         e.currentTarget.classList.add("active");
        //     }
        // });
        // TC.appendChild(ticket);
        let allTaskData = localStorage.getItem("allTasks");
        if(allTaskData==null){
            console.log("hello");
            let data = [{"taskId":id, "task":task, "selectedPriority":selectedPriority}];
            localStorage.setItem("allTasks",JSON.stringify(data));
        }
        else{
            let data = JSON.parse(allTaskData);
            data.push({"taskId":id, "task":task, "selectedPriority":selectedPriority});
            localStorage.setItem("allTasks",JSON.stringify(data));
        }
        let selectedFilter = document.querySelector(".filter.active");
        if(selectedFilter){
            let prioirty = selectedFilter.children[0].classList[0].split("-")[0];
            loadTickets(prioirty);
        }
        else{
            loadTickets();
        }
    } else if(e.key == "Enter" && e.shiftKey == false ) {
        e.preventDefault();
        alert("you have not typed anything");
    }
}

deleteButton.addEventListener("click", function(e) {
    let selectedTickets = document.querySelectorAll(".ticket.active");
    let allTasks = JSON.parse(localStorage.getItem("allTasks"));
    for(let i=0;i<selectedTickets.length;i++){
        selectedTickets[i].remove();
        allTasks = allTasks.filter(function(d){
            return d.taskId != selectedTickets[i].querySelector(".ticket-id").innerText;
        });
    }
    localStorage.setItem("allTasks",JSON.stringify(allTasks));
});


loadTickets();