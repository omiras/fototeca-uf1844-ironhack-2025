const express = require('express');

const app = express();
const PORT = 3000;

// Nos permite procesar peticiones POST que vengan de un formulario
app.use(express.json());
app.use(express.urlencoded({ extended: true}));

// Oye, si te hacen una petición GET, mira si tienes alguno de los recursos que te piden en el directorio 'public'
app.use(express.static('public'));

app.get("/", (req, res)=>{
    res.send("funciona");
});


// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
