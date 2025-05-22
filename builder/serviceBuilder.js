// builders/serviceBuilder.js

export class ServiceBuilder {
  constructor() {
    this.service = {};
  }
  setId(id) {
    this.service.id = id;
    return this;
  }
  setServiceName(name) {
    this.service.serviceName = name;
    return this;
  }
  setPetType(type) {
    this.service.petType = type; // 1: Dog, 2: Cat, 3: Both
    return this;
  }
  setDescription(htmlDesc) {
    this.service.description = htmlDesc;
    return this;
  }
  setShortDescription(shortDesc) {
    this.service.shortDescription = shortDesc;
    return this;
  }
  setPrice(price) {
    this.service.price = price;
    return this;
  }
  setDuration(minutes) {
    this.service.duration = minutes;
    return this;
  }
  setImageUrl(url) {
  this.service.imageUrl = url || '/img/default/logo-app.png'; 
  return this;
}
  setHidden(hidden) {
    this.service.hidden = hidden;
    return this;
  }
  setReviews(reviewIds) {
    this.service.reviews = reviewIds;
    return this;
  }
  build() {
    return this.service;
  }
}
