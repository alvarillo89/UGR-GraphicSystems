// Modificado: En lugar de heredar de THREE.Mesh, heredamos de THREE.Object3D, esto hace
// que el objeto, en lugar de ser directamente una malla, sea un Objeto3D y podamos crearle
// una jerarquía de objectos (Árbol)
class MyBox extends THREE.Object3D 
{
    constructor() 
    {
        super();
    
        // Se crea la parte de la interfaz que corresponde a la caja
        // Se crea primero porque otros métodos usan las variables que se definen para la interfaz
        this.createGUI();
        
        // Ahora vamos a crear la malla, para crearla necesitamos una geometría y un material:
        this.geometry = new THREE.BoxGeometry(1,1,1);
        // Modificado: en lugar de un material rojo, utilizaremos este que cambia el color
        // dependiendo de las normales y además queremos que sea flat y no smooth:
        this.material = new THREE.MeshNormalMaterial();
        this.material.flatShading = true;

        /* 
        Anotación:
        Las primitivas básicas se crean centradas en el origen. Se puede modificar su posición con 
        respecto al sistema de coordenadas local con una transformación aplicada directamente a la 
        geometría.
        
            this.geometry.applyMatrix(new THREE.Matrix4().makeTranslation(0,0.5,0));
        
        En definitiva utilizaremos makeTranslation cuando nos interese modificar la geometría
        respecto al sistema de coordenadas local del objeto, es decir, cuando queremos modificar 
        el sistema de referencia local.
        Para todo lo demás se utiliza objeto.position.set(...) que no cambia el S.R.L
        
        Modificación: de momento no voy a cambiar el S.R.L
        */
    
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
        // Controles para el tamaño, la orientación y la posición de la caja
        // Modificado: solo controlarémos el tamaño:
        this.guiControls = new function() 
        {
            this.sizeX = 1.0;
            this.sizeY = 1.0;
            this.sizeZ = 1.0;
            
            /*this.rotX = 0.0;
            this.rotY = 0.0;
            this.rotZ = 0.0;
            
            this.posX = 0.0;
            this.posY = 0.0;
            this.posZ = 0.0;*/
            
            // Un botón para dejarlo todo en su posición inicial
            // Cuando se pulse se ejecutará esta función.
            this.reset = function() 
            {
                this.sizeX = 1.0;
                this.sizeY = 1.0;
                this.sizeZ = 1.0;
                
                /*this.rotX = 0.0;
                this.rotY = 0.0;
                this.rotZ = 0.0;
                
                this.posX = 0.0;
                this.posY = 0.0;
                this.posZ = 0.0;*/
            }
        } 
    
        // Se crea una sección para los controles de la caja
        var folder = gui.addFolder('Controles de la Caja');
        // Estas lineas son las que añaden los componentes de la interfaz
        // Las tres cifras indican un valor mínimo, un máximo y el incremento
        // El método listen() permite que si se cambia el valor de la variable en código, 
        // el deslizador de la interfaz se actualice
        folder.add(this.guiControls, 'sizeX', 0.1, 5.0, 0.1).name ('Tamaño X : ').listen();
        folder.add(this.guiControls, 'sizeY', 0.1, 5.0, 0.1).name ('Tamaño Y : ').listen();
        folder.add(this.guiControls, 'sizeZ', 0.1, 5.0, 0.1).name ('Tamaño Z : ').listen();
        
        /*folder.add(this.guiControls, 'rotX', 0.0, Math.PI/2, 0.1).name ('Rotación X : ').listen();
        folder.add(this.guiControls, 'rotY', 0.0, Math.PI/2, 0.1).name ('Rotación Y : ').listen();
        folder.add(this.guiControls, 'rotZ', 0.0, Math.PI/2, 0.1).name ('Rotación Z : ').listen();
        
        folder.add(this.guiControls, 'posX', -20.0, 20.0, 0.1).name ('Posición X : ').listen();
        folder.add(this.guiControls, 'posY', 0.0, 10.0, 0.1).name ('Posición Y : ').listen();
        folder.add(this.guiControls, 'posZ', -20.0, 20.0, 0.1).name ('Posición Z : ').listen();*/
        
        folder.add(this.guiControls, 'reset').name ('[ Reset ]');
    }
  
    update() 
    {
        // Con independencia de cómo se escriban las 3 siguientes líneas, el orden en el que se 
        // aplican las transformaciones es:
        // Primero, el escalado
        // Segundo, la rotación en Z
        // Después, la rotación en Y
        // Luego, la rotación en X
        // Y por último la traslación
        //this.mesh.position.set(this.guiControls.posX,this.guiControls.posY,this.guiControls.posZ);
        //this.mesh.rotation.set(this.guiControls.rotX,this.guiControls.rotY,this.guiControls.rotZ);
        
        this.mesh.scale.set(this.guiControls.sizeX,this.guiControls.sizeY,this.guiControls.sizeZ);
        
        // Modificado: esto es para que rote él solo:
        this.mesh.rotation.x += 0.01;
        this.mesh.rotation.y += 0.01;
        this.mesh.rotation.z += 0.01;
    }
}