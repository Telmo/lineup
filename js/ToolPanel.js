
function createToolPanel(renderer, scale){

   var STANDARD_DIMENSIONS = {width: 460, height:287};

   var width = STANDARD_DIMENSIONS.width * scale,
       height = STANDARD_DIMENSIONS.height * scale;

   var panel = createPanel(renderer, width, height, {foregroundGlow: true});

   var toolBGPlane;

   var coverPlane;
   
   var started = false;


   var menu = [
           ["Languages", ["Javascript", "C#", "Java", "Go"]],
           ["Editors", ["Vim", "IntelliJ", "Visual Studio"]],
           ["Platforms", ["Modern Web", "Android"]],
           ["OS", ["Linux", "Windows"]]
       ];

   var unpackedMenu = [];

   for(var i = 0; i< menu.length; i++){
       for(var j = 0; j < menu[i][1].length; j++){
           unpackedMenu.push([menu[i][0], menu[i][1][j]]);
       }
   }

   function createBackground(){

        var material = new THREE.MeshBasicMaterial({transparent: false, color: 0x000000});
        var geometry = new THREE.PlaneBufferGeometry( width, height);

        var plane = new THREE.Mesh( geometry, material );
        plane.position.set(width/2, height/2, -1);
        panel.addToScene( plane );
   };

   function createCoverPlane(){

        var material = new THREE.MeshBasicMaterial({transparent: false, color: 0x000000});
        var geometry = new THREE.PlaneBufferGeometry( 256 * scale, 100 * scale);

        var plane = new THREE.Mesh( geometry, material );
        plane.position.set(200 * scale, 110 * scale,2);
        panel.addToScene( plane );
        
        return plane;

   }

   function createTextPlane(text, header, highlighted){

       var titleCanvas =  panel.renderToCanvas(512, 160, function(ctx){
           ctx.strokeStyle="#fff";

           ctx.font = "20pt Roboto";
           if(header){
               ctx.font = "30pt Roboto";
           }
           // ctx.fillStyle = '#ff8d07';
           ctx.fillStyle = '#fff';

           if(highlighted){
               ctx.fillStyle = '#ffcc00';
           }
           ctx.fillText(text, 50, 35);

       });

        var titleTexture = new THREE.Texture(titleCanvas)
        titleTexture.needsUpdate = true;

        var titleMaterial = new THREE.MeshBasicMaterial({map: titleTexture, transparent: true});
        var titleGeometry = new THREE.PlaneBufferGeometry( 256 * scale, 80 * scale);

        var plane = new THREE.Mesh( titleGeometry, titleMaterial );
        return plane;

   };

    function init(){
        createBackground();
        var toolTexture = THREE.ImageUtils.loadTexture('images/tools-foreground.png', undefined, LOADSYNC.register() );
        var toolMaterial = new THREE.MeshBasicMaterial({map: toolTexture, transparent: true});
        var toolGeometry = new THREE.PlaneBufferGeometry( 350 * scale, 350 * scale);
        toolPlane = new THREE.Mesh( toolGeometry, toolMaterial );
        toolPlane.position.set(width/2 + 45 * scale, height/2 - 40 * scale, 3);
        toolPlane.scale.set(.6,.6,.6);

        panel.addToScene( toolPlane );

        var toolBGTexture = THREE.ImageUtils.loadTexture('images/tools-background.png', undefined, LOADSYNC.register() );
        var toolBGMaterial = new THREE.MeshBasicMaterial({map: toolBGTexture, transparent: true, opacity: .9});
        var toolBGGeometry = new THREE.PlaneBufferGeometry( 350 * scale, 350 * scale);
        toolBGPlane = new THREE.Mesh( toolBGGeometry, toolBGMaterial );
        toolBGPlane.position.set(width/2 + 45 * scale, height/2 - 40 * scale, 2);
        toolBGPlane.scale.set(.6,.6,.6);

        panel.addToScene( toolBGPlane );

        var headerTexture = THREE.ImageUtils.loadTexture("images/tools-header.png", undefined, LOADSYNC.register() );
        var headerMaterial = new THREE.MeshBasicMaterial({map: headerTexture, depthTest: false, transparent: true});
        var headerGeometry = new THREE.PlaneBufferGeometry( 134 * scale, 32 * scale);
        var headerPlane = new THREE.Mesh(headerGeometry, headerMaterial );
        headerPlane.position.set(110 * scale, height - 100 * scale,5);
        headerPlane.scale.set(.7,.7,.7);
        panel.addToScene(headerPlane);
        
        var selectorTexture = THREE.ImageUtils.loadTexture("images/tools-selector.png", undefined, LOADSYNC.register() );
        var selectorMaterial = new THREE.MeshBasicMaterial({map: selectorTexture, depthTest: false, transparent: true});
        var selectorGeometry = new THREE.PlaneBufferGeometry( 310 * scale, 200 * scale);
        var selectorPlane = new THREE.Mesh(selectorGeometry, selectorMaterial );
        selectorPlane.position.set(160 * scale, height/2 - 32 * scale,5);
        selectorPlane.scale.set(.5, .5, .5);
        panel.addToScene(selectorPlane);


        for(var i =0; i< menu.length; i++){
            var title = createTextPlane(menu[i][0], true);
            title.position.set(( 65 + 256/2) * scale, 60 * scale,0);
            panel.addToScene(title);
            for(var j = 0; j < menu[i][1].length; j++){
                var unhighlightedTitle = createTextPlane(menu[i][1][j], false);
                unhighlightedTitle.position.set(( 65 + 256/2) * scale, 88 * scale + 12*j,0);
                panel.addToScene(unhighlightedTitle);
            }
        }

        coverPlane = createCoverPlane();

    }


    function render(time){
        if(!started){
            // var step1 = new TWEEN.Tween(coverPlane.position)
            //     .to({x:500 * scale}, 1000);
                // .onUpdate(function(){
                //     coverPlane.position.x = this.x;
                // });
                //
            // var step2 = new TWEEN.Tween(coverPlane.position)
            //     .to({x:200 * scale}, 1000)
            //     .delay(5000);

            // step1.chain(step2);
            // step2.chain(step1);
            // step1.start();

            var rotation = [];
            var sliders = [];
            var previous = "";

            for(var i = 0; i< unpackedMenu.length; i++){
                rotation.push(new TWEEN.Tween(toolPlane.rotation)
                   .delay(1000)
                   .easing(TWEEN.Easing.Cubic.InOut)
                   .to({z: 2 * (i + 1) * Math.PI / unpackedMenu.length}, 500));

                if(previous != unpackedMenu[i][0]){
                    sliders.push(new TWEEN.Tween(coverPlane.position)
                            .to({x:500 * scale}, 500));
                    sliders.push(new TWEEN.Tween(coverPlane.position)
                            .delay(menu[(sliders.length-1) / 2][1].length * 1000)
                            .to({x:200 * scale}, 500));
                    if(sliders.length > 2){
                        sliders[sliders.length - 3].chain(sliders[sliders.length - 2]);
                    }

                    sliders[sliders.length - 2].chain(sliders[sliders.length - 1]);

                    previous = unpackedMenu[i][0];
                }


                if(i > 0){
                    rotation[i - 1].chain(rotation[i]);
                }
            };

            // rotation.push(new TWEEN.Tween(toolPlane.rotation).delay(1000).easing(TWEEN.Easing.Cubic.InOut).to({z:0}, 500));
            // rotation[rotation.length - 2].chain(rotation[rotation.length - 1]);
            rotation[rotation.length - 1].chain(rotation[0]);

            rotation[0].start();

            sliders[sliders.length - 1].chain(sliders[0]);
            sliders[0].start();

            started = true;

        }

        panel.render(time);

    }

    init();

    return Object.freeze({
        toString: function(){return "AboutPanel"},
        render: render,
        renderTarget: panel.renderTarget,
        width: width,
        height: height,
        quad: panel.quad,
        checkBounds: panel.checkBounds,
        setBlur: panel.setBlur,
        setPosition: panel.setPosition
    });
}
