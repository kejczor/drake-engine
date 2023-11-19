export namespace gpt {
  interface Point3D {
    x: number;
    y: number;
    z: number;
  }

  // Define the canvas and its 2D context
  const canvas = document.getElementById("app") as HTMLCanvasElement;
  const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

  // Define a 3D cube with vertices
  let cubeVertices: Point3D[] = [
    { x: -50, y: -50, z: -50 },
    { x: 50, y: -50, z: -50 },
    { x: 50, y: 50, z: -50 },
    { x: -50, y: 50, z: -50 },
    { x: -50, y: -50, z: 50 },
    { x: 50, y: -50, z: 50 },
    { x: 50, y: 50, z: 50 },
    { x: -50, y: 50, z: 50 },
  ];

  cubeVertices.forEach((point) => {
    point.y += 50;
  });

  // Function to project 3D points to 2D screen coordinates
  function project(vertex: Point3D): Point3D {
    const focalLength = 200; // Adjust this for perspective
    return {
      x: (vertex.x * focalLength) / (vertex.z + focalLength),
      y: (vertex.y * focalLength) / (vertex.z + focalLength),
      z: vertex.z,
    };
  }

  // Function to draw a line between two projected 3D points
  function drawLine(from: Point3D, to: Point3D) {
    const projectedFrom = project(from);
    const projectedTo = project(to);
    ctx.beginPath();
    ctx.moveTo(projectedFrom.x, projectedFrom.y);
    ctx.lineTo(projectedTo.x, projectedTo.y);
    ctx.stroke();
  }

  // Function to draw the 3D cube
  function drawCube() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.translate(canvas.width / 2, canvas.height / 2);

    // Rotate the cube around the X-axis (for example)
    const angleX = (Math.PI / 180) * 0.5; // Change the angle for rotation
    cubeVertices.forEach((vertex) => {
      const y = vertex.y * Math.cos(angleX) - vertex.z * Math.sin(angleX);
      const z = vertex.y * Math.sin(angleX) + vertex.z * Math.cos(angleX);
      vertex.y = y;
      vertex.z = z;
    });

    // Draw lines between the vertices to form the cube
    drawLine(cubeVertices[0], cubeVertices[1]);
    drawLine(cubeVertices[1], cubeVertices[2]);
    drawLine(cubeVertices[2], cubeVertices[3]);
    drawLine(cubeVertices[3], cubeVertices[0]);
    drawLine(cubeVertices[4], cubeVertices[5]);
    drawLine(cubeVertices[5], cubeVertices[6]);
    drawLine(cubeVertices[6], cubeVertices[7]);
    drawLine(cubeVertices[7], cubeVertices[4]);
    drawLine(cubeVertices[0], cubeVertices[4]);
    drawLine(cubeVertices[1], cubeVertices[5]);
    drawLine(cubeVertices[2], cubeVertices[6]);
    drawLine(cubeVertices[3], cubeVertices[7]);

    ctx.translate(-canvas.width / 2, -canvas.height / 2);
    requestAnimationFrame(drawCube);
  }

  // Start the animation
  drawCube();
}
