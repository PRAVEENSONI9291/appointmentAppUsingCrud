var form = document.getElementById('form');
var appointments = document.getElementById('appointments');

form.addEventListener('submit', addToLocalStorageAndPrint);

window.addEventListener("DOMContentLoaded", fetchData);

let url = "https://crudcrud.com/api/e6058a1efada4660bfb7fdad78e0b64f/appointmentdata"


async function fetchData() {


       try{

        let resp= await axios.get(url)


         for (let key in resp.data) {

                var newele = document.createElement('li');
                newele.className = 'list-group-item';

                var newele2 = document.createElement('span');
                newele2.appendChild(document.createTextNode(`${resp.data[key].name} - ${resp.data[key].email} - ${resp.data[key].phone}`));

                var newele3 = document.createElement('button');
                newele3.id = resp.data[key].email;
                newele3.className = 'btn btn-danger btn-sm float-end delete me-1';
                newele3.appendChild(document.createTextNode('X'));

                var newele4 = document.createElement('button');
                newele4.className = 'btn btn-success btn-sm float-end edit me-1';
                newele4.appendChild(document.createTextNode('Edit'));

                newele.appendChild(newele2);
                newele.appendChild(newele3);
                newele.appendChild(newele4);

                appointments.appendChild(newele);
            }

       }
       catch(error){
        alert("not working");
        console.log("error", error);

       }
}

function addToLocalStorageAndPrint(e) {
    e.preventDefault();

    var name1 = document.getElementById('name').value;
    var email = document.getElementById('email').value;
    var phone = document.getElementById('mobile').value;

    var emaildata = email;

    var myobj = {
        "name": name1,
        "email": email,
        "phone": phone
    }
    console.log(myobj);

    var newele = document.createElement('li');
    newele.className = 'list-group-item';

    var newele2 = document.createElement('span');
    newele2.appendChild(document.createTextNode(`${name1} - ${email} - ${phone}`));

    var newele3 = document.createElement('button');
    newele3.id = email;
    newele3.className = 'btn btn-danger btn-sm float-end delete me-1';
    newele3.appendChild(document.createTextNode('X'));

    var newele4 = document.createElement('button');
    newele4.className = 'btn btn-success btn-sm float-end edit me-1';
    newele4.appendChild(document.createTextNode('Edit'));

    newele.appendChild(newele2);
    newele.appendChild(newele3);
    newele.appendChild(newele4);

    if (email != "" && name1 != "" && phone != "") {
        axios.get(url)
            .then((resp) => {
                 let i=0;
                if (resp.data.length == 0) {
                    appointments.appendChild(newele);
                    axios.post(url, myobj)

                }
                else {
                    for ( i = 0; i < resp.data.length; i++) {

                        if (resp.data[i].email == emaildata) {
                            alert("This user already exist's")
                            i=resp.data.length;

                        }
                    }
                    if(i==resp.data.length) {

                        appointments.appendChild(newele);
                        axios.post(url, myobj)

                    }
                }
            })
    }

    document.getElementById('name').value = "";
    document.getElementById('email').value = "";
    document.getElementById('mobile').value = "";

}

appointments.addEventListener('click', removeList);
appointments.addEventListener('click', editList);

function removeList(e) {


    if (e.target.classList.contains('delete')) {
        var list = e.target.parentElement;

        appointments.removeChild(list);

        axios.get(url)
            .then((resp) => {
                for (let i = 0; i < resp.data.length; i++) {
                    if (e.target.id == resp.data[i].email) {
                        var ide = resp.data[i]._id;
                        i = resp.data.length;

                        axios.delete(`${url}/${ide}`)
                            .then((resp) => {
                                console.log("deleted");
                            })
                            .catch((err) => {
                                console.log("error");
                            })
                    }
                }
            })
    }
}

function editList(e) {

    if (e.target.classList.contains('edit')) {
        var list = e.target.parentElement;


        axios.get(url)
        .then((resp)=>{

            for (let i = 0; i < resp.data.length; i++) {
                if (e.target.previousElementSibling.id == resp.data[i].email) {
                    var ide = resp.data[i]._id;

                    document.getElementById('name').value = resp.data[i].name;
                    document.getElementById('email').value = resp.data[i].email;
                    document.getElementById('mobile').value = resp.data[i].phone;
                    

                    axios.delete(`${url}/${ide}`)
                        .then((resp) => {
                        })
                        .catch((err) => {
                            console.log("error");
                        })
                }
            }
        })        
        appointments.removeChild(list);

    }
}