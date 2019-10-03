class Revolucion extends THREE.Object3D
{
    constructor()
    {
        super();

        this.createGUI();

        // Crear y dibujar el perfil:
        this.drawPerfil();

        // Crear el material normal:
        this.material = new THREE.MeshNormalMaterial();
        this.material.flatShading = true;
        this.material.side = THREE.DoubleSide;

        // Dibujar el objeto hasta un cierto ángulo:
        this.geometry1 = new THREE.LatheGeometry(this.vertex.vertices, this.guiControls.segmentos, 0, 
            this.guiControls.angulo);
        this.mesh1 = new THREE.Mesh(this.geometry1, this.material);
        this.add(this.mesh1);

        // Dibujar el objeto completo modificando el numero de segmentos:
        this.geometry2 = new THREE.LatheGeometry(this.vertex.vertices, this.guiControls.segmentos);
        this.mesh2 = new THREE.Mesh(this.geometry2, this.material);

        this.axis2 = new THREE.AxesHelper(5)
        this.axis2.add( this.mesh2 )
        this.axis2.position.set(10, 0, -10);
        this.add( this.axis2 );
    }


    drawPerfil()
    {
        // Crear el perfil:
        this.vertex = new THREE.Geometry();
        
        // Anotación: Al crear el perfil, hay que crearlo desde el punto más abajo, hacia arriba:
        this.vertex.vertices.push(new THREE.Vector3(0, 0, 0));
        this.vertex.vertices.push(new THREE.Vector3(1.5, 0, 0));
        this.vertex.vertices.push(new THREE.Vector3(1.5, 0.5, 0));
        this.vertex.vertices.push(new THREE.Vector3(1, 0.5, 0));

        for(var i = 2.5; i > 0; i-=0.3)
        {
            this.vertex.vertices.push(new THREE.Vector3(0.8 * Math.sin(i), 0.8 * Math.cos(i) + 3, 0));
        }

        this.vertex.vertices.push( new THREE.Vector3( 0, 3.8, 0 ) )

        // Dibujar el perfil:       
        var material = new THREE.LineBasicMaterial({ color: 0x0000ff });

        this.line = new THREE.Line( this.vertex, material );

        // Crear los ejes:
        var axis = new THREE.AxesHelper(5);
        axis.add(this.line);
        axis.position.set(-10, 0, 10);
        this.add(axis);
    }

    createGUI()
    {
        this.guiControls = new function()
        {
            this.segmentos = 3;
            this.angulo = Math.PI/2;

            this.reset = function()
            {
                this.segmentos = 3;
                this.angulo = Math.PI/2;
            }
        }

        var folder = gui.addFolder('Control del peón');
        folder.add(this.guiControls, 'segmentos', 3, 20, 1).name ('Número segmentos : ').listen();
        folder.add(this.guiControls, 'angulo', Math.PI/2, 2*Math.PI, Math.PI/18.0).name ('Ángulo : ').listen();
        folder.add(this.guiControls, 'reset').name ('[ Reset ]');
    }

    update()
    {
        // Actualizar la malla1:
        this.remove(this.mesh1);
        this.mesh1.geometry = new THREE.LatheGeometry(this.vertex.vertices, this.guiControls.segmentos, 0, 
            this.guiControls.angulo);
        this.add(this.mesh1);

        // Actualizar la malla2:
        this.axis2.remove(this.mesh2);
        this.mesh2.geometry = new THREE.LatheGeometry(this.vertex.vertices, this.guiControls.segmentos);
        this.axis2.add(this.mesh2);
    }
}