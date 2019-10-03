class BolaSaltarina extends THREE.Object3D
{
    constructor()
    {
        super();
        this.createGUI();

        this.tAntes = Date.now();

        // Crear la esfera saltarina:
        this.sph = new THREE.Mesh(
            new THREE.SphereGeometry(1, 10, 10),
            new THREE.MeshNormalMaterial()
        );

        this.cilindro = new THREE.Mesh(
            new THREE.CylinderGeometry(this.guiControls.r, this.guiControls.r, 8, 50),
            new THREE.MeshNormalMaterial({opacity:0.35,transparent:true})   
        );

        this.intermedio = new THREE.Object3D();
        this.intermedio.add(this.sph)
        this.sph.position.x = this.guiControls.r;
        this.add(this.intermedio);
        this.add(this.cilindro);

        var orig = {p:  4};
        var dest = {p: -4};

        var anim = new TWEEN.Tween(orig).to(dest, 1000);

        var that = this;
        anim.onUpdate(function(){
            that.sph.position.y = this.p;
        });

        anim.easing(TWEEN.Easing.Quadratic.InOut)
        anim.yoyo(true).repeat(Infinity);

        anim.start();
    }


    createGUI()
    {
        this.guiControls = new function()
        {
            this.r = 4.0;
        }

        var folder = gui.addFolder("Cilindro");
        folder.add(this.guiControls, 'r', 4.0, 10.0).name(" Radio : ");
    }

    update()
    {
        var yvelocity = Math.PI / 2;
        var tDespues = Date.now();
        var deltaTime = (tDespues - this.tAntes) / 1000;

        this.cilindro.geometry = new THREE.CylinderGeometry(this.guiControls.r, this.guiControls.r, 8, 50);
        this.sph.position.x = this.guiControls.r;
        this.intermedio.rotation.y += yvelocity * deltaTime;
        TWEEN.update();
        
        this.tAntes = tDespues;
    }
}