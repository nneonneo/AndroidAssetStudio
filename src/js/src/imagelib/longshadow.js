/*
Copyright 2014 Google Inc.

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

imagelib.longshadow.setColor = function(imgData, x, y, color) {
  var index = (y * imgData.width + x) * 4;
  var data = imgData.data;
  data[index] = color[0];
  data[index + 1] = color[1];
  data[index + 2] = color[2];
  data[index + 3] = color[3];
};

imagelib.longshadow.getAlpha = function(imgData, x, y) {
  var data = imgData.data;
  var index = (y * imgData.width + x) * 4 + 3;
  return data[index];
};

imagelib.longshadow.isInShade = function(imgData, x, y) {
  var data = imgData.data;
  while (true) {
    // traverse towards top/left
    x -= 1;
    y -= 1;
    if (x < 0 || y < 0) {
      // reached edge
      return false;
    }
    if (imagelib.longshadow.getAlpha(imgData, x, y)) {
      // alpha value casts shade
      return true;
    }
  }
};

imagelib.longshadow.castShade = function(imgData, x, y) {
  var n = 32;
  var step = n / (imgData.width + imgData.height);
  var alpha = n - ((x + y) * step);
  var color = [0, 0, 0, alpha];
  return imagelib.longshadow.setColor(imgData, x, y, color);
};

imagelib.longshadow.render = function(ctx, w, h) {
  var imgData = ctx.getImageData(0, 0, w, h);
  for(var y = 0; y < imgData.height; y++) {
    for(var x = 0; x < imgData.width; x++) {
      if (imagelib.longshadow.isInShade(imgData, x, y)) {
        imagelib.longshadow.castShade(imgData, x, y);
      }
    }
  }
  ctx.putImageData(imgData, 0, 0);
};
