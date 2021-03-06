var image = "flower.png";

var img = new Image();
img.src = image;

var ctx = createCanvas('canvas1', img.height, img.width, document.getElementById('container'));

img.onload = function() {
  draw(this);
}

function draw(img) {
  ctx.drawImage(img, 0, 0);
  img.style.display = 'none';
  
  //Source data
  var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  var data1 = imageData.data;
  
  //Recreation data
  var drawingData = ctx2.getImageData(0, 0, canvas.width, canvas.height);
  var data2 = drawingData.data;
  
  function swapPixel(source, destination) {
    let temp = [data1[source], data1[source + 1], data1[source + 2], data1[source + 3]];

    data1[source] = data1[destination];
    data1[source + 1] = data1[destination + 1];
    data1[source + 2] = data1[destination + 2];
    data1[source + 3] = data1[destination + 3];

    data1[destination] = temp[0];
    data1[destination + 1] = temp[1];
    data1[destination + 2] = temp[2];
    data1[destination + 3] = temp[3];
  }

  var replicate_random = function() {
    for (let i = 0; i < data2.length; i += 4) {
      let new_r = Math.floor(Math.random() * 255);
      let new_g = Math.floor(Math.random() * 255);
      let new_b = Math.floor(Math.random() * 255);

      //Calculate previous color-distance
      let distance1 = distance(data1[i], data1[i+1], data1[i+2],
                               data2[i], data2[i+1], data2[i+2]);
      
      //Calculate new color-distance
      let distance2 = distance(data1[i], data1[i+1], data1[i+2],
                               new_r, new_g, new_b);

      
      if( distance2 < distance1 ) {
        data2[i]   = new_r;
        data2[i+1] = new_g;
        data2[i+2] = new_b;
        data2[i+3] = 255;
      }
    }

    ctx2.putImageData(drawingData, 0, 0);
    setTimeout(iterate, 10);
  };

  var bubbleSort = function() {

    let n = 1;

    var sort = function() {

      if(data1.length === (n * 4)) {
        clearInterval(id);
        return;
      }
  
      for (let i = 0; i < data1.length - (n * 4); i += 4) {
  
        d1 = distance(data1[i], data1[i+1], data1[i+2]);
        d2 = distance(data1[i+4], data1[i+5], data1[i+6]);
  
        if(d2 < d1) {
          //Create copy so we don't lose the data
          let temp = [data1[i], data1[i+1], data1[i+2]];
  
          //swap first point with second.
          data1[i] = data1[i+4];
          data1[i+1] = data1[i+5];
          data1[i+2] = data1[i+6];
  
          //swap second point with original first point
          data1[i+4] = temp[0];
          data1[i+5] = temp[1];
          data1[i+6] = temp[2];
          
        }
      }

      n++;
      ctx2.putImageData(imageData, 0, 0);
    };
    
    var id = setInterval(sort, 0);
    
  };

  var combSort = function() {
    let gap = data1.length;
    let shrink = 1.33;
    let sorted = false;

    while( !sorted ) {
      debugger;
      //update the gap for next comb
      if(gap > 12) gap = (Math.floor( gap/shrink ) + 3) & ~0x03; //Make sure the gap is a multiple of 4;
      if(gap <= 12 && gap > 4) {gap -= 4}
      else if( gap <= 4 ) {
        gap = 4;
        sorted = true;
      }

      ctx2.putImageData(imageData, 0, 0);
      
      let i = 0
      while( i + gap < data1.length ) {

        d1 = distance(data1[i], data1[i+1], data1[i+2]);
        d2 = distance(data1[i+gap], data1[i+gap+1], data1[i+gap+2]);
  
        if(d2 < d1) {
          //Create copy so we don't lose the data
          let temp = [data1[i], data1[i+1], data1[i+2]];
  
          //swap first point with second.
          data1[i] = data1[i+gap];
          data1[i+1] = data1[i+gap+1];
          data1[i+2] = data1[i+gap+2];
  
          //swap second point with original first point
          data1[i+gap] = temp[0];
          data1[i+gap+1] = temp[1];
          data1[i+gap+2] = temp[2];
          
        }
        
        i += 4;
        
      }
    }
  };

  var selectionSort = function() {
    let i = 0, j;
    const process = setInterval(loop, 0);

    // Advance through the image pixel data array
    function loop() {
      //( i = 0; i < data1.length - 4; i+=4 ) {

      debugger;

      if(i >= data1.length - 4) {
        debugger;
        clearInterval(process);
        return;
      }

      // Assume the first element is the smallest
      let jMin = i;
      
      // Comparisons
      for( j = i+4; j <= data1.length - 4; j+=4 ) {
        
        d1 = distance(data1[jMin], data1[jMin+1], data1[jMin+2]);
        d2 = distance(data1[j], data1[j+1], data1[j+2]);
  
        if(d2 < d1) {
          debugger;
          jMin = j;
        }
      }

      //Swap
      if (jMin !== i) {
        //Create copy so we don't lose the data
        let temp = [data1[i], data1[i+1], data1[i+2]];
  
        //swap first point with second.
        data1[i] = data1[jMin];
        data1[i+1] = data1[jMin+1];
        data1[i+2] = data1[jMin+2];

        //swap second point with original first point
        data1[jMin] = temp[0];
        data1[jMin+1] = temp[1];
        data1[jMin+2] = temp[2];

      }

      i += 4;
      ctx2.putImageData(imageData, 0, 0);
    }
  }

  function merge(left, right) {
    let resultArray = [], leftIndex = 0; rightIndex = 0;

    dl = distance(left[leftIndex], left[leftIndex+1], left[leftIndex+2]);
    dr = distance(right[rightIndex], right[rightIndex+1], right[rightIndex+2]);

    // Concatenate array values in order
    while(leftIndex < left.length && rightIndex < right.length) {
      if (dl < dr) {
        resultArray.push(left[leftIndex]);
        resultArray.push(left[leftIndex+1]);
        resultArray.push(left[leftIndex+2]);
        leftIndex+=4; // Move left index pointer
      } else {
        resultArray.push(right[rightIndex]);
        resultArray.push(right[rightIndex+1]);
        resultArray.push(right[rightIndex+2]);
        rightIndex+=4; // Move right index pointer
      }
    }

    return resultArray
            .concat(left.slice(leftIndex))
            .concat(right.slice(rightIndex));
  }

  //Recursive merge sort

  var mergeSort = function(unsortedArray) {

    //Base case. 
    if( unsortedArray.length <= 4 ) {
      return unsortedArray;
    }

    const middle = Math.floor(unsortedArray.length / 2);

    const left = unsortedArray.slice(0, middle);
    const right = unsortedArray.slice(middle);

    return merge( mergeSort(left), mergeSort(right) );

  }

  function mergeSortInit() {
    debugger;
    data1 = mergeSort(data1);
    ctx2.putImageData(imageData, 0, 0);
  }

  var insertionSort = function() {
    let i = 4, j, key = [], d1;

    (function loop() {
      debugger;
      //If array is full sorted stop the sorting process

      key[0] = data1[i];
      key[1] = data1[i+1];
      key[2] = data1[i+2];

      d1 = distance(data1[i], data1[i+1], data1[i+2]);
      j = i - 4;

      while(j >= 0 && distance(data1[j], data1[j+1], data1[j+2]) > d1) {
        data1[j + 4] = data1[j];
        data1[j + 5] = data1[j + 1];
        data1[j + 6] = data1[j + 2];
        j-=4;
      }
      data1[j + 4] = key[0];
      data1[j + 5] = key[1];
      data1[j + 6] = key[2];
      
      i += 4;

      ctx2.putImageData(imageData, 0, 0);

      if(i > data1.length) {
        return;
      } else {
        window.setImmediate(loop);
      }
    })();

  }

  var btn = document.getElementById('func');
  btn.addEventListener('click', insertionSort);
}