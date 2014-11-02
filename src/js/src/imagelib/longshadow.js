/*
Copyright 2010 Google Inc.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

     http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

//#REQUIRE "includes.js"

imagelib.longshadow = {};

imagelib.longshadow.getColor = function(imgData, x, y) {
  var index = (y * imgData.width + x) * 4;
  var data = imgData.data;
  var r = data[index];
  var g = data[index + 1];
  var b = data[index + 2];
  var a = data[index + 3];
  return [r, g, b, a];
};

imagelib.longshadow.setColor = function(imgData, x, y, color) {
  var index = (y * imgData.width + x) * 4;
  var data = imgData.data;
  data[index] = color[0];
  data[index + 1] = color[1];
  data[index + 2] = color[2];
  data[index + 3] = color[3];
};

imagelib.longshadow.matchColor = function(a, b) {
  return a[0] === b[0] && a[1] === b[1] && a[2] === b[2] && a[3] === b[3];
};

imagelib.longshadow.getAlpha = function(imgData, x, y) {
  var data = imgData.data;
  var index = (y * imgData.width + x) * 4 + 3;
  return data[index];
};

imagelib.longshadow.inShade = function(imgData, x, y) {
  var data = imgData.data;
  while (true) {
    x -= 1;
    y -= 1;
    if (x < 0 || y < 0) {
      return false;
    }
    if (imagelib.longshadow.getAlpha(imgData, x, y)) {
      return true;
    }
  }
};

imagelib.longshadow.shade = function(imgData, x, y) {
  var n = 48;
  var step = n / (imgData.width + imgData.height);
  var alpha = n - ((x+y) * step);
  //var color = [0, 0, 0, 32];
  var color = [0, 0, 0, alpha];
  return imagelib.longshadow.setColor(imgData, x, y, color);
};

imagelib.longshadow.render = function(ctx, w, h) {
  var imgData = ctx.getImageData(0, 0, w, h);
  for(var y = 0; y < imgData.height; y++) {
    for(var x = 0; x < imgData.width; x++) {
      //var color = imagelib.longshadow.getColor(imgData, x, y);
      //if (color[3] != 0) {
      //  continue;
      //}
      if (imagelib.longshadow.inShade(imgData, x, y)) {
        imagelib.longshadow.shade(imgData, x, y);
      }
    }
  }
  ctx.putImageData(imgData, 0, 0);
};
