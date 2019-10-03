class Elipse extends THREE.Object3D
{
    constructor()
    {
        super();
        this.createGUI();

        // Radio del cilindro:
        this.r = 4;

        var that = this;

        this.sph = new THREE.Mesh(
            new THREE.SphereGeometry(1, 10, 10),
            new THREE.MeshNormalMaterial()
        );

        this.cilindro = new THREE.Mesh(
            new THREE.CylinderGeometry(this.r, this.r, 4, 50),
            new THREE.MeshNormalMaterial({opacity:0.35,transparent:true})   
        );

        this.intermedio = new THREE.Object3D();
        this.intermedio.add(this.sph)
        
        // Posicionar la esfera:
        this.sph.position.x = this.r * this.guiControls.ext;
        
        this.add(this.intermedio);
        this.add(this.cilindro);

        //////////////////////////////////////////////////////////////////////////////////////////////////////

        // Crear la animación con TWEEN:
        // Animación para la posición Z:
        this.animZ1 = new TWEEN.Tween({z: 0})
            .to({z: -this.r}, 1000)
            .easing(TWEEN.Easing.Quadratic.Out)
            .onComplete(function(){
                this.z = 0;
            })
            .onUpdate(function(){
                that.sph.position.z = this.z;
            });

        this.animZ2 = new TWEEN.Tween({z: -this.r})
            .to({z: 0}, 1000)
            .easing(TWEEN.Easing.Quadratic.In)
            .onComplete(function(){
                this.z = -that.r;
            })
            .onUpdate(function(){
                that.sph.position.z = this.z;
            });
        
        this.animZ3 = new TWEEN.Tween({z: 0})
            .to({z: this.r}, 1000)
            .easing(TWEEN.Easing.Quadratic.Out)
            .onComplete(function(){
                this.z = 0;
            })
            .onUpdate(function(){
                that.sph.position.z = this.z;
            });

        this.animZ4 = new TWEEN.Tween({z: this.r})
            .to({z: 0}, 1000)
            .easing(TWEEN.Easing.Quadratic.In)
            .onComplete(function(){
                this.z = that.r;
            })
            .onUpdate(function(){
                that.sph.position.z = this.z;
            });

        // Encadenar las animaciones:
        this.animZ1.chain(this.animZ2);
        this.animZ2.chain(this.animZ3);
        this.animZ3.chain(this.animZ4);
        this.animZ4.chain(this.animZ1);

        //////////////////////////////////////////////////////////////////////////////////////////////////////

        // Animación para la posición x:
        this.animX1 = new TWEEN.Tween({x: 1})
            .to({x: 0}, 1000)
            .easing(TWEEN.Easing.Quadratic.In)
            .onComplete(function(){
                this.x = 1;
            })
            .onUpdate(function(){
                that.sph.position.x = this.x * that.r * that.guiControls.ext;
            });

        this.animX2 = new TWEEN.Tween({x: 0})
            .to({x: 1}, 1000)
            .easing(TWEEN.Easing.Quadratic.Out)
            .onComplete(function(){
                this.x = 0;
            })
            .onUpdate(function(){
                that.sph.position.x = this.x * -that.r * that.guiControls.ext;
            });
        
        this.animX3 = new TWEEN.Tween({x: 1})
            .to({x: 0}, 1000)
            .easing(TWEEN.Easing.Quadratic.In)
            .onComplete(function(){
                this.x = 1;
            })
            .onUpdate(function(){
                that.sph.position.x = this.x * -that.r * that.guiControls.ext;
            });

        this.animX4 = new TWEEN.Tween({x: 0})
            .to({x: 1}, 1000)
            .easing(TWEEN.Easing.Quadratic.Out)
            .onComplete(function(){
                this.x = 0;
            })
            .onUpdate(function(){
                that.sph.position.x = this.x * that.r * that.guiControls.ext;
            });

        // Encadenar las animaciones:
        this.animX1.chain(this.animX2);
        this.animX2.chain(this.animX3);
        this.animX3.chain(this.animX4);
        this.animX4.chain(this.animX1);

        // Empezar las animaciones:
        this.animZ1.start();
        this.animX1.start();
    }

    createGUI()
    {
        this.guiControls = new function()
        {
            this.ext = 1.0;
        }

        var folder = gui.addFolder("Cilindro");
        folder.add(this.guiControls, 'ext', 1.0, 5.0).name(" Extensión : ");
    }

    update()
    {
        this.cilindro.scale.x = (this.r * this.guiControls.ext) / this.r;
        this.sph.position.x = this.r * this.guiControls.ext;
        TWEEN.update();
    }
}