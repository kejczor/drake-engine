import GameObject from "../GameObject";

export default class Cube extends GameObject {
  constructor(position?: Point3DTuple, size?: Point3DTuple, rotation?: Point3DTuple) {
    super("/objects/cube.obj", position, size, rotation);
  }
}
