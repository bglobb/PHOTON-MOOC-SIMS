var {PI, sin, cos, asin, acos, min, max} = Math;
var down = new Array(1000);
var mouse_down = 0;

document.onclick = function() {  // Supposed to be when the start button is clicked
  setTimeout(main, 1e3);
}

function main() {
  if (!this.cam) {
    this.canvas = $("canvas");
    this.cam = PHOTON.camera;
    this.x = new THREE.Vector3();
    this.y = new THREE.Vector3();
    this.z = new THREE.Vector3();
    if (cam) {
      cam.matrixWorld.extractBasis(x, y, z);
      $("body").css("overflow", "hidden");  // Page doesn't scroll when text moves around
      $(document).mousedown(function() {
        mouse_down = 1;
      });
      $(document).mouseup(function() {
        mouse_down = 0;
      });
      $(document).click(function() {
        console.log("p("+cam.position.x+", "+cam.position.y+", "+cam.position.z+")  // x, y, z");
        console.log("a("+cam.theta+", "+cam.phi+")  // theta, phi\n\n\n")
      });
      document.addEventListener("keydown", function(e) {
        down[e.which] = 1;
      });
      document.addEventListener("keyup", function(e) {
        down[e.which] = 0;
      });
      document.addEventListener("mousemove", function(e) {
        if (mouse_down) {
          cam.updateMatrixWorld=()=>{}  // Want to update this manually!
          a(cam.theta-0.002*e.movementX, cam.phi+0.002*e.movementY);
        }
      });

      requestAnimationFrame(loop);
    }
  }
}

function loop() {
  cam.matrixWorld.set(
    x.x, y.x, z.x, cam.position.x,
    x.y, y.y, z.y, cam.position.y,
    x.z, y.z, z.z, cam.position.z,
    0, 0, 0, 1
  );
  cam.phi = asin(z.y);
  cam.theta = z.z>0?asin(z.x/cos(cam.phi)):z.x>0?2*PI/2-asin(z.x/cos(cam.phi)):-2*PI/2-asin(z.x/cos(cam.phi));
  var [xc, yc, zc] = [x, y, z].map(v=>v.clone());
  [xc, yc, zc].map(v=>v.multiplyScalar(5));
  if (down[87]) {
    cam.position.sub(zc);
  } if (down[65]) {
    cam.position.sub(xc);
  } if (down[83]) {
    cam.position.add(zc);
  } if (down[68]) {
    cam.position.add(xc);
  }
  requestAnimationFrame(loop);
}

function a(theta, phi) {
  cam.theta = theta===''?cam.theta:theta;
  cam.phi = min(max(phi===''?cam.phi:phi, -PI/2), PI/2);

  this.z = new THREE.Vector3(sin(theta)*cos(phi), sin(phi), cos(theta)*cos(phi));
  this.x = new THREE.Vector3(sin(theta+PI/2)*cos(0), sin(0), cos(theta+PI/2)*cos(0));
  this.y.crossVectors(z, x);
}

function p(x, y, z) {
  cam.position.x = x===''?cam.position.x:x;
  cam.position.y = y===''?cam.position.y:y;
  cam.position.z = z===''?cam.position.z:z;
}
