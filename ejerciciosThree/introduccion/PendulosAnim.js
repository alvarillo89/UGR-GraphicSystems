class PendulosAnim extends THREE.Object3D
{
    constructor()
    {
        super();
        this.createGUI();

        // Guardar la referencia al tiempo:
        this.tiempoAntes = Date.now();

        // Sentido del movimiento (para el ping pong):
        this.sentido = 1;
        this.sentido2 = 1; // Para el otro péndulo.

        // Creación de los materiales:
        var matRojo  = new THREE.MeshPhongMaterial( { color: 0xff0000 } );
        var matAzul  = new THREE.MeshPhongMaterial( { color: 0x0000ff } );
        var matVerde = new THREE.MeshPhongMaterial( { color: 0x00ff00 } );
        var matYell  = new THREE.MeshPhongMaterial( { color: 0xFFB705 } );
        
        /////////////////////////////////////////////////////////////////////////////

        // Pivote:
        var geometry = new THREE.CylinderGeometry(1, 1, 5, 10);
        this.pivote1 = new THREE.Mesh(geometry, matYell);
        geometry = new THREE.CylinderGeometry(0.5, 0.5, 3, 10);
        this.pivote2 = new THREE.Mesh(geometry, matYell);
        this.pivote1.rotateX(Math.PI/2);
        this.pivote2.rotateX(Math.PI/2);

        /////////////////////////////////////////////////////////////////////////////

        // Parte Verde superior:
        geometry = new THREE.BoxGeometry(4,4,4);
        this.verdeSup = new THREE.Mesh(geometry, matVerde);

        /////////////////////////////////////////////////////////////////////////////

        // Parte roja:
        geometry = new THREE.BoxGeometry(4, 1, 4);
        // Modificar su origen de coordenadas:
        geometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, -0.5,0));
        this.parteRoja = new THREE.Mesh(geometry, matRojo);

        /////////////////////////////////////////////////////////////////////////////

        // Parte verde inferior:
        geometry = new THREE.BoxGeometry(4,4,4);
        geometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, -2,0));
        this.verdeInf = new THREE.Mesh(geometry, matVerde);

        /////////////////////////////////////////////////////////////////////////////

        // Nodo intermedio: parte verde inferior + parteRoja:
        this.rojoVerdeInf = new THREE.Object3D();
        this.rojoVerdeInf.add(this.parteRoja);
        this.rojoVerdeInf.add(this.verdeInf);
        // Aplicar la translación:
        this.rojoVerdeInf.position.y = -2;
        this.add(this.rojoVerdeInf);
    
        /////////////////////////////////////////////////////////////////////////////

        // Nodo Intermedio: Péndulo 1:
        this.pendulo1 = new THREE.Object3D();
        this.pendulo1.add(this.rojoVerdeInf);
        this.pendulo1.add(this.verdeSup);
        this.pendulo1.add(this.pivote1);

        /////////////////////////////////////////////////////////////////////////////

        // Parte azul del péndulo 2:
        geometry = new THREE.BoxGeometry(2, 1, 2);
        geometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, -0.5,0));
        this.parteAzul = new THREE.Mesh(geometry, matAzul);
        this.parteAzul.position.y += 1;
        
        /////////////////////////////////////////////////////////////////////////////

        // Péndulo 2:
        this.pendulo2 = new THREE.Object3D();
        this.pendulo2.add(this.parteAzul);
        this.pendulo2.add(this.pivote2);

        /////////////////////////////////////////////////////////////////////////////

        // Nodo intermedio: Transformaciones péndulo azul:
        this.transformPendAzul = new THREE.Object3D();
        this.transformPendAzul.add(this.pendulo2);
        this.transformPendAzul.position.z += 3;

        /////////////////////////////////////////////////////////////////////////////

        // Modelo Final:
        this.modeloFinal = new THREE.Object3D();
        this.modeloFinal.add(this.pendulo1);
        this.modeloFinal.add(this.transformPendAzul);

        // Añadir el modelo final:
        this.add(this.modeloFinal);
    }


    createGUI()
    {
        this.guiControls = new function()
        {
            this.a = 5.0;
            this.b = 0.0;
            this.c = 10.0;
            this.d = 0.0;
            this.e = 0.1;
            this.animPen1 = false;
            this.velPen1 = 0.0;
            this.velPen2 = 0.0;
            this.animPen2 = false;
        }

        var folder = gui.addFolder('Primer Péndulo');
        folder.add(this.guiControls, 'a', 5.0, 10.0).name ('Longitud : ').listen();
        //folder.add(this.guiControls, 'b', -Math.PI/4, Math.PI/4).name('Giro : ').listen();

        var folder2 = gui.addFolder('Segundo Péndulo');
        folder2.add(this.guiControls, 'c', 10.0, 20.0).name ('Longitud : ').listen();
        folder2.add(this.guiControls, 'e', 0.1, 0.9).name('Posición (%) : ').listen();
        //folder2.add(this.guiControls, 'd', -Math.PI/4, Math.PI/4).name('Giro : ').listen();

        var folder3 = gui.addFolder('Animaciones');
        folder3.add(this.guiControls, 'animPen1').name('Péndulo 1 : ').listen();
        folder3.add(this.guiControls, 'velPen1', 0.0, 12).name('Velocidad (rad/s) : ').listen();
        folder3.add(this.guiControls, 'animPen2').name('Péndulo 2 : ').listen();
        folder3.add(this.guiControls, 'velPen2', 0, 12).name('Velocidad (rad/s) : ').listen();
    }

    update()
    {
        this.parteRoja.scale.set(1.0, this.guiControls.a, 1.0);
        this.verdeInf.position.y = -this.guiControls.a;
        this.parteAzul.scale.set(1.0, this.guiControls.c, 1.0);
        //this.transformPendAzul.rotation.z = this.guiControls.d;
        this.transformPendAzul.position.y = -2 - (this.guiControls.a * this.guiControls.e);
        //this.modeloFinal.rotation.z = this.guiControls.b;

        var actual = Date.now();

        // Animación péndulo 1:
        if(this.guiControls.animPen1)
        {   
            this.modeloFinal.rotation.z += this.guiControls.velPen1 
                * ((actual - this.tiempoAntes) / 1000) 
                * this.sentido;

            if(this.modeloFinal.rotation.z >= Math.PI / 2)
            {
                this.sentido = -1;
            }
            else if(this.modeloFinal.rotation.z <= -Math.PI / 2)
            {
                this.sentido = 1;
            }
        }

        // Animación péndulo 2:
        if(this.guiControls.animPen2)
        {   
            this.transformPendAzul.rotation.z += this.guiControls.velPen2 
                * ((actual - this.tiempoAntes) / 1000) 
                * this.sentido2;

            if(this.transformPendAzul.rotation.z >= Math.PI / 2)
            {
                this.sentido2 = -1;
            }
            else if(this.transformPendAzul.rotation.z <= -Math.PI / 2)
            {
                this.sentido2 = 1;
            }
        }

        this.tiempoAntes = actual;

    }
}