
const versionPromise = fetch('http://localhost:5000/api/GetVersion');
const versionStream = versionPromise.then((response) => response.text());
versionStream.then((data) => { document.getElementById("version").innerHTML += data; });

const loadComments = () => {
    const GetComments = fetch('http://localhost:5000/api/GetComments')
        .then((response) => response.text())
        .then((data) => { document.getElementById("comments").innerText = data; });
}

const writeComment = async () => {
    let guest = {
        Comment: document.getElementById("comment").value,
        Name: document.getElementById("name").value,
    };
    const json = JSON.stringify(guest);
    let load = await fetch("http://localhost:5000/api/WriteComment",
        {
            headers: {
                "Content-Type": "application/json"
            },
            method: "POST",
            body: json
        });
    document.querySelector("iframe").src += "";
}



const userRes = () => {
    const Id = document.getElementById("NewUser").value;
    const pass = document.getElementById("NewPass").value;
    let newUser = {
        userName: Id,
        password: pass,
    };
    const json = JSON.stringify(newUser);
    const resgister = fetch("http://localhost:5000/api/Register",
        {
            headers: {
                "Content-Type": "application/json"
            },
            method: "POST",
            body: json

        }).then(response => response.text());
    resgister.then(data => {
        document.getElementById("registrationResponse").innerText = data;
        if (data !== "Username not available.") {
            document.getElementById("NewUser").value = "";
            document.getElementById("NewPass").value = "";
        }
    });
}

const revealPassword = () => {
    var x = document.getElementById("NewPass");
    if (x.type === "password") {
        x.type = "text";
    } else {
        x.type = "password";
    }
}

function getItems() {
    const ItemsPromise = fetch("http://localhost:5000/api/GetItems");
    const Items = ItemsPromise.then((response) => response.json());
    Items.then((data) => showItems(data));
}

function showItems(data) {
    let htmlString = "";
    let imgNo = 0;
    const showItem = (item) => {
        htmlString += `<tr>
        <td><img id="itemImage${imgNo}" alt="Item Image" width="auto" height="70vh" src="http://localhost:5000/api/GetItemPhoto/${item.id}" /></td>
        <td><b>${item.name}</b><br><br><button id="ButButton" type="button" onclick="Buy(${item.id})">Buy now!</button></td>
        <td>${item.description}</td>
        <td>$${item.price}</td>
        </tr>`;
        imgNo += 1;
    }
    data.forEach(showItem);
    const itemTable = document.getElementById("itemList").innerHTML += htmlString;
}

function Search() {
    var input, filter, table, tr, td, i, txtValue;
    input = document.getElementById("Searchbar");
    filter = input.value.toUpperCase();
    table = document.getElementById("itemList");
    tr = table.getElementsByTagName("tr");

    for (i = 0; i < tr.length; i++) {
        td = tr[i].getElementsByTagName("td")[1];
        if (td) {
            txtValue = td.textContent || td.innerText;
            if (txtValue.toUpperCase().indexOf(filter) > -1) {
                tr[i].style.display = "";
            } else {
                tr[i].style.display = "none";
            }
        }
    }
}

function Buy(product) {
    let IdPwd = localStorage.getItem("StoredUserName");
    if (IdPwd == null) {
        alert("Login needed.");
        openHome();
    }
    else {
        document.getElementById('PurchaseSuccess').innerHTML = `Thank you for buying ${product}.`;
        document.getElementById('PurcahseModal').style.display = 'block';
    }
}

function ModalClose() {
    document.getElementById('PurcahseModal').style.display = 'none';
}

async function getStaffId() {
    let promise = await fetch("http://localhost:5000/api/GetAllStaff");
    let Staff_list = await promise.json();
    let htmlString = "";
    for (let a of Staff_list) {
        htmlString += await fetchThis(a.id);
    }
    document.getElementById("staffs").innerHTML += htmlString;
    async function fetchThis(data) {
        let i = 0;
        let j = 20;
        let description = [];
        let fetchString = "";
        let vPromise = await fetch(`http://localhost:5000/api/GetCard/${data}`);
        let vcard = await vPromise.text();
        let Arr = vcard.split("\r").join(',').split(":").join(',').split(",");
        while (i < 7) {
            Arr.pop();
            i++;
        }
        fetchString = `<tr><td><img id="staffImage${Arr[9]}" alt="StaffPhoto" width="auto" height="70vh" src="http://localhost:5000/api/GetStaffPhoto/${Arr[9]}"/></td>
            <td>${Arr[7]} &nbsp; <a id="vcardLink" href="http://localhost:5000/api/GetCard/${Arr[9]}">&#128100;</a><br><br>
            <a href="mailto:${Arr[13]}""> ${Arr[13]}</a><br><br>
            <a href="tel:${Arr[15]}"> ${Arr[15]}</a><br><br>
            <a href="http:${Arr[18]}">http:${Arr[18]}</a></td>`;
        while (j < Arr.length) {
            description.push(Arr[j]);
            j++;
        }
        fetchString += `<td>${description.join(",")}</td></tr>`;
        return fetchString;
    }
}

