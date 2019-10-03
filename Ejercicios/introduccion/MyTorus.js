class MyTorus extends THREE.Object3D 
{
    constructor() 
    {
        super();
    
        // Se crea la parte de la interfaz que corresponde a la caja
        // Se crea primero porque otros métodos usan las variables que se definen para la interfaz
        this.createGUI();
        
        // Ahora vamos a crear la malla, para crearla necesitamos una geometría y un material:
        this.geometry = new THREE.TorusGeometry(1, 0.2, 20, 20);
        this.material = new THREE.MeshNormalMaterial();
        this.material.flatShading = true;

        // Crear la malla:
        this.mesh = new THREE.Mesh(this.geometry, this.material);

        // Crear unos ejes locales para el objeto:
        this.localAxis = new THREE.AxesHelper(3);
        
        // Añadimos la malla como hija de los ejes:
        this.localAxis.add(this.mesh);
        
        // Cambiamos la posición de los ejes (y en consecuencia del objeto hijo):
        this.localAxis.position.set(10, 0, -10);
        
        // this es el nodo raíz de tipo Object3D, con esto le añadimos el árbol creado 
        // (eje + malla).
        this.add(this.localAxis); 
    }
  
    createGUI() 
    {
        // Anotación: Aquí en lugar de escala rotación y posición controlarémos la geometría
        // del objeto:
        this.guiControls = new function() 
        {
            this.radioGlobal = 1.0;
            this.radioTubo = 0.2;
            this.radialSegments = 20;
            this.tubularSegments = 20;

            this.reset = function()
            {
                this.radioGlobal = 1.0;
                this.radioTubo = 0.2;
                this.radialSegments = 20;
                this.tubularSegments = 20; 
            }
        }

        var folder = gui.addFolder('Dimensiones del Toro');
        folder.add(this.guiControls, 'radioGlobal', 1.0, 5.0, 0.1).name ('Radio Global : ').listen();
        folder.add(this.guiControls, 'radioTubo', 0.2, 5.0, 0.1).name ('Radio Tubo : ').listen();
        folder.add(this.guiControls, 'radialSegments', 3, 20, 1).name ('Segmentos Radiales : ').listen();
        folder.add(this.guiControls, 'tubularSegments', 3, 20, 1).name ('Segmentos Tubulares : ').listen();
        folder.add(this.guiControls, 'reset').name ('[ Reset ]');
    }
  
    update() 
    {

        // Modificar la geometría de la mesh original implica los siguientes pasos:
        // Sacamos la malla de la escena
        this.localAxis.remove(this.mesh);

        // Modificamos su geometría:
        this.mesh.geometry = new THREE.TorusGeometry
        (
            this.guiControls.radioGlobal, 
            this.guiControls.radioTubo,
            this.guiControls.radialSegments, 
            this.guiControls.tubularSegments
        );

        // Volvemos a añadirla a la malla:
        this.localAxis.add(this.mesh);

        // Esto para que rote solo:
        this.mesh.rotation.x += 0.01;
        this.mesh.rotation.y += 0.01;
        this.mesh.rotation.z += 0.01;

        /* Anotación:
        Modificar la geometría de un objeto tiene como inconveniente que estamos dejando huérfano el objeto
        de tipo geometría que tenía anteriormente (ya que le estamos asignando uno nuevo). Esto hace que 
        se llame al recolector de basura para eliminarlo. Si estas llamadas son frecuentes, pueden afectar
        a la eficiencia.
        */
    }
}