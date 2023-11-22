import GameObject from "../GameObject";

export default class Sphere extends GameObject {
  constructor(position?: Point3DTuple, size?: Point3DTuple, rotation?: Point3DTuple) {
    super("/objects/sphere.obj", position, size, rotation);
  }
}
