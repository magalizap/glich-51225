const socket = io()

const botonChat = document.getElementById('botonChat')
const parrafosMensajes = document.getElementById('parrafosMensajes')
const val = document.getElementById('chatBox')

let user

swal.fire({
    title: 'Ingresa al foro',
    text: 'Por favor ingrese su nombre de usuario',
    input: 'text',
    inputValidator: (valor) => {
        return !valor && 'Ingrese un valor valido'
    },
    allowOutsideClick: false
}).then(resultado => {
    user = resultado.value
    console.log(user)
})

botonChat.addEventListener('click', () => {
    if(val.value.trim().length > 0){// consultar si el input no está vacio
        socket.emit('mensaje', {usuario: user, mensaje: val.value})
        val.value = '' // seteo el valor del input
    } 
})

socket.on('mensajes', arrayMensajes => {
    parrafosMensajes.innerHTML = '' //para evitar duplicados
    arrayMensajes.forEach(mensaje => {
        parrafosMensajes.innerHTML += `
        <p class="coment">${mensaje.usuario}: ${mensaje.mensaje}</p>
        `
    })
})