function GetVersionA() {
    let header = new Headers();
    let IdPwd = localStorage.getItem("StoredUser");
    header.set("Authorization", IdPwd);
    const versionPromise = fetch('http://localhost:5000/api/GetVersionA', {
        method: 'Get',
        headers: header,
    });
    const versionStream = versionPromise.then((response) => response.text()).then((data) => { document.getElementById("test").innerHTML = data; });
}

const ShowPassword = () => {
    var x = document.getElementById("Password");
    if (x.type === "password") {
        x.type = "text";
    } else {
        x.type = "password";
    }
}

function Login() {
    const Id = document.getElementById("UserId").value;
    const pass = document.getElementById("Password").value;
    let x = Id + ":" + pass;
    let header = new Headers();
    let y = "Basic ";
    y += btoa(x);

    header.set('Authorization', y);

    const promise = fetch("http://localhost:5000/api/GetVersionA", {
        method: 'GET',
        headers: header,
    }).then(res => {
        if (res.status === 200) {
            localStorage.setItem("StoredUser", y);
            LoginSuccess();
            localStorage.setItem("StoredUserName", Id);
            CheckLogin();
        }
        else {
            document.getElementById("LoginResponse").innerHTML = "Invalid ID or Password!";
        }
    });
}

function LoginSuccess() {
    document.getElementById("Login").style.display = 'none';
    document.getElementById("RegNav").style.display = 'none';
}

function CheckLogin() {
    if (localStorage.getItem("StoredUserName") == null) {
        document.getElementById("username").innerHTML = '<p id="LoginRequired" onclick="openHome()">Check below to sign in</p>';
    }
    else {
        document.getElementById("username").innerHTML = "Hello, " + localStorage.getItem("StoredUserName") + '<a id="Logout" onclick="Logout()">(<u>logout</u>)';
        document.getElementById("RegNav").style.display = 'none';
        document.getElementById("Login").style.display = 'none';
    }
}

function Logout() {
    localStorage.clear();
    document.getElementById("username").innerHTML = '<p id="LoginRequired" onclick="openHome()">Check below to sign in</p>';
    document.getElementById("Login").style.display = 'block';
    document.getElementById("RegNav").style.display = 'block';
    document.getElementById("UserId").value = '';
    document.getElementById("Password").value = '';
}

const openHome = () => {
    document.getElementById("home").style.display = 'block';
    document.getElementById('staff').style.display = 'none';
    document.getElementById('shop').style.display = 'none';
    document.getElementById('registration').style.display = 'none';
    document.getElementById('guest').style.display = 'none';
}
const openStaff = () => {
    document.getElementById('home').style.display = 'none';
    document.getElementById('staff').style.display = 'block';
    document.getElementById('shop').style.display = 'none';
    document.getElementById('registration').style.display = 'none';
    document.getElementById('guest').style.display = 'none';

}
const openShop = () => {
    document.getElementById("home").style.display = 'none';
    document.getElementById('staff').style.display = 'none';
    document.getElementById('shop').style.display = 'block';
    document.getElementById('registration').style.display = 'none';
    document.getElementById('guest').style.display = 'none';
}
const openGuest = () => {
    document.getElementById("home").style.display = 'none';
    document.getElementById('staff').style.display = 'none';
    document.getElementById('shop').style.display = 'none';
    document.getElementById('registration').style.display = 'none';
    document.getElementById('guest').style.display = 'block';
}
const openLogin = () => {
    document.getElementById("home").style.display = 'none';
    document.getElementById('staff').style.display = 'none';
    document.getElementById('shop').style.display = 'none';
    document.getElementById('registration').style.display = 'block';
    document.getElementById('guest').style.display = 'none';
}

window.onload = openHome();

getItems();
getStaffId();
CheckLogin();