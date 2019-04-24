// Álvaro Fernández García

class Examen extends THREE.Object3D
{
    constructor()
    {
        super();
        this.createGUI();

        // Crear primero la parte roja: con la geometría transladada abajo:
        this.roja = new THREE.Mesh(
            new THREE.BoxGeometry(1,8,1).applyMatrix(new THREE.Matrix4().makeTranslation(0,-4,0)),
            new THREE.MeshPhongMaterial( { color: 0xff0000 } )
        );

        // Crear la parte verde:
        // Primero definimos el path:
        var curve = new THREE.CatmullRomCurve3([
            new THREE.Vector3(0, 0, 2),
            new THREE.Vector3(0, 0, 1),
            new THREE.Vector3(0, 0.5, 0.5),
            new THREE.Vector3(0, 1, 0),
            new THREE.Vector3(0, 0.5, -0.5),
            new THREE.Vector3(0, 0, -1),
            new THREE.Vector3(0, 0, -2),
        ]);

        // Crear las opciones de extrusión:
        var extrudeSettings = {
            bevelEnabled: false,
            steps: 50,
            curveSegments: 50,
            extrudePath: curve
        };

        // Crear el shape: un círculo de radio 0.5:
        var shape = new THREE.Shape();
        shape.moveTo(-0.5, 0);
        shape.quadraticCurveTo(-0.5, 0.5, 0, 0.5);
        shape.quadraticCurveTo(0.5, 0.5, 0.5, 0);
        shape.quadraticCurveTo(0.5, -0.5, 0, -0.5);
        shape.quadraticCurveTo(-0.5, -0.5, -0.5, 0);

        // Crear el mesh: (ya transladado)
        this.verde = new THREE.Mesh(
            new THREE.ExtrudeGeometry(shape, extrudeSettings).applyMatrix(new THREE.Matrix4().makeTranslation(0,0,2)),
            new THREE.MeshPhongMaterial( { color: 0x00ff00 } )
        );

        this.verde.position.y  = -8;

        // Crear la parte azul: (ya transladada)
        this.azul = new THREE.Mesh(
            new THREE.BoxGeometry(1,8,1).applyMatrix(new THREE.Matrix4().makeTranslation(0,-4,0)),
            new THREE.MeshPhongMaterial( { color: 0x0000ff } )
        );

        this.azul.position.y  = -8;
        this.azul.position.z = this.guiControls.b;

        // Crear la animación para la parte azul:
        var that = this;
        this.anim = new TWEEN.Tween({c: -Math.PI / 4})
            .to({c: Math.PI / 4}, 2000)
            .easing(TWEEN.Easing.Quadratic.InOut)
            .onUpdate(function(){
                that.azul.rotation.z = this.c;
            })
            .yoyo(true)
            .repeat(Infinity);

        // Crear el nodo que tendrá las tres piezas:
        this.model = new THREE.Object3D();

        this.model.add(this.roja);
        this.model.add(this.verde);
        this.model.add(this.azul);

        this.add(this.model);

        // Iniciar la animación de la parte azul:
        this.anim.start();
    }

    createGUI()
    {
        this.guiControls = new function()
        {
            this.a = 0;
            this.b = 4;
        }

        var folder = gui.addFolder("Controles Ejercicio 2");
        folder.add(this.guiControls, 'a', -Math.PI/4, Math.PI/4).name("Rot Superior: ").listen();
        folder.add(this.guiControls, 'b', 4, 10).name("Escalado: ").listen();

    }

    update()
    {
        this.model.rotation.z = this.guiControls.a;
        this.verde.scale.z = this.guiControls.b / 4; // Porque mide 4 inicialmente
        this.azul.position.z = this.guiControls.b;
    
        TWEEN.update();
    }
}