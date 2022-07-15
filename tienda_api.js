const url_producto = 'https://asdfdsad.herokuapp.com/productos';
const url_compra = 'https://asdfdsad.herokuapp.com/compras';
let user_id;
let productos = [];
let compras = [];
let carrito = {
    productos_carrito: [], 
    user_actual:  localStorage.getItem("user_actual")
};

function create_UUID(){
    var dt = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (dt + Math.random()*16)%16 | 0;
        dt = Math.floor(dt/16);
        return (c=='x' ? r :(r&0x3|0x8)).toString(16);
    });
    return uuid;
}

$(window).on("load", async () => {

    try {
        productos = (await axios.get(`${url_producto}`)).data; 
    } catch (error) {
        console.log(error)
    }

    productos.forEach((param) => { 
        $(`#cards-wrapper`).append (
            `<div class="col-lg-4 col-xs-12 resize">
                <div class="card" style="width: 18rem;">
                    <img src=${param.url} class="card-img-top imagen" alt="Croquetas de jamón">
                    
                    <div class="card-body">
                        <h5 class="card-title" id="nombre_prod"><b>${param.title}</b></h5>
                        <h6 class="card-title" id="precio_prod"><b>${param.price}€</b></h6>
                        <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                        <div class="centrar">
                            <input id=${param.id} class="cantidad" type="number" min="0" placeholder="0"/>
                        </div>
                        <br>
                        <div class="resize">
                            <button id="restar_${param.id}" class="btn btn-outline-danger restar" type="button">-</button>
                            <button id="sumar_${param.id}" class="btn btn-outline-success sumar" type="button">+</button>
                            <button id="carrito_${param.id}" class="btn btn-primary carrito" type="button">Añadir al carrito</button>
                        </div>         
                    </div>
                </div>
            </div>` 
        )  
    })

    $( '.restar' ).each(function()  {
        $(this).on("click", () => {

            const inputId = (this.id).split('_')[1];
            let count = document.getElementById(inputId).value;
            if (count <= 0) return;
            count--;
            document.getElementById(inputId).value = count;
        })

    })

    $( '.sumar' ).each(function()  {
        $(this).on("click", () => {

            const inputId = (this.id).split('_')[1];
            let count = document.getElementById(inputId).value;
            count++;
            document.getElementById(inputId).value = count;
        })

    })

    $('.carrito').each(function()  {
        $(this).on("click", () => {
        
            const inputId = (this.id).split('_')[1];
            const count = parseInt(document.getElementById(inputId).value);
            const { url,...found } = productos.find( producto => producto.id === inputId );
            // quito propiedad url del obj productos y todo lo q queda del obj van a found

            if(!found) return;
            const newProduct = {...found, count}; // propiedades de found (menos url q lo quitamos antes) + count

            carrito.productos_carrito.push(newProduct);
    
        })
    })

    $('#purchase').on("click", async () => {

        const total = carrito.productos_carrito.reduce ((acc, producto) => acc + (producto.price * producto.count), 0);
        const compra = {
            ...carrito,
            id : create_UUID(),
            total
        }
        console.log(compra);
        try {
            const { status } =  await axios.post(`${url_compra}`, compra);
            console.log(status)  
            if(status !== 201) {
                const s = "error, prueba de nuevo";
                if (element) document.getElementById('wrapper').removeChild(element);
                create_alert(null, s);
                return;
            }
            compras.push(compra);
        } catch (error) {
            console.log(error);
        }
    })
})
