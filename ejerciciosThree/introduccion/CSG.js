class CSG extends THREE.Object3D
{
    constructor()
    {
        super();
        this.createGUI();

        // El primer paso es crear las geometrías
        var sphere1 = new THREE.SphereGeometry(3, 15, 15);
        var sphere2 = new THREE.SphereGeometry(3, 15, 15);

        // Se posicionan y orientan: ES NECESARIO USAR ESTOS METODOS:
        // translate, rotate<X,Y,Z>() y scale 
        sphere1.translate(1, 0.5, 0.25);

        // Se transforman a objetos ThreeBSP:
        var sphere1bsp = new ThreeBSP(sphere1);
        var sphere2bsp = new ThreeBSP(sphere2);

        // Se aplican las operaciones booleanas:
        var final = sphere2bsp.subtract(sphere1bsp);

        // Convervirlo a mesh:
        var material = new THREE.MeshNormalMaterial();
        this.mesh1 = final.toMesh(material);
        this.mesh1.geometry.computeFaceNormals();
        this.mesh1.geometry.computeVertexNormals();

        this.mesh1.position.set(-10, 0, 10);

        this.add(this.mesh1);

        /****************************************************************************/

        // Ejemplo más complejo:
        // Crear las geometrías:
        var esfera = new THREE.SphereGeometry(4, 15, 15);
        var rect = new THREE.BoxGeometry(5.5, 5.5, 5.5 );
        var cilindro1 = new THREE.CylinderGeometry( 2, 2, 6, 15 );
        var cilindro2 = new THREE.CylinderGeometry( 2, 2, 6, 15 );
        var cilindro3 = new THREE.CylinderGeometry( 2, 2, 6, 15 );

        // Posicionar y orientar:
        cilindro2.rotateZ(Math.PI / 2);
        cilindro3.rotateZ(Math.PI / 2);
        cilindro3.rotateY(Math.PI / 2);

        // Convertir los objetos a ThreeBSP:
        var esferabsp = new ThreeBSP( esfera );
        var rectbsp = new ThreeBSP( rect );
        var cilindro1bsp = new ThreeBSP( cilindro1 );
        var cilindro2bsp = new ThreeBSP( cilindro2 );
        var cilindro3bsp = new ThreeBSP( cilindro3 );

        // Aplicar las operaciones booleanas:
        var part1 = cilindro1bsp.union( cilindro2bsp );
        var part2 = part1.union( cilindro3bsp );
        var part3 = rectbsp.intersect( esferabsp );
        var part4 = part3.subtract( part2 )

        // Convertir a malla:
        this.mesh2 = part4.toMesh(material);
        this.mesh2.geometry.computeFaceNormals();
        this.mesh2.geometry.computeVertexNormals();

        this.mesh2.position.set( 10, 0, -10 );
        this.add( this.mesh2 );

        /****************************************************************************/

        // Último ejemplo: Tuerca:
        esfera = new THREE.SphereGeometry(4, 15, 15);
        var cilTuerca1 = new THREE.CylinderGeometry(2,2,7,20);
        var cilTuerca2 = new THREE.CylinderGeometry(3.9,3.9,3,6)

        // Crear el helicoide:
        var path = [];
        for(var i = 0; i < 60*Math.PI; i+=Math.PI/60)
        {
            path.push(new THREE.Vector3(2*Math.sin(i), 0.02*i, 2*Math.cos(i)));
        }

        var curve = new THREE.CatmullRomCurve3(path);

        // Crear el shape:
        var shape = new THREE.Shape();
        shape.moveTo(-0.05, 0);
        shape.quadraticCurveTo(-0.05, 0.05, 0, 0.05);
        shape.quadraticCurveTo(0.05, 0.05, 0.05, 0);
        shape.quadraticCurveTo(0.05, -0.05, 0, -0.05);
        shape.quadraticCurveTo(-0.05, -0.05, -0.05, 0);


        // Crear las opciones de extrusión:
        var extrudeSettings = {
            bevelEnabled: false,
            steps: 1000,         // Segmentos a lo largo del path
            curveSegments: 10,   // Segmentos para la curva del shape:
            extrudePath: curve
        };
        
        var helicoid = new THREE.ExtrudeGeometry(shape, extrudeSettings);
        helicoid.translate(0,-2,0)
        
        var esfTuerca1bsp = new ThreeBSP( esfera );
        var cilTuerca1bsp = new ThreeBSP( cilTuerca1 );
        var cilTuerca2bsp = new ThreeBSP( cilTuerca2 );
        var helicoidbsp = new ThreeBSP( helicoid )

        part1 = cilTuerca2bsp.intersect(esfTuerca1bsp);
        part2 = part1.subtract(cilTuerca1bsp);
        part3 = part2.subtract(helicoidbsp);

        this.mesh3 = part3.toMesh(material);
        this.mesh3.geometry.computeFaceNormals();
        this.mesh3.geometry.computeVertexNormals();
        this.add(this.mesh3);
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
        if(this.guiControls.animate)
        {
            this.mesh1.rotation.x += 0.01;
            this.mesh1.rotation.y += 0.01;
            this.mesh1.rotation.z += 0.01;
            this.mesh2.rotation.x += 0.01;
            this.mesh2.rotation.y += 0.01;
            this.mesh2.rotation.z += 0.01;
            this.mesh3.rotation.x += 0.01;
            this.mesh3.rotation.y += 0.01;
            this.mesh3.rotation.z += 0.01;
        }
    }
}