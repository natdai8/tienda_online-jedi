let user_name = "";
let passwd = "";
let users = [];
const url = 'https://asdfdsad.herokuapp.com/usuarios';

function create_alert(element, s){
    if (element) return;
    al = document.createElement('div'); 
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

    $('#login').on("click", () => {

        var element = document.getElementById('form-alert');
        var u = document.getElementById('username').value;
        var p = document.getElementById('pwd').value;

        if (u === "" || u === null || p === "" || p === null) {
            const s = "campo(s) incompletos";
            if (element) document.getElementById('wrapper').removeChild(element);
            create_alert(null, s);
            return;
        }

        let found = users.find( usuario => (usuario.username === u) && (usuario.password === p));
        if (found)  {
            localStorage.setItem("user_actual", found.id);
            window.location.href = "home_api.html";
            return;
        }
        if (!found){
            const s = "datos incorrectos";
            if (element) document.getElementById('wrapper').removeChild(element);
            create_alert(null, s);
            return;
        }
        
    });

})

