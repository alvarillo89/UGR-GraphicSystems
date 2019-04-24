 
// La clase fachada del modelo
/**
    * Usaremos una clase derivada de la clase Scene de Three.js para llevar el control de la escena 
    * y de todo lo que ocurre en ella.
*/
class MyScene extends THREE.Scene 
{
    constructor(unRenderer) 
    {
        super();
        
        // Se añade a la gui los controles para manipular los elementos de esta clase
        this.createGUI();
        
        // Construimos los distinos elementos que tendremos en la escena
        
        // Todo elemento que se desee sea tenido en cuenta en el renderizado de la escena debe pertenecer a esta. 
        // Bien como hijo de la escena (this en esta clase) o como hijo de un elemento que ya esté en la escena.
        // Tras crear cada elemento se añadirá a la escena con this.add(variable)
        this.createLights();
        
        // Tendremos una cámara con un control de movimiento con el ratón
        this.createCamera(unRenderer);
        
        // Un suelo
        // Modificado: de momento no dibujaremos el suelo:
        // this.createGround();
        
        // Y unos ejes. Imprescindibles para orientarnos sobre dónde están las cosas
        this.axis = new THREE.AxesHelper (5);
        this.add(this.axis);
        
        
        // Por último creamos la caja del ejemplo, como una instancia de una clase propia, que gestionará su 
        // creación y la interacción con la misma
        // Modificado: En lugar de añadir aquí todos los objetos, lo haremos dentro de una función
        this.createAndAddModels();
    }
  

    // Modificado: En esta función declararemos y añadiremos los objetos a la escena:
    // El proceso es: crear el objeto y añadir el nodo al grafo de escena.
    createAndAddModels()
    {
        // Declararemos un array con los modelos:
        this.models = [];

        /* ---------------------------------------------------------- * /
        // Ejercicio 2: Geometría Básica
        var box = new MyBox();
        this.models.push( box );
        this.add( box );

        var torus = new MyTorus();
        this.models.push( torus );
        this.add( torus );
        /* ---------------------------------------------------------- * /
        // Ejercicio 3: Objeto por revolución:
        var peon = new Revolucion();
        this.models.push( peon );
        this.add( peon );
        /* ---------------------------------------------------------- * /
        // Ejercicio 4: Objetos por barrido:
        var barrido = new Extrude();
        this.models.push( barrido );
        this.add( barrido );
        /* ---------------------------------------------------------- * /
        // Ejercicio 5: Constructive Solid Geometry:
        var csg = new CSG();
        this.models.push( csg );
        this.add( csg );
        /* ---------------------------------------------------------- * /
        // Ejercicio 6: Cargar objetos obj:
        var modelo = new OBJ();
        this.models.push( modelo );
        this.add( modelo );
        /* ---------------------------------------------------------- * /
        // Ejercicio 7: Modelo jerárquico:
        var jerarquico = new Pendulo();
        this.models.push( jerarquico );
        this.add( jerarquico );
        /* ---------------------------------------------------------- * /
        // Ejercicio 8: Animación Reloj
        var reloj = new Reloj();
        this.models.push( reloj );
        this.add( reloj );
        /* ---------------------------------------------------------- * /
        // Ejercicio 9: Péndulos con animación:
        var pendulosAnim = new PendulosAnim();
        this.models.push( pendulosAnim );
        this.add(pendulosAnim);
        /* ---------------------------------------------------------- * /
        // Ejercicio 10: Satelites a:
        var satA = new SateliteA();
        this.models.push( satA );
        this.add(satA);
        /* ---------------------------------------------------------- * /
        // Ejercicio 10: Satelites b: bola saltarina:
        var satB = new BolaSaltarina();
        this.models.push( satB );
        this.add(satB);
        /* ---------------------------------------------------------- */
        // Ejercicio 10: Satelites c: animación elipse:
        var satC = new Elipse();
        this.models.push( satC );
        this.add(satC);
        /* ---------------------------------------------------------- * /
        // PRUEBA: Probando Tween:
        var tween = new TestTween();
        this.models.push( tween );
        this.add(tween);
        /* ---------------------------------------------------------- * /
        // Ejercicio 11: Recorrido por un spline:
        var rec = new Recorrido();
        this.models.push( rec );
        this.add( rec );
        /* ---------------------------------------------------------- * /
        // Examen:
        var exam = new Examen();
        this.models.push( exam );
        this.add( exam );
        /* ---------------------------------------------------------- */
    }


