let user_name = "";
let passwd = "";
let id = 2;
let users = [];
const url = 'https://asdfdsad.herokuapp.com/usuarios';

function create_UUID(){
    var dt = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (dt + Math.random()*16)%16 | 0;
        dt = Math.floor(dt/16);
        return (c=='x' ? r :(r&0x3|0x8)).toString(16);
    });
    return uuid;
}

function create_alert(element, s){
    if (element) return;
    let al = document.createElement('div'); 
    al.id = "form-alert"
    al.innerHTML = s;
    al.className = "alert alert-danger";
    al.style.textAlign = "center";
    document.getElementById('wrapper').appendChild(al);
    return;
}

$(window).on("load",  async () => {

    try {
        users = (await axios.get(`${url}`)).data;           
    } catch (error) {
        console.log(error)
    }

    $('#signin').on("click", async () => {

        var element = document.getElementById('form-alert');
        var u = document.getElementById('username').value;
        var p = document.getElementById('pwd').value;

        if (u === "" || u === null || p === "" || p === null) {
            const s = "campo(s) incompletos";
            if (element) document.getElementById('wrapper').removeChild(element);
            create_alert(null, s);
            return;
        }

        let nombre = users.find( usuario => usuario.username === u);
        if (nombre) {
            const s = "datos incorrectos";
            if (element) document.getElementById('wrapper').removeChild(element);
            create_alert(null, s);
            return;
        }

        try {
            const newUser = {id : create_UUID(), username : u, password : p};
            const { status } =  await axios.post(`${url}`, newUser);
            console.log(status)  
            if(status !== 201) {
                const s = "error, prueba de nuevo";
                if (element) document.getElementById('wrapper').removeChild(element);
                create_alert(null, s);
                return;
            }
            users.push(newUser);
            window.location.href = "login_api.html";
        } catch (error) {
            console.log(error);
        }
    })
})
