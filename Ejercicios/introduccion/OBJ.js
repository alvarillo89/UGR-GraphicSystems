class OBJ extends THREE.Object3D
{
    constructor()
    {
        super();

        var that = this;

        var loader = new THREE.OBJLoader2();

        loader.loadMtl('../porsche911/911.mtl', null, 
            function(materials)
            {
                loader.setMaterials(materials);
                loader.setLogging(true, true);
                loader.load('../porsche911/Porsche_911_GT2.obj',
                    function(object)
                    {
                        var modelo = object.detail.loaderRootNode;
                        that.add(modelo);
                    }, null, null, null, false
                );
            }
        );
    }

    update()
    {

    }
}