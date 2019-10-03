class Reloj extends THREE.Object3D
{
    constructor()
    {
        super();
        this.createGUI();

        this.tiempoAntes = Date.now();
        var radioReloj = 10;

        // Crear los materiales:
        var matVerde = new THREE.MeshPhongMaterial({color: 0x00ff00});
        var matRojo = new THREE.MeshPhongMaterial({color: 0xff0000});

        // Creamos los ticks del reloj:
        for(var i = 0.0; i < 2*Math.PI; i+= 2*Math.PI / 12)
        {
            var mesh = new THREE.Mesh(new THREE.SphereGeometry(), matVerde);
            mesh.position.set(radioReloj * Math.cos(i), 0, radioReloj * Math.sin(i));
            this.add(mesh);
        }

        // Creamos la esfera roja:
        var geometry = new THREE.SphereGeometry();
        this.aguja = new THREE.Mesh(geometry, matRojo);
        this.aguja.position.x += radioReloj - 2;
        
        // Nodo intermedio para que la translación se haga antes que la rotación:
        this.intermediate = new THREE.Object3D();
        this.intermediate.add(this.aguja)
        this.add(this.intermediate);
    }


    createGUI()
    {
        this.guiControls = new function()
        {
            this.velocity = 1;
        }

        var folder = gui.addFolder('Animación');
        folder.add(this.guiControls, 'velocity', -12, 12, 1).name ('Rads/s : ').listen();
    }

    update()
    {   
        var actual = Date.now();
        this.intermediate.rotation.y += this.guiControls.velocity * ((actual - this.tiempoAntes) / 1000);
        this.tiempoAntes = actual;
    }
}