    createCamera(unRenderer) 
    {
        // Para crear una cámara le indicamos
        // - El ángulo del campo de visión en grados sexagesimales
        // - La razón de aspecto ancho/alto
        // - Los planos de recorte cercano y lejano
        this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
        // También se indica dónde se coloca
        this.camera.position.set(20, 10, 20);
        // Y hacia dónde mira
        var look = new THREE.Vector3 (0,0,0);
        this.camera.lookAt(look);
        this.add(this.camera);
        
        // Para el control de cámara usamos una clase que ya tiene implementado los movimientos de órbita
        this.cameraControl = new THREE.TrackballControls(this.camera, unRenderer);
        // Se configuran las velocidades de los movimientos
        this.cameraControl.rotateSpeed = 5;
        this.cameraControl.zoomSpeed = -2;
        this.cameraControl.panSpeed = 0.5;
        // Debe orbitar con respecto al punto de mira de la cámara
        this.cameraControl.target = look;
    }
  

    createGround() 
    {
        // Una figura es un Mesh
        var ground = new THREE.Mesh ();
        // Un Mesh se compone de geometría y material
        ground.geometry = new THREE.BoxGeometry (50,0.2,50);
        // Las primitivas básicas se crean centradas en el origen
        // Se puede modificar su posición con respecto al sistema de coordenadas local con una transformación 
        // aplicada directamente a la geometría.
        ground.geometry.applyMatrix(new THREE.Matrix4().makeTranslation(0,-0.1,0));
        // Como material se crea uno a partir de una textura
        var texture = new THREE.TextureLoader().load('../imgs/wood.jpg');
        ground.material = new THREE.MeshPhongMaterial ({map: texture});
        // Por último se añade el suelo a la escena
        this.add (ground);
    }
  

    createGUI() 
    {
        // Se definen los controles que se modificarán desde la GUI
        // En este caso la intensidad de la luz y si se muestran o no los ejes
        this.guiControls = new function() 
        {
            // En el contexto de una función "this" alude a la función
            this.lightIntensity = 0.5;
            this.axisOnOff = true;
        }

        // Accedemos a la variable global "gui" declarada en "script.js" para añadirle la parte de interfaz que 
        //corresponde a los elementos de esta clase
        
        // Se crea una sección para los controles de esta clase
        var folder = gui.addFolder ('Luz y Ejes');
        
        // Se le añade un control para la intensidad de la luz
        folder.add (this.guiControls, 'lightIntensity', 0, 1, 0.1).name('Intensidad de la Luz : ');
        
        // Y otro para mostrar u ocultar los ejes
        folder.add (this.guiControls, 'axisOnOff').name ('Mostrar ejes : ');
    }
  

    createLights() 
    {
        // Se crea una luz ambiental, evita que se vean complentamente negras las zonas donde no incide de manera directa una fuente de luz
        // La luz ambiental solo tiene un color y una intensidad
        // Se declara como   var   y va a ser una variable local a este método
        //    se hace así puesto que no va a ser accedida desde otros métodos
        var ambientLight = new THREE.AmbientLight(0xccddee, 0.35);
        // La añadimos a la escena
        this.add (ambientLight);
        
        // Se crea una luz focal que va a ser la luz principal de la escena
        // La luz focal, además tiene una posición, y un punto de mira
        // Si no se le da punto de mira, apuntará al (0,0,0) en coordenadas del mundo
        // En este caso se declara como   this.atributo   para que sea un atributo accesible desde otros métodos.
        this.spotLight = new THREE.SpotLight( 0xffffff, this.guiControls.lightIntensity );
        this.spotLight.position.set( 60, 60, 40 );
        this.add (this.spotLight);
    }
  

    getCamera() 
    {
        // En principio se devuelve la única cámara que tenemos
        // Si hubiera varias cámaras, este método decidiría qué cámara devuelve cada vez que es consultado
        return this.camera;
    }
  

    setCameraAspect(ratio) 
    {
        this.camera.aspect = ratio;
        this.camera.updateProjectionMatrix();
    }
  

    update () 
    {
        // Se actualizan los elementos de la escena para cada frame
        // Se actualiza la intensidad de la luz con lo que haya indicado el usuario en la gui
        this.spotLight.intensity = this.guiControls.lightIntensity;
        
        // Se muestran o no los ejes según lo que idique la GUI
        this.axis.visible = this.guiControls.axisOnOff;
        
        // Se actualiza la posición de la cámara según su controlador
        this.cameraControl.update();
        
        // Se actualiza el resto del modelo
        // Modificado: en lugar de llamar uno por uno al método update, recorremos el
        // array de modelos:
        for(var i=0; i<this.models.length; i++)
        {
            this.models[i].update();
        }
    }
}