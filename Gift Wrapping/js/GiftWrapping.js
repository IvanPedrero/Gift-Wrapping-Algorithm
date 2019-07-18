const points = [];
const hull = [];

var leftMostPoint;
var index = 0;
var nextIndex = -1;

var currentVertex;
var nextVertex;

var canDrawShape = false;

var ignoreClick = false;

function setup() {
  
  //Create a canvas of 500x500 px.
  createCanvas(windowWidth, windowHeight);
  
  //Create a button.
  button_create = createButton('Convex Hull');
  button_create.position(19, 19);
  button_create.size(150,40);
  button_create.mousePressed(startDrawing);

  alert('Create points by clicking on the black screen, after that click on the button to create a convex hull!');
  
}

function draw() {

  //Check if the mouse is not over the button. Fast implemenation
  if(mouseX > 19 - 150 &&
     mouseX < 19 + 150 &&
     mouseY > 19 - 40 &&
     mouseY < 19 + 40)
  {
    ignoreClick = true;
  }
  else
  {
    ignoreClick = false;
  }
  
  background(0); 
  
  //White point, with 5px of width.
  stroke(255);
  strokeWeight(5);
  for(let p of points){
    point(p.x, p.y);
  }
  
  if(!canDrawShape){
    return;
  }
    
  //Show left most.
  stroke(50, 0 ,255);
  strokeWeight(8);
  point(leftMostPoint.x, leftMostPoint.y);

  //Create the shape.
  stroke(200, 0, 255);
  strokeWeight(2);
  fill(200, 0, 255, 50);
  beginShape();
  for(let p of hull){
    vertex(p.x, p.y);
  }
  endShape(CLOSE);
  
  stroke(0, 255, 0);
  point(leftMostPoint.x, leftMostPoint.y);
  
  stroke(0, 0, 255);
  point(currentVertex.x, currentVertex.y);
  
  
  //Show a white line on the current vertex.
  stroke(0, 0, 0);
  strokeWeight(2);
  line(currentVertex.x, currentVertex.y, nextVertex.x, nextVertex.y); 
    
  let checking = points[index];
  
  //Avoid drawing a final line.
  if(index < points.length-1){
    stroke(255);
    line(currentVertex.x, currentVertex.y, checking.x, checking.y);
  }

  //Optimize by not checking the points already added to the shape.
  if(!hull.includes(checking)){
       
    const a = p5.Vector.sub(nextVertex, currentVertex);  
    const b = p5.Vector.sub(checking, currentVertex); 
    const cross = a.cross(b);
  
    if(cross.z < 0){
      nextVertex = checking;
      nextIndex = index;
    }
  }
  
  index = index + 1;
  
  
  if (index == points.length) {
    
    if(nextVertex == leftMostPoint){
      
      //Done!
      
      //The close line must be blue!
      stroke(200,0,255);
      strokeWeight(2);
      line(currentVertex.x, currentVertex.y, leftMostPoint.x, leftMostPoint.y);
      
      //End the loop.
      noLoop();
    }
    else{
      
      hull.push(nextVertex);     
      currentVertex = nextVertex;      
      index = 0;        
      nextVertex = leftMostPoint;
      
    }
        
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function mouseClicked() {
  
  if(canDrawShape || ignoreClick){
    return;
  }

  points.push(createVector(mouseX, mouseY));
     
}

function initShape(){
  
  points.sort((a,b) => (a.x - b.x));
  
  leftMostPoint = points[0];
  
  currentVertex = leftMostPoint;
  
  hull.push(currentVertex);
  
  nextVertex = points[1];
  
  index = 2;
}

function startDrawing(){
  
  if(points.length == 0) {
    
    alert('Click on the screen to create the points. Then click on the button to begin with the algorithm!');
    
    return;
  }
  
  if(canDrawShape == true){
    
    reset();
    
  }
  
  else
  {
    initShape();
  
    canDrawShape = true;
  }
  
}

function reset(){
  
  //Reset the arrays.
  points.splice(0,points.length)
  hull.splice(0,hull.length)
  
  //Reset the values.
  index = 0;
  nextIndex = -1;
  
  canDrawShape = false;
  
  //Restart the loop.
  loop();

}