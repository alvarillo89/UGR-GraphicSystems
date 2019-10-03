/* 
    * Contiene todo el comportamiendo asociado a la bola:
    * rebote, colisiones...
*/

class Ball extends THREE.Object3D {

    // Recibe una referencia a la hélice:
    constructor( myHelix ) {

        super();

        // Almacena si está realizando o no la animación de rebote:
        this.bouncing = false;

        // Puntuación del jugador:
        this.puntuation = 0;

        // Para formatear la puntuación:
        this.formatter = new Intl.NumberFormat("es-ES", {minimumIntegerDigits: 6});

        // Guardar la referencia a la hélice:
        this.myHelix = myHelix;

        // Radio y material de la bola:
        this.radius = 1.0;
        this.ballMat = new THREE.MeshToonMaterial( {color: 0xC832A2} );

        // Cargar los sonidos de la bola:
        this.splashSound = new Audio( "../sounds/Splash.wav" );
        this.helixPassSound = new Audio( "../sounds/HelixPass.wav" );
        this.dangerZoneSound = new Audio( "../sounds/DangerZone.wav" );

        // Crear la bola:
        this.createBall();

        // Crear la animación:
        this.createAnimation();

        // Crear los emisores de partículas:
        this.createEmitters();

        // Hacemos que aparezca la puntuación por primera vez:
        this.setPuntiation();
    }


    // Crea la bola:
    createBall() {
        var geometry = new THREE.SphereGeometry( this.radius, 20, 20 );
        this.ball = new THREE.Mesh( geometry, this.ballMat );
        this.position.x += 3.2;
        this.position.z += 3.2;

        this.add( this.ball );

        // Calcular la posición global de la bola:
        this.updateMatrixWorld();
        this.worldPosition = new THREE.Vector3().setFromMatrixPosition( this.ball.matrixWorld );
    }


    // Crea los emisores de partículas:
    createEmitters() {

        // Creamos la partícula que va a emitir al chocar con una hélice:
        var splashParticle = new THREE.Mesh(
            new THREE.SphereGeometry(0.3),
            this.ballMat
        );

        // Creamos el emisor:
        this.splashEmitter = new Proton.Emitter();
        // Ratio de emisión: cuantas partículas emitir y en cuanto tiempo: (partículas / s)
        this.splashEmitter.rate = new Proton.Rate( 5, 0.01);
        // La vida de las partículas (cuanto duran antes de desaparecer):
        this.splashEmitter.addInitialize(new Proton.Life(0.3));
        // La partícula:
        this.splashEmitter.addInitialize(new Proton.Body(splashParticle));
        // Velocidad y dirección con la que salen:
        this.splashEmitter.addInitialize(new Proton.Velocity(10, new Proton.Vector3D(0, 1, 0), 500));
        // Ajustamos la posición:
        this.splashEmitter.p.x = 3.2;
        this.splashEmitter.p.z = 3.2;

        // Creamos la partícula que emitirá la bola mientras cae:
        var trailParticle = new THREE.Mesh(
            new THREE.BoxGeometry(0.2, 0.2, 0.2),
            new THREE.MeshToonMaterial({
                transparent: true, 
                opacity: 0.5
            })
        );

        this.trail = new Proton.Emitter();
        this.trail.rate = new Proton.Rate(10, 0.03);
        this.trail.addInitialize(new Proton.Life(1));
        this.trail.addInitialize(new Proton.Body(trailParticle));
        this.trail.addInitialize(new Proton.Velocity(10, new Proton.Vector3D(0, 1, 0), 5));
        // La particula tendrá un color al principio y otro al final:
        this.trail.addBehaviour(new Proton.Color('#C832A2', '#2EEEFF'));
        // Rota aleatoriamente la partícula:
        this.trail.addBehaviour(new Proton.Rotate("random", "random"));
        this.trail.p.x = 3.2;
        this.trail.p.z = 3.2;

        // Esta variable nos permitirá saber cuando está emitiendo o no:
        this.trailEmitting = false;
    }


