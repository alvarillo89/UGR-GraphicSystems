/*
    * Esta clase define la creación procedimental de la
    * Hélice, y procesa todos los eventos relacionados con 
    * la misma.
*/

class Helix extends THREE.Object3D {
    
    constructor() {
    
        super();

        // Almacenar la referencia al tiempo para las animaciones:
        this.tBefore = Date.now();

        // Materiales generales de las hélices:
        this.helixMat = new THREE.MeshToonMaterial( {color: 0x4F2445} );
        this.dangerZoneMat = new THREE.MeshToonMaterial( {color: 0xF54C5A} );
        this.collisionSphereMat = new THREE.MeshBasicMaterial({
            color: 0x000000, 
            transparent: true, 
            opacity: 0.0
        });

        // Radio de las hélices:
        this.radius = 7.5;

        // Dificultad de las hélices, cuanto mayor, más zonas de peligro:
        this.difficult = 1;

        // Indica si las hélices pueden moverse o no:
        this.canImove = true;

        // Velocidad de caída:
        this.minVelocity = 40.0;
        this.maxVelocity = 60.0;
        this.velocity = this.minVelocity;

        // Separación entre las hélices:
        this.separation = 13.0;

        // Crear el objeto que contendrá a todas las hélices y las moverá:
        this.parallax = new THREE.Object3D();
        this.parallax.position.y = -5;
        this.add( this.parallax );

        // Crear el cilindro central:
        this.createCentralColumn();

        // Generar la configuración inicial de la hélice:
        this.generateInitialConf();
    }


    // Convierte de grados a radianes:
    deg2Rad( deg ) {
        return (deg / 180) * Math.PI;
    }


    // Esta función crea el cilindro central inmóvil:
    createCentralColumn() {
        var geom = new THREE.CylinderGeometry( 3, 3, 50, 20 );
        this.centralColumMat = new THREE.MeshToonMaterial( {color: 0xFFFFE7} );
        this.centralColum = new THREE.Mesh( geom, this.centralColumMat );
        this.add( this.centralColum );
    }


    // Genera la configuración inicial de la hélice:
    generateInitialConf() {
        // Crear una hélice vacía:
        var helix = new THREE.Object3D();

        // La primera hélice siempre es igual, con un solo hueco y sin
        // zonas de peligro:
        for (var alpha = 45; alpha < 360; alpha += 45) {
            var block = this.generateBlock( this.helixMat, "Safe" );
            block.rotateY( this.deg2Rad( alpha ) );
            helix.add( block );
        }

        this.parallax.add( helix );

        // Las demás si son aleatorias:
        var tmp;
        var lastSpawn = helix.position.y;
        for (var i = 0; i < 3; ++i) {
            tmp = this.generateRandomHelix();
            tmp.position.y = lastSpawn - this.separation;
            lastSpawn = tmp.position.y;
            this.parallax.add( tmp );
        }

        // Guardamos la hélice superior, que será la primera en eliminarse.
        // Cuando sea eliminada, pasará a la siguiente:
        this.topHelix = this.parallax.children[0];

        // Guardamos la hélice más proxima a la pelota, para detectar 
        // las colisiones y actualizar puntuación
        // Inicialmente es la misma que la superior:
        this.nextHelix = this.topHelix;
        this.nextHelixIndex = 1;
    }


    // Genera un bloque: un cilindro parcial de 45 grados.
    // Recibe el material y la etiqueta del bloque:
    generateBlock( material, label ) {
        var size = this.deg2Rad( 45.0 );
    
        var shape = new THREE.Shape();
        shape.lineTo( this.radius, 0 );
        shape.absarc( 0, 0, this.radius, 0, size );
        shape.lineTo( 0, 0 );

        var extrudeOptions = {
            steps: 1,
            depth: 2,
            bevelEnabled: false
        };

        var geometry = new THREE.ExtrudeGeometry( shape, extrudeOptions );
        
        // La posicionamos correctamente, paralela al plano XZ, con el extremo
        // en el origen y centrada en el eje X:
        geometry.applyMatrix( new THREE.Matrix4().makeTranslation( 0, 0, -1 ) );
        geometry.applyMatrix( new THREE.Matrix4().makeRotationZ( -size / 2 ) );
        geometry.applyMatrix( new THREE.Matrix4().makeRotationX( Math.PI / 2 ) );

        var block = new THREE.Mesh( geometry, material );

        // Añadirle la esfera para las colisiones:
        var collisionSphere = new THREE.Mesh( 
            new THREE.SphereGeometry( 1.8 ),
            this.collisionSphereMat
        );

        // Colocarle la etiqueta se utilizará para saber con que tipo de
        // bloque hemos colisionado:
        collisionSphere.name = label;

        collisionSphere.position.set( this.radius / 2 + 1, 0, 0 );
        block.add( collisionSphere );

        return block;
    }


