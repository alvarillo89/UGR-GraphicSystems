class SateliteA extends THREE.Object3D
{
    constructor()
    {
        super();

        this.timeAntes = Date.now();

        // Crear la tierra:
        var texture = new THREE.TextureLoader().load('../imgs/earth.jpg');
        var earthMat = new THREE.MeshPhongMaterial ({map: texture});
        var sphere = new THREE.SphereGeometry(3, 20, 20);
        this.earth = new THREE.Mesh(sphere, earthMat);
        this.add(this.earth);


        // Crear el primer satélite: siempre mira a la tierra:
        this.sat1Intermedio = new THREE.Object3D(); // Nodo auxiliar intermedio:
        var satGeom = new THREE.SphereGeometry(2,20,20);
        var texture = new THREE.TextureLoader().load('../imgs/ojo.jpg');
        var faceMat = new THREE.MeshPhongMaterial ({map: texture});
        this.sat1 = new THREE.Mesh(satGeom, faceMat);
        this.sat1.rotation.y = Math.PI;
        this.sat1.position.x = 8;
        this.sat1Intermedio.add(this.sat1);
        this.add(this.sat1Intermedio);

        // Crear el segundo satélite: siempre mira a la cámara:
        this.sat2Intermedio = new THREE.Object3D(); // Nodo auxiliar intermedio
        this.sat2 = new THREE.Mesh(satGeom, faceMat);
        this.sat2.rotation.y -= Math.PI / 4; 
        this.sat2.position.x = 16;
        this.sat2Intermedio.add(this.sat2);
        this.add(this.sat2Intermedio);

        // Crear el tercer satélite:
        this.sat3Intermedio = new THREE.Object3D(); // Nodo auxiliar intermedio
        this.sat3 = new THREE.Mesh(satGeom, faceMat);
        this.sat3.position.x = 24;
        this.sat3Intermedio.add(this.sat3);
        this.add(this.sat3Intermedio);
    }

    update()
    {
        // Declarar las velocidades:
        var earthVel = 20 * Math.PI / 180.0;
        // hacer el cálculo del tiempo entre frames:
        var actual = Date.now();
        var deltaTime = (actual - this.timeAntes) / 1000;

        // Rotar la tierra:
        this.earth.rotation.y += earthVel * deltaTime;
    
        // Rotar el primer satélite para que mire a la tierra:
        this.sat1Intermedio.rotation.y += earthVel * deltaTime;
    
        // rotación del segundo satélite para que siempre mire a la cámara:
        this.sat2Intermedio.rotation.y += earthVel * deltaTime;
        this.sat2.rotation.y -= earthVel * deltaTime; // Rota en sentido contrario para que siempre esté fijo.

        // rotación del último satélite:
        this.sat3Intermedio.rotation.y += earthVel * deltaTime;
        this.sat3.rotation.y -= 2 * earthVel * deltaTime; // Hay que deshacer dos veces la rotación.

        this.timeAntes = actual;
    }
}