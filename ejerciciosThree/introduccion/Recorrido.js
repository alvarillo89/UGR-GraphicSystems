class Recorrido extends THREE.Object3D
{
    constructor()
    {
        super();

        // Creamos la Nave:
        this.ship = new THREE.Mesh(
            new THREE.ConeGeometry(0.5, 2.5),
            new THREE.MeshNormalMaterial()
        );

        // Para que la punta sea el face:
        this.ship.geometry.applyMatrix(new THREE.Matrix4().makeRotationX(Math.PI/2));

        this.add(this.ship);
        
        // Definir el spline para la trayectoria:
        this.curve = new THREE.CatmullRomCurve3([
            new THREE.Vector3(2,2,2),
            new THREE.Vector3(10,2,10),
            new THREE.Vector3(16,0,0),
            new THREE.Vector3(10,6,-10),
            new THREE.Vector3(-4,4,2),
            new THREE.Vector3(-10,4,10),
            new THREE.Vector3(-16,6,0),
            new THREE.Vector3(-10,6,-10)
        ], true); // El true es el parámetro closed.

        var spline = new THREE.Line(
            new THREE.Geometry().setFromPoints( this.curve.getPoints(100) ),
            new THREE.LineBasicMaterial( { color : 0xff0000 } )
        );

        this.add(spline);

        // Crear la interpolación de la curva entre [0,1] utilizando Tween:
        // además dividida en 2:
        var that = this;
        this.anim1 = new TWEEN.Tween({t: 0})
            .to({t: 0.5}, 8000)
            .easing(TWEEN.Easing.Quadratic.InOut)
            .onComplete(function(){
                this.t = 0;
            })
            .onUpdate(function(){
                var pos = that.curve.getPointAt(this.t);
                that.ship.position.copy(pos);
                var tan = that.curve.getTangentAt(this.t);
                pos.add(tan);
                that.ship.lookAt(pos);
            });

        this.anim2 = new TWEEN.Tween({t: 0.5})
            .to({t: 1}, 4000)
            .easing(TWEEN.Easing.Quadratic.InOut)
            .onComplete(function(){
                this.t = 0.5;
            })
            .onUpdate(function(){
                var pos = that.curve.getPointAt(this.t);
                that.ship.position.copy(pos);
                var tan = that.curve.getTangentAt(this.t);
                pos.add(tan);
                that.ship.lookAt(pos);
            });

        // Encadenar las animaciones:
        this.anim1.chain(this.anim2);
        this.anim2.chain(this.anim1);

        // Empezar la animación:
        this.anim1.start();
    }

    update()
    {
        TWEEN.update();
    }
}