    // Esta función genera una hélice aleatoria:
    generateRandomHelix() {
        // Crear una hélice vacía:
        var helix = new THREE.Object3D();

        /* Creamos la hélice por piezas, añadiendo varios bloques de dos tipos:
        seguros o zonas de peligro. Las restricciones son: 
            * No puede haber más de 4 huecos. 
            * No más de 2 huecos consecutivos.
            * Mínimo un hueco.
        */
        var n_holes = 1;
        var consecutive = 1;

        // Almacenamos los bloques que añadimos. Nos servirá para el siguiente paso:
        var blocks = []

        // Empezamos con los bloques seguros:
        for (var alpha = 45; alpha < 360; alpha += 45) {
            if (Math.random() < 0.3 && n_holes <= 4 && consecutive <= 2) {
                n_holes += 1;
                consecutive += 1;
                blocks.push( null );    // Si es un hueco, almacenamos null
            } else {
                consecutive = 0;
                var block = this.generateBlock( this.helixMat, "Safe" );
                block.rotateY( this.deg2Rad( alpha ) );
                helix.add( block );
                blocks.push( block );
            }
        }

        // Ahora añadimos las zonas de peligro según la dificultad: por esto
        // almacenamos los bloques. Si no es necesario, no creamos uno nuevo,
        // solo cambiamos el material y la etiqueta.
        for (var alpha = 45; alpha < 360; alpha += 45) {
            if (Math.random() < this.difficult / 10.0) {
                // Comprobar si ya había un bloque ahí:
                if ( blocks[alpha/45-1] != null ) {
                    blocks[alpha/45-1].material = this.dangerZoneMat;
                    blocks[alpha/45-1].children[0].name = "Danger";
                } else {
                    var block = this.generateBlock( this.dangerZoneMat, "Danger" );
                    block.rotateY( this.deg2Rad( alpha ) );
                    helix.add( block );
                }                
            }
        }

        // Rotar la hélice una cantidad aleatoria:
        helix.rotateY( Math.random() * 2 * Math.PI );

        return helix;
    }


    // Elimina las hélices que salen de la pantalla y añade nuevas:
    processParallax() {
        // Si le hélice de más arriba ha superado el límite:
        var pos = new THREE.Vector3().setFromMatrixPosition( this.topHelix.matrixWorld );

        if ( pos.y > 15.0 ) {
            // Se elimina esa hélice:
            this.parallax.remove(this.topHelix);
            // Actualizamos el índice de la siguiente hélice:
            this.nextHelixIndex -= 1;
            // La superior pasa a ser la siguiente:
            this.topHelix = this.parallax.children[0];

            // Cuando se borra una hélice, añadimos una nueva:
            var tmp = this.generateRandomHelix();
            tmp.position.y = this.parallax.children[this.parallax.children.length-1].position.y 
                - this.separation;

            this.parallax.add( tmp );
        }
    }


    // Rota la hélice seǵun el movimiento del ratón:
    rotateHelix( mouseDelta ) {
        this.rotation.y += mouseDelta / 150;
    }


    // Actualiza la siguiente hélice que deberá superar la bola:
    updateNextHelix() {
        this.nextHelix = this.parallax.children[this.nextHelixIndex];
        this.nextHelixIndex += 1;
    }


    update() {
        // Almacenar el tiempo ahora:
        var tNow = Date.now();
        // Calcular el deltaTime:
        var deltaTime = (tNow - this.tBefore) / 1000;

        if (this.canImove) {
            // Incrementar la velocidad gradualmente según la aceleración:     
            if ( this.velocity < this.maxVelocity ) {
                this.velocity += 10 * deltaTime;
            }

            // Mover el parallax:
            this.parallax.position.y += this.velocity * deltaTime;
            this.processParallax();
        }

        // Actualizar el tiempo antes:
        this.tBefore = tNow;
    }
}