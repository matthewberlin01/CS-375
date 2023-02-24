//---------------------------------------------------------------------------
//
//  --- cube.js ---
//
//    A simple, encapsulated cube object

const DefaultNumSides = 8;

//
//  All of the parameters of this function are optional, although, it's
//    possible that the WebGL context (i.e., the "gl" parameter) may not
//    be global, so passing that is a good idea.
//
//  Further, the vertex- and fragment-shader ids assume that the HTML "id" 
//    attributes for the vertex and fragment shaders are named
//
//      Vertex shader:   "cube-vertex-shader"
//      Fragment shader: "cube-fragment-shader"
//
function Cube( gl, vertexShaderId, fragmentShaderId ) {

    // Initialize the shader pipeline for this object using either shader ids
    //   declared in the application's HTML header, or use the default names.
    //
    const vertShdr = vertexShaderId || "cube-vertex-shader";
    const fragShdr = fragmentShaderId || "cube-fragment-shader";

    // Initialize the object's shader program from the provided vertex
    //   and fragment shaders.  We make the shader program private to
    //   the object for simplicity's sake.
    // 
    const shaderProgram = initShaders( gl, vertShdr, fragShdr );

    if ( shaderProgram < 0 ) {
        alert( "Error: cube shader pipeline failed to compile.\n\n" +
            "\tvertex shader id:  \t" + vertShdr + "\n" +
            "\tfragment shader id:\t" + fragShdr + "\n" );
        return; 
    }
    
    //Here we specify all the position of a unit cube, along with how many indices
    //should be used to represent one vertex.
    this.positions = {
        values: new Float32Array(
            [
                0.5, 0.5, 0.0,      //Vertex 0
                -0.5, 0.5, 0.0,      //Vertex 1
                -0.5, -0.5, 0.0,      //Vertex 2
                0.5, -0.5, 0.0,      //Vertex 3
                0.5, -0.5, -0.5,     //Vertex 4
                0.5, 0.5, -0.5,     //Vertex 5
                -0.5, 0.5, -0.5,     //Vertex 6
                -0.5, -0.5, -0.5      //Vertex 7
            ]
        ),

        numComponents: 3
    };

    this.indices = {
        values: new Uint16Array(
            [
                0, 1, 2,    0, 2, 3,    //front face
                0, 3, 4,    0, 4, 5,    //right face
                0, 5, 6,    0, 6, 1,    //top face
                7, 6, 2,    2, 6, 1,    //left face
                3, 4, 7,    2, 3, 7,    //bottom face
                6, 7, 4,    5, 6, 4     //back face
            ]
        ),
        count: 36
    };

    this.uniforms = {
        MV: gl.getUniformLocation(shaderProgram, "MV"),
        P: gl.getUniformLocation(shaderProgram, "P")
    };

    this.MV= mat4();
    this.P = mat4();

    //What have I done...
    this.P = perspective(155, 0.8, 0.25, 2);

    // Create our vertex buffer and initialize it with our positions data
    var aPosition = new Attribute(gl, shaderProgram, this.positions.values, "aPosition", this.positions.numComponents, gl.FLOAT);
    var indices = new Element(gl, this.indices.values);
        
    // Create a render function that can be called from our main application.
    //   In this case, we're using JavaScript's "closure" feature, which
    //   automatically captures variable values that are necessary for this
    //   routine so we can be less particular about variables scopes.  As 
    //   you can see, our "positions", and "indices" variables went out of
    //   scope when the Cone() constructor exited, but their values were
    //   automatically saved so that calls to render() succeed.
    // 
    this.render = function () {
        // Enable our shader program
        gl.useProgram( shaderProgram );

        this.MV = mult(mult(rotateX(1), rotateY(1)), this.MV);

        gl.uniformMatrix4fv(this.uniforms.MV, false, flatten(this.MV));
        gl.uniformMatrix4fv(this.uniforms.P, false, flatten(this.P));

        // Activate our vertex, enabling the vertex attribute we want data
        //   to be read from, and tell WebGL how to decode that data.
        //
        aPosition.enable();

        // Likewise enable our index buffer so we can use it for rendering
        //
        indices.enable();
        gl.drawElements(gl.TRIANGLES, 36, indices.type, 0);

        // Finally, reset our rendering state so that other objects we
        //   render don't try to use the Cone's data
        //
        aPosition.disable();
        indices.disable();
    }
};
