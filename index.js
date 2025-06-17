const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');


const app = express();
const PORT = 3000;

// Nos permite procesar peticiones POST que vengan de un formulario
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Oye, si te hacen una petición GET, mira si tienes alguno de los recursos que te piden en el directorio 'public'
app.use(express.static('public'));

// Usamos el middleware morgan para registrar todas las peticiones que vienen del cliente
app.use(morgan("dev"));

// Modelo Image
let Image;

async function start() {
  await mongoose.connect('mongodb+srv://oscar:oscar@cluster0.c8tq0vp.mongodb.net/ironhackDB-2025');
  // Iniciar el servidor

  const imageSchema = new mongoose.Schema({
    title: {
      type: String,
      maxlength: 15,
      required: true
    },
    url: {
      type: String,
      required: true,
      match: /^(https?:\/\/)[^\s$.?#].[^\s]*$/i
    },
    date: {
      type: Date,
      required: true
    },
    dominantColor: String
  })

  Image = mongoose.model('Images', imageSchema);


  app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
  });

}

app.get("/", async (req, res) => {

  // Recuperar todas las imágenes del a base de datos
  const images = await Image.find();

  res.render("home.ejs", {
    images: images
  });
});


app.get("/new-image", (req, res) => {
  // 1. Teneis que renderizar una vista new-image.ejs donde aparezca un formulario para que el usuario rellene los datos que pide la práctica. 
  // Yo implementaré el título y la URL
  res.render("add-image.ejs", {
    message: undefined // no tengo nada que informar al usuario por el momento
  });

});

// Necesitamos un endpoint donde enviar los datos del formulario. Endpoint donde enviar los datos del formulario
app.post("/new-image", async (req, res) => {
  // Recibir los datos del formulario y actualizar el array "images"
  // Para comprobar que lo has hecho bien muestra por consola el contenido del array images después de actualizarlo
  //  Disponemos de un objeto en req.body donde tendremos todos los valores
  // de la petición POST (lo que nos viene del formulario)

  // Usar el módul de terceros get-dominant-color para obtener el color (o colores) predominantes de la imagen y lo guardas en una variable

  let dominantColor;
  // dominantColor = get-dominant-color(req.body.url)
  const newDocument = new Image({
    title: req.body.title,
    url: req.body.url,
    date: new Date()
  });
  try {
    await newDocument.save();
  } catch (err) {
    // Fallar gracilmente
    // Informar a los desarrolladores que algo ha ido mal
    console.log(err.message);

    return res.render("add-image.ejs", {
      message: "No hemos podido insertar su imagen en este momento...pruebe con otra URL"
    })
  }
  res.render("add-image.ejs", {
    message: "La imagen se ha añadido correctamente"
  });
});



// Middleware para manejar rutas no encontradas (404)
app.use((req, res) => {
  res.status(404).render('404.ejs');
});

start().catch(err => console.log(err));


