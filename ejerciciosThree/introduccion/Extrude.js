class Extrude extends THREE.Object3D
{
    constructor()
    {
        super();

        this.createGUI();

        // Crear la forma (shape)
        this.romboShape = new THREE.Shape();

        // Movimiento sin dibujar hasta la posición (x,y):
        this.romboShape.moveTo(0, -3);
        // Línea hasta la posición (x,y)
        this.romboShape.lineTo(2.1,0);
        this.romboShape.lineTo(0,3);
        this.romboShape.lineTo(-2.1, 0);
        this.romboShape.lineTo(0,-3);

        // Crear las opciones de extrusión:
        var extrudeSettings1 = {
            steps: 20,  // Número de segmentos de la parte extruída
            depth: 0.1, // Tamaño de la parte extruída
            bevelEnabled: true, // Activar o no bisel
            bevelThickness: 0.2, // Qué tan profundo en la forma original va el bisel
            bevelSize: 0.2, // Tamaño del bisel
            bevelSegments: 20 // Segmentos del bisel
        };

        // Crear los materiales:
        var mat_rojo = new THREE.MeshPhongMaterial( { color: 0xff0000 } );
        var mat_azul = new THREE.MeshPhongMaterial( { color: 0x0000ff } );
        var mat_verde = new THREE.MeshPhongMaterial( { color: 0x00ff00 } );

        // Crear la geometría:
        var geometry = new THREE.ExtrudeGeometry( this.romboShape, extrudeSettings1 );

        // Crear el nodo vacío que girará los 4 rombos:
        this.girador = new THREE.Object3D();

        // Los nodos vacíos que corregirán la rotación en z de los rombos:
        this.corrector1 = new THREE.Object3D();
        this.corrector2 = new THREE.Object3D();
        this.corrector3 = new THREE.Object3D();
        this.corrector4 = new THREE.Object3D();

        // Crear las 4 mallas de los rombos:
        this.rombo1 = new THREE.Mesh( geometry, mat_rojo );
        this.corrector1.add( this.rombo1 );
        this.corrector1.position.set(0, 6, 0);
        this.girador.add(this.corrector1);

        this.rombo2 = new THREE.Mesh( geometry, mat_rojo );
        this.corrector2.add( this.rombo2 );
        this.corrector2.position.set(0, -6, 0);
        this.girador.add(this.corrector2);

        this.rombo3 = new THREE.Mesh( geometry, mat_azul );
        this.corrector3.add( this.rombo3 );
        this.corrector3.position.set(-6, 0, 0);
        this.girador.add(this.corrector3);

        this.rombo4 = new THREE.Mesh( geometry, mat_azul );
        this.corrector4.add( this.rombo4 );
        this.corrector4.position.set(6, 0, 0);
        this.girador.add(this.corrector4);

        this.add(this.girador);

        // Crear los dos pilares:
        var curve = new THREE.CatmullRomCurve3( [
            new THREE.Vector3( -3, -5, 5),
            new THREE.Vector3( -2, -2, 3 ),
            new THREE.Vector3( 0, 0, 0 ),
            new THREE.Vector3( 2, 2, -3 ),
            new THREE.Vector3( 3, 5, -5 )
        ] );
        
         // Crear las opciones de extrusión:
         var extrudeSettings2 = {
            bevelEnabled: false,
            steps: 50,
            curveSegments: 4,   // Segmentos para las curvas (necesario para que se vea curvado)
            extrudePath: curve
        };

        // Crear la geometría:
        var geometry2 = new THREE.ExtrudeGeometry( this.romboShape, extrudeSettings2 );

        // Crear las dos mallas:
        this.pilar1 = new THREE.Mesh( geometry2, mat_verde );
        this.pilar2 = new THREE.Mesh( geometry2, mat_verde );
        
        this.add(this.pilar1);
        this.add(this.pilar2);

        // Cambiar sus posiciones:
        this.pilar1.position.set(-15, 0, 0);
        this.pilar2.position.set(15, 0, 0);

    }

    createGUI()
    {
        this.guiControls = new function()
        {
            this.animate = false;
        }

        var folder = gui.addFolder('Animación');
        folder.add(this.guiControls, 'animate').name ('Animar escena : ').listen();
    }

    update()
    {   
        // Hacer que roten todos los rombos:
        if(this.guiControls.animate)
        {
            this.girador.rotation.z += 0.01;

            // Cada corrector gira en sentido contrario para que se mantengan rectos:
            
            this.corrector1.rotation.z -= 0.01;
            this.corrector2.rotation.z -= 0.01;
            this.corrector3.rotation.z -= 0.01;
            this.corrector4.rotation.z -= 0.01;

            // Cada rombo gira en la Y:
            this.rombo1.rotation.y += 0.01;
            this.rombo2.rotation.y += 0.01;
            this.rombo3.rotation.y += 0.01;
            this.rombo4.rotation.y += 0.01;
    
            // Rotar los pilares:
            this.pilar1.rotation.x += 0.01;
            this.pilar2.rotation.x -= 0.01;
        }
    }
}