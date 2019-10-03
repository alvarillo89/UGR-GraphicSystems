/*
    * Script que contiene el main de la aplicación.
    * También crear el render, la escena, se encarga de renderizar 
    * y actualiza el tamaño de la ventana.
*/

// Variables globales:
scene = null;
renderer = null;

// Variables relacionadas con la detección de eventos del ratón:
mouseDown = false;
mouseX = 0;

// Almacena si ha sido el fin del juego o no:
gameover = false;

// Referencia al motor del sistema de particulas:
proton = null;


// Crea el renderer de WebGL:
function createRenderer() {
    var renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});
    var backgroundColor = new THREE.Color( 0x000000 );

    renderer.setClearColor( backgroundColor, 0.0 );
    renderer.setSize( window.innerWidth, window.innerHeight );
  
    return renderer; 
}


// Inicializa el motor del sistema de partículas:
function initProton() {
    proton = new Proton();

    // Añadirle los emisores creados en la escena:
    proton.addEmitter( scene.ball.splashEmitter );
    proton.addEmitter( scene.ball.trail );

    // Añadir el render:
    proton.addRender( new Proton.MeshRender(scene) );
}


// Renderiza la escena:
function render() {
    requestAnimationFrame( render );
    // Actualizar la escena y el sistema de partículas:
    proton.update(); 
    scene.update();
    renderer.render( scene, scene.camera );
}


// Cuando la ventana cambia su tamaño, se actualiza el ratio de la cámara:
function onWindowResize() {
    scene.setCameraAspectRatio( window.innerWidth / window.innerHeight );
    renderer.setSize( window.innerWidth, window.innerHeight );
}


// Funciones relacionadas con los eventos del ratón:
function onMouseDown( event ) {
    mouseDown = true;
    mouseX = event.clientX;
}


function onMouseUp( event ) {
    mouseDown = false;
}


function onMouseMove( event ) {
    if (!mouseDown) {
        return;
    }

    // Calcular la variación:
    var deltaX = event.clientX - mouseX;
    mouseX = event.clientX;

    // Rotar la hélice:
    scene.helix.rotateHelix( deltaX );
}


// Funciones relacionadas con los eventos de teclado:
function onKeyPressed( event ) {
    // 32 es el keycode del espacio:
    if ( gameover && event.keyCode == 32 ) {
        // Recargar la página para empezar de nuevo:
        document.location.reload( true );
    }
}


// Main:
$(function() {
    // Se crea el renderer
    renderer = createRenderer();
  
    // La salida del renderer se muestra en un DIV de la página index.html
    $( "#WebGL-output" ).append( renderer.domElement );
  
    // Linkar los listener:
    window.addEventListener( "resize", onWindowResize );
    window.addEventListener( "mousemove", onMouseMove );
    window.addEventListener( "mousedown", onMouseDown );
    window.addEventListener( "mouseup", onMouseUp );
    window.addEventListener( "keypress", onKeyPressed );
  
    // Crear la escena:
    scene = new Scene();

    // Inicializar el sistema de partículas:
    initProton();

    // Realizar el primer renderizado.
    render();
});

