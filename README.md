# learn-webgl

## table of contents

### 1. the big picture

<details markdown='1'>
    <summary> <a href='https://learnwebgl.brown37.net/the_big_picture/introduction.html'> 1.1 introduction<a></summary>
    webgl is a web api that allows us to use gpu in the device in a web browser to render realtime 3d graphics. it is the only cross platform development environment that the software industry has today. learning webgl is the best way to learn computer graphics and have a "toolbox" that you can use to create your own computer graphics.
</details>

<details markdown='1'>
    <summary> <a href='https://learnwebgl.brown37.net/the_big_picture/3d_rendering.html'> 1.2 3d computer graphics - what and how<a></summary>
    computer graphics have applications beyond video games and movies. _raster graphics_ describes pictures using small dots of colors, pixels (Picture elements). if the dots are small enough and close enough, a person does not see the dots, they see a "picture". _vector graphics_ describes 3d objects using mathematical equations. a picture is creted from the 3 dimentional object via a process called "rendering". results of rendering is a 2 dimentional raster image. 
</details>

<details markdown='1'>
    <summary> <a href='https://learnwebgl.brown37.net/the_big_picture/webgl_history.html'> 1.3 computer graphics - a brief history<a></summary>
    the first computer graphics program was developed by evan sutherland called sketchpad in 1963 as part of his phd thesis, which lead him to win the turing award in 1988. we need a "write once run anywhere" way to generate 3d graphics. this slogan was of the sun microsystems btw which they used for java. webgl is an implementation of opengl 2.0 in javascript. webgl is an js api that can render 3d graphics on any compatiable browser without the use of plugins.
</details>

<details markdown='1'>
    <summary> <a href='https://learnwebgl.brown37.net/the_big_picture/file_structure.html'> 1.4 file organization for webgl programs<a></summary>
    a webgl application has following files: html, css, js, obj/data and shader. a basic principle of a file structure is to group relateed files in seperate folders. a logical file organization would be to have a separate folder for each WebGL program that stores files unique to that program, and a common library folder for shared files.
</details>

<details markdown='1'>
    <summary> <a href='https://learnwebgl.brown37.net/the_big_picture/software_structure.html'> 1.5 software orginization for webgl programs<a></summary>
    object-oriented programming will be critical to the successful implementation of your webgl programs. for example, a scene is typically composed of multiple models. it makes sense to create an object for each model. this isolates the complexity of each model in a separate JavaScript object and it greatly facilitates code re-use.
</details>


<details markdown='1'>
    <summary> <a href='https://learnwebgl.brown37.net/the_big_picture/coding_standards.html'> 1.6 software coding standards<a></summary>
    to follow a set of good coding standards makes you a good programmer. please follow the link above to read more about the coding standards.
</details>


