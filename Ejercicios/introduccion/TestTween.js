class TestTween extends THREE.Object3D
{
    constructor()
    {
        super();

        // Creamos el péndulo:
        var bola = new THREE.Mesh(
            new THREE.SphereGeometry(1, 10, 10),
            new THREE.MeshNormalMaterial()
        );

        bola.position.y = -6;

        // Creamos la cuerda:
        var cuerda = new THREE.Mesh(
            new THREE.CylinderGeometry(0.2, 0.2, 6),
            new THREE.MeshNormalMaterial()
        );

        cuerda.position.y = -3;

        // Añadir a la jerarquia:
        this.add(bola);
        this.add(cuerda);

        // Primera transición entre dos escenas clave:
        var orig1 = {r: -Math.PI / 4};
        var fin1 = {r: Math.PI / 4};

        var anim1 = new TWEEN.Tween(orig1).to(fin1, 1000); // 1 seg

        var that = this;
        anim1.onUpdate(function(){
            that.rotation.z = this.r;
        });

        // Segunda transición entre dos escenas clave:
        var orig2 = {r: Math.PI / 4};
        var fin2 = {r: -Math.PI / 4};

        var anim2 = new TWEEN.Tween(orig2).to(fin2, 1000);

        anim2.onUpdate(function(){
            that.rotation.z = this.r;
        });

        // Encadenar las animaciones y demas opciones:
        anim1.chain(anim2);
        
        anim1.onComplete(function(){
            this.r = -Math.PI / 4;
        });

        anim2.onComplete(function(){
            this.r = Math.PI / 4;
            anim1.start();
        });
        
        // Empezar la animación:
        anim1.start();
    }

    update()
    {
        TWEEN.update();
    }
}