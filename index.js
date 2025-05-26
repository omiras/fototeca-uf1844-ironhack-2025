const express = require('express');

const app = express();
const PORT = 3000;

// Nos permite procesar peticiones POST que vengan de un formulario
app.use(express.json());
app.use(express.urlencoded({ extended: true}));

// Oye, si te hacen una petición GET, mira si tienes alguno de los recursos que te piden en el directorio 'public'
app.use(express.static('public'));

// Array de fotos (base de datos actual)
const images = [];


app.get("/", (req, res)=>{
    res.render("home.ejs", {
      images : images
    });
});


app.get("/new-image", (req, res)=>{
  // 1. Teneis que renderizar una vista new-image.ejs donde aparezca un formulario para que el usuario rellene los datos que pide la práctica. 
  // Yo implementaré el título y la URL
  res.render("add-image.ejs", {
    message: undefined // no tengo nada que informar al usuario por el momento
  });

});

// Endpoint para comprobar si una URL ya existe en la fototeca
app.get('/check-url', (req, res) => {
  const url = req.query.url;
  // Comprobar si la URL ya existe en el array de imágenes
  const exists = images.some(img => img.url === url);
  res.json({ exists });
});

// Necesitamos un endpoint donde enviar los datos del formulario. Endpoint donde enviar los datos del formulario
app.post("/new-image", (req, res)=>{
  // Recibir los datos del formulario y actualizar el array "images"
  images.push({
    title: req.body.title,
    description: req.body.description,
    url: req.body.url,
  });

  console.log("Array de imágenes actualizado: ", images);

  res.render("add-image.ejs", {
    message: "La imagen se ha añadido correctamente"
  });
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