    // Crea la animación del bote de la bola:
    createAnimation() {
        var that = this;

        this.bounce = new TWEEN.Tween( { p: 0 } )
            .to( { p: 8 }, 400 )
            .easing( TWEEN.Easing.Quadratic.InOut )
            .onStart( function() {
                that.bouncing = true;
            })
            .onComplete( function() {
                this.p = 0;
            })
            .onUpdate( function() {
                that.ball.position.y = this.p;
            });

    
        var bounceEnd = new TWEEN.Tween( { p: 8} )
            .to( { p: 0 }, 400 )
            .easing( TWEEN.Easing.Quadratic.InOut )
            .onComplete( function() {
                that.bouncing = false;
                this.p = 8;
            })
            .onUpdate( function() {
                that.ball.position.y = this.p;
            });

        this.bounce.chain( bounceEnd );
    }


    // Actualizar y procesar la puntuación del jugador:
    setPuntiation() {
        var msg = "Puntuación: " + this.formatter.format( this.puntuation );
        msg = msg.replace( ".", "" )
        document.getElementById( "Puntuation" ).innerHTML = "<h1>" + msg + "<\h1>";
        
        // Actualizamos la dificultad del juego en función de la puntuación:
        this.myHelix.difficult = Math.floor(this.puntuation / 100) + 1;

        // La dificultad máxima es 5:
        if( this.myHelix.difficult > 5 ) {
            this.myHelix.difficult = 5;
        }
    }


    // Comprueba si ha superado la siguiente hélice y avisa a myHelix:
    checkHelixExceeded() {
        var nextPos = new THREE.Vector3().setFromMatrixPosition( this.myHelix.nextHelix.matrixWorld );

        if( nextPos.y > this.worldPosition.y ) {
            this.myHelix.updateNextHelix();
            this.helixPassSound.play();
            // Actualizar la puntuación del jugador:
            // La puntuación recibida depende de la velocidad a la que te mueves:
            this.puntuation += Math.floor( this.myHelix.velocity / this.myHelix.maxVelocity * 10 );
            this.setPuntiation();
        }
    }


    // Detectar las colisiones:
    detectCollision() {
        // Recorremos los bloques de la hélice más cercana:
        for (var i = 0; i < this.myHelix.nextHelix.children.length; ++i) {
            // Obtener la esfera de colisión:
            var sphereCollision = this.myHelix.nextHelix.children[i].children[0];
            // Calculamos el centro en coordenadas globales y el radio de la esfera de colisión:
            sphereCollision.parent.updateMatrixWorld();
            var centre = new THREE.Vector3().setFromMatrixPosition( sphereCollision.matrixWorld );
            var radius = 1.8;
    
            // Hacemos el test de instersección esfera-esfera:
            if (this.worldPosition.distanceToSquared( centre ) <= Math.pow( radius + this.radius, 2 )) {
                // GameOver:
                if (sphereCollision.name == "Danger") {
                    this.dangerZoneSound.play();
                    gameover = true;
                } else { 
                    this.splashSound.play();
                    // Emitimos partículas durante 0.2 segundos:
                    this.splashEmitter.emit(0.2);
                }

                return true;
            } 
        }

        return false;
    }


    update() {
        // Comprobamos si ha superado la hélice:
        this.checkHelixExceeded();
        
        // Comprobamos las colisiones si no está rebotando:
        if (!this.bouncing) {
            if (this.detectCollision()) {
                this.myHelix.velocity = this.myHelix.minVelocity;
                this.myHelix.canImove = false;
                this.bounce.start();
                this.trailEmitting = false;
                this.trail.stopEmit();
            } else {
                this.myHelix.canImove = true;
                // Iniciamos la emisión de la cola si no está iniciada:
                if (!this.trailEmitting){
                    this.trail.emit();
                    this.trailEmitting = true;
                }
            }
        }

        // Actualizar Tween:
        TWEEN.update();
    }
}