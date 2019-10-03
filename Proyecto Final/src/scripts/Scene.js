/* 
    * Esta clase es una clase fachada de la clase THREE.Scene.
    * Crea el grafo de escena de la aplicación.
*/

class Scene extends THREE.Scene {

    constructor() {
        
        super();

        // Añadir el contador de fps:
        this.addFPSCounter();

        // Añadir las cámaras:
        this.addCameras();

        // Añadir las luces:
        this.addLights();

        // Añadir elementos a la escena:
        this.addSceneElements();
    }


    // Añade los elementos a la escena:
    addSceneElements() {
        // Crear la hélice:
        this.helix = new Helix();

        // Crear la bola:
        this.ball = new Ball( this.helix );

        // Añadir todos los objetos a la escena:
        this.add( this.helix );
        this.add( this.ball );
    }


    // Crea las luces:
    addLights() {
        this.directionalLight = new THREE.DirectionalLight( 0xffffff, 1.0 );
        this.directionalLight.position.set( 0, 15, 20 );
        this.add( this.directionalLight );
    }


    // Puesto que es un juego, añadimos el contador de FPS:
    addFPSCounter() {
        this.stats = new Stats();
        this.stats.showPanel( 0 );
        document.body.appendChild( this.stats.dom );
    }


    // Esta función añade las cámaras a la escena:
    addCameras() {
        // Crear una cámara en perspectiva, indicando su posición y a dónde mira:
        this.camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.1, 1000 );
        this.camera.position.set( 20, 15, 20 );
        var look = new THREE.Vector3( 0, 0, 0 );
        this.camera.lookAt( look );

        // La añadimos a la escena:
        this.add( this.camera );
    }


    // Actualiza el aspect ratio de la cámara:
    setCameraAspectRatio( ratio ) {
        this.camera.aspect = ratio;
        this.camera.updateProjectionMatrix();
    }


    // Actualiza los distintos objetos de la escena:
    update() {
        this.stats.begin();

        // Si ha terminado el juego dejo de actualizar la escena:
        if(gameover) {
            // Mostrar el mensaje de GameOver:
            document.getElementById("GameOver").innerHTML = "<h1 class=\"gameover\">" 
                        + "HAS PERDIDO, PULSA ESPACIO PARA EMPEZAR DE NUEVO" + "<\h1>";
            
            // Eliminar los listener del ratón (para no seguir procesándolos)
            window.removeEventListener("mousedown", onMouseDown);
            window.removeEventListener("mouseup", onMouseUp);
            window.removeEventListener("mousemove", onMouseMove);
        } else {
            // Si no es el GameOver, actualizo la hélice y la bola:
            this.helix.update();
            this.ball.update();
        }

        this.stats.end();
    }
}