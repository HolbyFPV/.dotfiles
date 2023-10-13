var _debug = document.getElementById("debug");
function debug() {
  _debug.textContent = [].join.call(arguments, "\n");
}

var c = document.getElementById("draw"),
  ctx = c.getContext("2d");

function onResize() {
  c.width = c.clientWidth;
  c.height = c.clientHeight;
}
window.addEventListener("resize", onResize);
onResize();

// Utils
function clip(n, m, M) {
  return n < M ? (n > m ? n : m) : M;
}
function comeCloser(n, goal, factor, limit) {
  return limit && Math.abs(goal - n) < limit
    ? goal
    : n + (goal - n) / (factor || 10);
}
function dist(a, b) {
  var dx = b[0] - a[0],
    dy = b[1] - a[1],
    dz = b[2] - a[2];
  return Math.sqrt(dx * dx + dy * dy + dz * dz);
}
function normalize(v) {
  var l = Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
  return [v[0] / l, v[1] / l, v[2] / l];
}
function projection(p, d, s) {
  var f = (s || 1) / (1 - p[2] / d);
  return [p[0] * f, p[1] * f, p[2]];
}
function rotateX(p, a) {
  var d = Math.sqrt(p[2] * p[2] + p[1] * p[1]),
    na = Math.atan2(p[2], p[1]) + a;
  return [p[0], d * Math.cos(na), d * Math.sin(na)];
}
function rotateY(p, a) {
  var d = Math.sqrt(p[2] * p[2] + p[0] * p[0]),
    na = Math.atan2(p[0], p[2]) + a;
  return [d * Math.sin(na), p[1], d * Math.cos(na)];
}
function rotateZ(p, a) {
  var d = Math.sqrt(p[1] * p[1] + p[0] * p[0]),
    na = Math.atan2(p[1], p[0]) + a;
  return [d * Math.cos(na), d * Math.sin(na), p[2]];
}
function rotateMatrix(p, m) {
  return [
    p[0] * m[0] + p[1] * m[3] + p[2] * m[6],
    p[0] * m[1] + p[1] * m[4] + p[2] * m[7],
    p[0] * m[2] + p[1] * m[5] + p[2] * m[8],
  ];
}
// Not used there but could be useful ! (gives the invert rotation)
function transpose33(m) {
  return [m[0], m[3], m[6], m[1], m[4], m[7], m[2], m[5], m[8]];
}
function rotate3dMatrix(x, y, z, a) {
  var c = 1 - Math.cos(a),
    s = Math.sin(a);
  return [
    1 + c * (x * x - 1),
    x * y * c + z * s,
    x * z * c - y * s,
    x * y * c - z * s,
    1 + c * (y * y - 1),
    y * z * c + x * s,
    x * z * c + y * s,
    y * z * c - x * s,
    1 + c * (z * z - 1),
  ];
}
function mul33(m, n) {
  var m1 = m[0],
    m2 = m[1],
    m3 = m[2],
    m4 = m[3],
    m5 = m[4],
    m6 = m[5],
    m7 = m[6],
    m8 = m[7],
    m9 = m[8];

  var n1 = n[0],
    n2 = n[1],
    n3 = n[2],
    n4 = n[3],
    n5 = n[4],
    n6 = n[5],
    n7 = n[6],
    n8 = n[7],
    n9 = n[8];

  return [
    m1 * n1 + m4 * n2 + m7 * n3,
    m2 * n1 + m5 * n2 + m8 * n3,
    m3 * n1 + m6 * n2 + m9 * n3,
    m1 * n4 + m4 * n5 + m7 * n6,
    m2 * n4 + m5 * n5 + m8 * n6,
    m3 * n4 + m6 * n5 + m9 * n6,
    m1 * n7 + m4 * n8 + m7 * n9,
    m2 * n7 + m5 * n8 + m8 * n9,
    m3 * n7 + m6 * n8 + m9 * n9,
  ];
}
function chainMul33(base) {
  for (var i = 1, l = arguments.length; i < l; i++)
    base = mul33(base, arguments[i]);
  return base;
}
function dot(a, b) {
  return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
}
function cross(a, b) {
  return [
    a[1] * b[2] - a[2] * b[1],
    a[2] * b[0] - a[0] * b[2],
    a[0] * b[1] - a[1] * b[0],
  ];
}
function sub(a, b) {
  return [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
}

// Big chunk of code incoming !
// These are the drawing functions
// You should probably fold these functions and only open one at a time
var drawElectricity = (function () {
  // var color = 'hsl('+(Math.random() * 360)+', 60%, 50%)';
  var color = "#7ce38b";
  var rays = [];
  for (var i = 0; i < 5; i++) {
    var dest = [Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5];
    var d = Math.sqrt(
      dest[0] * dest[0] + dest[1] * dest[1] + dest[2] * dest[2]
    );
    dest[0] /= d;
    dest[1] /= d;
    dest[2] /= d;
    var parts = [],
      pCount = ~~(3 * Math.random()) + 3;
    for (var j = 0; j < pCount; j++) {
      parts.push({
        pos: (j + 1) / (pCount + 1),
        off: [0, 0, 0],
        maxOff: 4 + 3 * Math.random(),
        speed: 240,
      });
    }
    var vel = 3;
    var ray = {
      dest: dest,
      vel: [
        vel * (Math.random() - 0.5),
        vel * (Math.random() - 0.5),
        vel * (Math.random() - 0.5),
      ],
      parts: parts,
    };
    rays.push(ray);
  }
  var tmpC = [
      document.createElement("canvas"),
      document.createElement("canvas"),
    ],
    tCtx = [tmpC[0].getContext("2d"), tmpC[1].getContext("2d")];
  tmpC[0].width = tmpC[0].height = tmpC[1].width = tmpC[1].height = 200;
  tCtx[0].translate(100, 100);
  tCtx[1].translate(100, 100);
  var currentCanvas = 0;
  var counter = 0,
    pT;
  return function (ctx, faces, allCorners) {
    var now = Date.now(),
      dt = 0;
    if (pT) dt = (now - pT) * 0.001;
    pT = now;
    var c = ctx.canvas;
    var rad = cubeSize * (0.2 + 0.02 * Math.sin((counter += dt) * 2));
    var mx = c.width * 0.5,
      my = c.height * 0.5;
    ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.arc(0, 0, rad, 0, 2 * Math.PI);
    var i, l, j, l2;
    for (i = 0, l = allCorners.length; i < l; i++) {
      var corner = allCorners[i];
      var dx = corner[0] - mx,
        dy = corner[1] - my;
      var d = Math.sqrt(dx * dx + dy * dy);
      if (d <= rad) continue;
      ctx.moveTo((rad * dx) / d, (rad * dy) / d);
      ctx.lineTo(dx, dy);
    }
    ctx.stroke();
    currentCanvas = 1 - currentCanvas;
    var cc = tmpC[currentCanvas],
      cCtx = tCtx[currentCanvas];
    cCtx.clearRect(-cc.width * 0.5, -cc.height * 0.5, cc.width, cc.height);
    cCtx.shadowColor = "transparent";
    cCtx.shadowBlur = 0;
    cCtx.globalAlpha = Math.pow(0.001, dt);
    cCtx.drawImage(tmpC[1 - currentCanvas], -cc.width * 0.5, -cc.height * 0.5);
    cCtx.globalAlpha = 1;
    cCtx.strokeStyle = "rgba(245,250,255,1)";
    cCtx.shadowColor = "rgba(255,255,255,.5)";
    cCtx.shadowBlur = 4;
    for (i = 0, l = rays.length; i < l; i++) {
      var ray = rays[i],
        vel = ray.vel;
      var dest = (ray.dest = rotateX(
        rotateY(rotateZ(ray.dest, vel[2] * dt), vel[1] * dt),
        vel[0] * dt
      ));
      var previous = [0, 0];
      // cCtx.beginPath();
      // cCtx.moveTo(0,0);
      for (j = 0, l2 = ray.parts.length; j < l2; j++) {
        var part = ray.parts[j],
          off = part.off;
        off[0] += part.speed * (Math.random() - 0.5) * dt;
        off[1] += part.speed * (Math.random() - 0.5) * dt;
        off[2] += part.speed * (Math.random() - 0.5) * dt;
        var d = Math.sqrt(off[0] * off[0] + off[1] * off[1] + off[2] * off[2]);
        if (d > part.maxOff) {
          var m = part.maxOff / d;
          off[0] *= m;
          off[1] *= m;
          off[2] *= m;
        }
        var pos = [
          part.pos * rad * dest[0] + off[0],
          part.pos * rad * dest[1] + off[1],
        ];
        cCtx.lineWidth = 0.1 + 0.8 * (1 - part.pos);
        cCtx.beginPath();
        cCtx.moveTo(previous[0], previous[1]);
        cCtx.lineTo(pos[0], pos[1]);
        cCtx.stroke();
        previous = pos;
      }
      cCtx.lineWidth = 0.15;
      cCtx.beginPath();
      cCtx.moveTo(previous[0], previous[1]);
      cCtx.lineTo(rad * dest[0], rad * dest[1]);
      cCtx.stroke();
    }
    ctx.drawImage(cc, -cc.width * 0.5 + 720, -cc.height * 0.5);
  };
})();
var drawStars = (function () {
  var stars = [],
    focale = 100;
  var maxDist = 1000,
    f = (0.5 * maxDist) / focale;
  var newStar = function (dist, c, bop) {
    var speed = 400 + Math.random() * 200;
    return [
      (Math.random() - 0.5) * f,
      (Math.random() - 0.5) * f,
      dist,
      speed,
      bop || 0,
    ];
  };
  for (var i = 0; i < 200; i++) {
    var dist = maxDist * Math.random() + 1;
    stars.push(newStar(dist, c, 1));
  }
  var pT,
    dtMax = 1 / 60;
  return function (ctx) {
    var now = Date.now(),
      dt = 0;
    if (pT) dt = Math.min((now - pT) * 0.001, dtMax);
    pT = now;
    var c = ctx.canvas;
    ctx.fillStyle = "rgba(0,0,0,.8)";
    ctx.fillRect(c.width * -0.5, c.height * -0.5, c.width, c.height);
    for (var i = 0, l = stars.length; i < l; i++) {
      var star = stars[i];
      star[4] += dt * 0.5;
      star[2] -= dt * star[3];
      if (star[2] <= 0) star = stars[i] = newStar(maxDist, c);
      var op = Math.min(star[4], 1);
      ctx.fillStyle = "rgba(255,255,255," + op + ")";
      var f = focale / star[2],
        s = 3 * f;
      ctx.fillRect(
        cubeSize * star[0] * f - s * 0.5,
        cubeSize * star[1] * f - s * 0.5,
        s,
        s
      );
    }
  };
})();
var drawCubes = (function () {
  var v = [],
    e = [];
  v.push([-1, -1, -1]);
  v.push([-1, -1, 1]);
  v.push([1, -1, 1]);
  v.push([1, -1, -1]);
  v.push([1, 1, -1]);
  v.push([-1, 1, -1]);
  v.push([-1, 1, 1]);
  v.push([1, 1, 1]);
  var eFull = "0-1 1-2 2-3 3-0 4-5 5-6 6-7 7-4 0-5 1-6 2-7 3-4".split(" ");
  for (var i = eFull.length, ea; i--; )
    e.push([+(ea = eFull[i].split("-"))[0], +ea[1]]);
  var offset = Math.PI * 0.25,
    s1 = 0.5 / Math.sqrt(3),
    s2 = s1 / Math.sqrt(3),
    s3 = s2 / Math.sqrt(3);
  var draws = [
    {
      color: "#77bdfb",
      transform: function (p, m) {
        return projection(
          rotateX(rotateMatrix(p, m), offset),
          perspective,
          cubeSize * s1
        );
      },
      // transform: function(p, m) { return projection(rotateMatrix(rotateX(p, offset), m), f, s1); }
    },
    {
      color: "#7ce38b",
      transform: function (p, m) {
        return projection(
          rotateY(rotateMatrix(p, m), offset),
          perspective,
          cubeSize * s2
        );
      },
      // transform: function(p, m) { return projection(rotateMatrix(rotateY(p, offset), m), f, s2); }
    },
    {
      color: "#ffa752",
      transform: function (p, m) {
        return projection(
          rotateZ(rotateMatrix(p, m), offset),
          perspective,
          cubeSize * s3
        );
      },
      // transform: function(p, m) { return projection(rotateMatrix(rotateZ(p, offset), m), f, s3); }
    },
  ];
  return function (ctx) {
    // var y = Math.asin(rot[6]),
    // 	x = Math.atan2(-rot[7], rot[8]),
    // 	z = Math.atan2(-rot[3], rot[0]);
    // debug(180 * x / Math.PI, 180 * y / Math.PI, 180 * z / Math.PI);
    var allLines = [],
      i,
      l,
      d;
    for (d = draws.length; d--; ) {
      var draw = draws[d];
      var points = [];
      for (i = 0, l = v.length; i < l; i++)
        points.push(draw.transform(v[i], rotMatrix));
      for (i = e.length; i--; ) {
        var edge = e[i],
          p1 = points[edge[0]],
          p2 = points[edge[1]];
        var z = (p1[2] + p2[2]) * 0.5;
        allLines.push([p1[0], p1[1], p2[0], p2[1], z, draw.color]);
      }
    }
    // Order by z-distance to get a better look
    // (inverse because the next loop is decrementing)
    allLines.sort(function (a, b) {
      return b[4] - a[4];
    });
    ctx.lineWidth = 1.2;
    // ctx.globalCompositeOperation = 'lighter';
    for (i = allLines.length; i--; ) {
      l = allLines[i];
      ctx.strokeStyle = l[5];
      ctx.beginPath();
      ctx.moveTo(l[0], l[1]);
      ctx.lineTo(l[2], l[3]);
      ctx.stroke();
    }
  };
})();
var drawPhysics = (function () {
  // Using array for better perfs
  // 0: x, 1: y, 2: z, 3: px, 4: py, 5: pz
  function Point(x, y, z) {
    return [x, y, z, x, y, z];
  }
  function Stick(a, b, l, style) {
    return [a, b, l, style];
  }
  var points = [],
    sticks = [],
    objects = [];
  var tr = [0, 0, 0],
    defStyle = "white";
  var sticksCache = {}; // Used to remove duplicates
  function setTranslation(x, y, z) {
    tr = [x, y, z];
  }
  function addPoint(x, y, z) {
    return points.push(Point(tr[0] + x, tr[1] + y, tr[2] + z)) - 1;
  }
  function addStick(a, b, style, length) {
    var id = Math.min(a, b) + "|" + Math.max(a, b);
    if (sticksCache.hasOwnProperty(id)) return sticksCache[id];
    if (length === undefined) length = dist(points[a], points[b]);
    return (sticksCache[id] =
      sticks.push(Stick(a, b, length, style === undefined ? defStyle : style)) -
      1);
  }
  function addTriangle(a, b, c, h, style) {
    // h = 0;
    style = style || defStyle;
    addStick(a, b, !(h & 0x100) && style);
    addStick(b, c, !(h & 0x010) && style);
    addStick(c, a, !(h & 0x001) && style);
    return [a, b, c];
  }
  function addBox(s, x, y, z, style, parent) {
    if (style) defStyle = style;
    setTranslation(x, y, z);
    var p1 = addPoint(-s, -s, -s),
      p2 = addPoint(-s, -s, s),
      p3 = addPoint(s, -s, s),
      p4 = addPoint(s, -s, -s),
      p5 = addPoint(-s, s, -s),
      p6 = addPoint(-s, s, s),
      p7 = addPoint(s, s, s),
      p8 = addPoint(s, s, -s);
    var object = [parent, [p1, p2, p3, p4, p5, p6, p7, p8]];
    // clockwise points
    object.push(addTriangle(p1, p3, p2, 0x100));
    object.push(addTriangle(p1, p4, p3));
    object.push(addTriangle(p1, p6, p5, 0x100));
    object.push(addTriangle(p1, p2, p6));
    object.push(addTriangle(p1, p5, p4, 0x010));
    object.push(addTriangle(p4, p5, p8));
    object.push(addTriangle(p2, p7, p6, 0x100));
    object.push(addTriangle(p2, p3, p7));
    object.push(addTriangle(p3, p4, p8, 0x001));
    object.push(addTriangle(p3, p8, p7));
    object.push(addTriangle(p5, p6, p7, 0x001));
    object.push(addTriangle(p5, p7, p8));

    // Reinforce by adding sticks (could also add every face other diagonal)
    addStick(p1, p7, null);
    addStick(p2, p8, null);
    addStick(p3, p5, null);
    addStick(p4, p6, null);

    // Init spin
    // p1[3] += (Math.random()-.5)*.3;
    // p1[4] += (Math.random()-.5)*.3;
    // p1[5] += (Math.random()-.5)*.3;

    return objects.push(object) - 1;
  }
  function addTetrahedron(s, x, y, z, style, parent) {
    if (style) defStyle = style;
    setTranslation(x, y, z);
    var t = s;
    s *= Math.SQRT2;
    var p1 = addPoint(s, 0, -t),
      p2 = addPoint(-s, 0, -t),
      p3 = addPoint(0, -s, t),
      p4 = addPoint(0, s, t);
    var object = [parent, [p1, p2, p3, p4]];
    // clockwise points
    object.push(addTriangle(p1, p2, p4));
    object.push(addTriangle(p1, p4, p3));
    object.push(addTriangle(p1, p3, p2));
    object.push(addTriangle(p2, p3, p4));

    return objects.push(object) - 1;
  }
  addBox(0.5, 0, 0, 0, "#77bdfb");
  addBox(0.25, 0, 0, 0, "#890DFF", 0);
  addTetrahedron(0.125, 0, 0, 0, "#cea5fb", 1);

  var accuracy = 3;
  var stiffness = 1,
    bounce = 0; // Adjust accordingly with accuracy
  var friction = 0.98,
    gravity = 0.003;
  var fBases = [
    [1, 0, 0],
    [-1, 0, 0],
    [0, 1, 0],
    [0, -1, 0],
    [0, 0, 1],
    [0, 0, -1],
  ];
  var fs = [];
  var proj = [],
    lines = [];
  var paused = false; // [1,0,0,0,1,0,0,0,1]
  // document.addEventListener('mousedown', (e) => e.which === 3 && (paused = paused ? false : transpose33(rotMatrix)));
  // document.addEventListener('contextmenu', (e) => e.preventDefault());
  function applyVel() {
    for (var i = points.length; i--; ) {
      var p = points[i];
      var vx = (p[0] - p[3]) * friction,
        vy = (p[1] - p[4]) * friction,
        vz = (p[2] - p[5]) * friction;
      var gVec = [0, gravity, 0];
      // var gVec = rotateMatrix([0, gravity, 0], transpose33(rotMatrix));
      p[3] = p[0];
      p[4] = p[1];
      p[5] = p[2];
      p[0] += vx + gVec[0];
      p[1] += vy + gVec[1];
      p[2] += vz + gVec[2];
    }
  }
  var ns = [];
  function constraints() {
    ns = [];
    // bounds (external cube)
    for (var i = points.length; i--; ) {
      var p = points[i];
      for (var j = fs.length; j--; ) {
        var f = fs[j];
        var d = dot(p, f) - 1;
        if (d > 0) {
          // Outside !
          for (var j = 0; j < 3; j++) {
            p[j + 3] += bounce * d * f[j];
            p[j] -= d * f[j];
          }
        }
      }
    }
    // Objects inside objects
    for (var i = 0, l = objects.length; i < l; i++) {
      var o = objects[i],
        op = o[1];
      if (typeof o[0] === "number") {
        var p = objects[o[0]];
        for (var j = p.length; j-- > 2; ) {
          var tri = p[j];
          var p1 = tri[0],
            p2 = tri[1],
            p3 = tri[2];
          var a = points[p1],
            b = points[p2],
            c = points[p3];
          var n = normalize(cross(sub(b, a), sub(c, a)));
          for (var k = op.length; k--; ) {
            var pt = points[op[k]];
            var d = dot(sub(pt, a), n);
            if (d > 0) {
              for (var coord = 0; coord < 3; coord++) {
                var q = d * n[coord],
                  qb = bounce * q;
                pt[coord + 3] += qb;
                pt[coord] -= q;
              }
            }
          }
        }
      }
    }
    // sticks lengths
    for (var i = sticks.length; i--; ) {
      var s = sticks[i],
        p0 = points[s[0]],
        p1 = points[s[1]];
      var dx = p1[0] - p0[0],
        dy = p1[1] - p0[1],
        dz = p1[2] - p0[2];
      var d = Math.sqrt(dx * dx + dy * dy + dz * dz);
      var dd = s[2] - d,
        p = (stiffness * 0.5 * dd) / d;
      var offX = dx * p,
        offY = dy * p,
        offZ = dz * p;
      p0[0] -= offX;
      p0[1] -= offY;
      p0[2] -= offZ;
      p1[0] += offX;
      p1[1] += offY;
      p1[2] += offZ;
    }
  }
  function update() {
    if (!paused) {
      fs = [];
      for (var i = fBases.length; i--; )
        fs.push(rotateMatrix(fBases[i], rotMatrix));
      applyVel();
      for (var i = accuracy; i--; ) constraints();
    }
    proj = [];
    lines = [];
    for (var i = 0, l = points.length; i < l; i++)
      proj.push(
        projection(
          !paused
            ? points[i]
            : rotateMatrix(rotateMatrix(points[i], paused), rotMatrix),
          perspective
        )
      );
    for (var i = sticks.length; i--; ) {
      var s = sticks[i];
      if (!s[3]) continue;
      var a = proj[s[0]],
        b = proj[s[1]];
      lines.push([a[0], a[1], b[0], b[1], s[3], (a[2] + b[2]) * 0.5]);
    }
    lines.sort(function (a, b) {
      return b[5] - a[5];
    });
  }
  // Above 100fps, consider that we try to draw 2 times the same frame (so only update once)
  var pT,
    minFrameLength = 1000 / 100,
    time = 0;
  return function (ctx) {
    var now = Date.now(),
      dt = 0;
    if (pT) dt = now - pT;
    pT = now;
    time += dt;
    if (time >= minFrameLength) {
      time = 0;
      update();
    }
    // [-1; 1]
    ctx.scale(cubeSize * 0.5, cubeSize * 0.5);
    // ctx.fillStyle = 'white';
    // for(var i = points.length; i--;) {
    // 	var p = proj[i];
    // 	var size = .04 * (p[2] + 1);
    // 	ctx.fillRect(p[0] - size * .5, p[1] - size * .5, size, size);
    // }

    ctx.lineWidth = 2 / cubeSize;
    // ctx.strokeStyle = 'white';
    // ctx.beginPath();
    for (var i = lines.length; i--; ) {
      var l = lines[i];
      ctx.strokeStyle = l[4];
      ctx.beginPath();
      ctx.moveTo(l[0], l[1]);
      ctx.lineTo(l[2], l[3]);
      ctx.stroke();
    }
    // ctx.stroke();
  };
})();
var drawPong = (function () {
  // This one is a bit ugly (quickly coded)
  // Meant to be viewed from the right
  var ballSize = 0.05,
    ballSpeed = 2.5;
  var ball = [0, 0, 0],
    ballVel = [0, 0, 0];
  var p1 = [0, 0, 1],
    p2 = [0, 0, -1];
  var hits = [], // hitsFront = [],
    hitS = 0.1,
    hitM = 2;
  function mirrorRandNZ(m) {
    return (Math.random() + m) * (~~(Math.random() * 2) * 2 - 1);
  }
  function start() {
    var v = [mirrorRandNZ(0.5), mirrorRandNZ(0.5), mirrorRandNZ(0.9)];
    var l = ballSpeed / Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
    ballVel = [v[0] * l, v[1] * l, v[2] * l];
  }
  function transformed(p) {
    return projection(rotateMatrix(p, rotMatrix), perspective);
  }
  function addHit(pos, dx, dy, front) {
    // (front ? hitsFront : hits).push([pos, dx, dy, 0]);
    hits.push([pos, dx, dy, 0]);
  }
  function clipV(v) {
    return [clip(v[0], -1, 1), clip(v[1], -1, 1), clip(v[2], -1, 1)];
  }
  function hitSq(ctx, center, size, dx, dy) {
    var p1 = clipV([
        center[0] + size * (-dx[0] - dy[0]),
        center[1] + size * (-dx[1] - dy[1]),
        center[2] + size * (-dx[2] - dy[2]),
      ]),
      p2 = clipV([
        center[0] + size * (dx[0] - dy[0]),
        center[1] + size * (dx[1] - dy[1]),
        center[2] + size * (dx[2] - dy[2]),
      ]),
      p3 = clipV([
        center[0] + size * (dx[0] + dy[0]),
        center[1] + size * (dx[1] + dy[1]),
        center[2] + size * (dx[2] + dy[2]),
      ]),
      p4 = clipV([
        center[0] + size * (-dx[0] + dy[0]),
        center[1] + size * (-dx[1] + dy[1]),
        center[2] + size * (-dx[2] + dy[2]),
      ]);
    p1 = transformed(p1);
    p2 = transformed(p2);
    p3 = transformed(p3);
    p4 = transformed(p4);
    ctx.moveTo(p1[0], p1[1]);
    ctx.lineTo(p2[0], p2[1]);
    ctx.lineTo(p3[0], p3[1]);
    ctx.lineTo(p4[0], p4[1]);
    ctx.lineTo(p1[0], p1[1]);
  }
  function updateDrawHit(ctx, dt, hit) {
    hit[3] += dt;
    var peak = hit[3] * 4,
      max = 0;
    for (var x = -hitM; x <= hitM; x++)
      for (var y = -hitM; y <= hitM; y++) {
        var d = 1 + Math.abs(Math.sqrt(x * x + y * y) - peak);
        var op = clip(2.5 / d - 1, 0, 1);
        if (op > max) max = op;
        // #7ce38b = 
        ctx.fillStyle = "rgba(137, 13, 255," + op + ")";
        // ctx.fillRect(p[0]+(x-.5)*s,p[1]+(y-.5)*s,s,s);
        ctx.beginPath();
        var c = [
          hit[0][0] + hitS * ((x - 0.5) * hit[1][0] + (y - 0.5) * hit[2][0]),
          hit[0][1] + hitS * ((x - 0.5) * hit[1][1] + (y - 0.5) * hit[2][1]),
          hit[0][2] + hitS * ((x - 0.5) * hit[1][2] + (y - 0.5) * hit[2][2]),
        ];
        hitSq(ctx, c, hitS * 0.5, hit[1], hit[2]);
        ctx.fill();
      }
    return max >= 0.01;
  }
  start();
  var pT,
    dtMax = 1 / 60;
  return function (ctx) {
    var now = Date.now(),
      dt = 0;
    if (pT) dt = Math.min((now - pT) * 0.001, dtMax);
    pT = now;
    ctx.scale(cubeSize * 0.5, cubeSize * 0.5);

    ball[0] += ballVel[0] * dt;
    ball[1] += ballVel[1] * dt;
    ball[2] += ballVel[2] * dt;
    if (ball[0] < ballSize - 1) {
      ball[0] = ballSize - 1;
      ballVel[0] *= -1;
      addHit([-1, ball[1], ball[2]], [0, 0, 1], [0, 1, 0]);
    }
    if (ball[0] > 1 - ballSize) {
      ball[0] = 1 - ballSize;
      ballVel[0] *= -1;
      // addHit([1, ball[1], ball[2]], [0,0,1], [0,1,0], true);
    }
    if (ball[1] < ballSize - 1) {
      ball[1] = ballSize - 1;
      ballVel[1] *= -1;
      addHit([ball[0], -1, ball[2]], [1, 0, 0], [0, 0, 1]);
    }
    if (ball[1] > 1 - ballSize) {
      ball[1] = 1 - ballSize;
      ballVel[1] *= -1;
      addHit([ball[0], 1, ball[2]], [1, 0, 0], [0, 0, 1]);
    }
    if (ball[2] < ballSize - 1) {
      ball[2] = ballSize - 1;
      ballVel[2] *= -1;
      // addHit([ball[0], ball[1], -1], [1,0,0], [0,1,0]);
    }
    if (ball[2] > 1 - ballSize) {
      ball[2] = 1 - ballSize;
      ballVel[2] *= -1;
      // addHit([ball[0], ball[1], 1], [1,0,0], [0,1,0]);
    }
    // Should only call these once per frame
    // (or find a way to use dt with it)
    p1[0] = comeCloser(p1[0], ball[0], 2 + 20 * (1 - ball[2]));
    p1[1] = comeCloser(p1[1], ball[1], 2 + 20 * (1 - ball[2]));
    p2[0] = comeCloser(p2[0], ball[0], 2 + 20 * (ball[2] + 1));
    p2[1] = comeCloser(p2[1], ball[1], 2 + 20 * (ball[2] + 1));
    ctx.fillStyle = "white";
    ctx.beginPath();
    hitSq(ctx, p1, 0.2, [1, 0, 0], [0, 1, 0]);
    hitSq(ctx, p2, 0.2, [1, 0, 0], [0, 1, 0]);
    ctx.fill();
    hits = hits.filter(updateDrawHit.bind(this, ctx, dt));

    var bPos = transformed(ball);
    var s = ballSize / (1 - bPos[2] / perspective);
    ctx.fillStyle = "white";
    ctx.beginPath();
    ctx.arc(bPos[0], bPos[1], s, 0, 2 * Math.PI);
    ctx.fill();

    // hitsFront = hitsFront.filter(updateDrawHit.bind(this, ctx, dt));
  };
})();
var drawGrowing = (function () {
  function easing(t) {
    return t < 0.5 ? 2 * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
  }
  var globalScale = 1,
    globalRot = 0,
    rotX = -0.17;
  function transformed(v) {
    return projection(rotateX(rotateY(v, globalRot), rotX), perspective);
  }
  function box(ctx, sX, sY, sZ) {
    var p1 = transformed([-sX, -sY, sZ]),
      p2 = transformed([sX, -sY, sZ]),
      p3 = transformed([sX, sY, sZ]),
      p4 = transformed([-sX, sY, sZ]),
      p5 = transformed([-sX, -sY, -sZ]),
      p6 = transformed([sX, -sY, -sZ]),
      p7 = transformed([sX, sY, -sZ]),
      p8 = transformed([-sX, sY, -sZ]);
    ctx.moveTo(p1[0], p1[1]);
    ctx.lineTo(p2[0], p2[1]);
    ctx.lineTo(p3[0], p3[1]);
    ctx.lineTo(p4[0], p4[1]);
    ctx.lineTo(p1[0], p1[1]);
    ctx.lineTo(p5[0], p5[1]);
    ctx.lineTo(p6[0], p6[1]);
    ctx.lineTo(p7[0], p7[1]);
    ctx.lineTo(p8[0], p8[1]);
    ctx.lineTo(p5[0], p5[1]);
    ctx.moveTo(p2[0], p2[1]);
    ctx.lineTo(p6[0], p6[1]);
    ctx.moveTo(p3[0], p3[1]);
    ctx.lineTo(p7[0], p7[1]);
    ctx.moveTo(p4[0], p4[1]);
    ctx.lineTo(p8[0], p8[1]);
  }
  var pT,
    dtMax = 1 / 60,
    t = 0;
  var animDur = 2.1;
  return function (ctx) {
    var now = Date.now(),
      dt = 0;
    if (pT) dt = Math.min((now - pT) * 0.001, dtMax);
    pT = now;
    t += dt;
    var p = (t % animDur) / animDur;
    globalScale = 1 - p * 0.5;
    globalRot = (p * Math.PI) / 2;
    var sc = cubeSize * 0.2;
    ctx.scale(sc, sc);
    ctx.strokeStyle = "#ffa752";
    ctx.lineWidth = 0.75 / sc;
    ctx.beginPath();
    box(ctx, globalScale, globalScale, globalScale);
    var scx = easing(clip(p / 0.27, 0, 1)) * 1.5 + 0.5,
      scy = easing(clip((p - 0.27) / 0.27, 0, 1)) * 1.5 + 0.5,
      scz = easing(clip((p - 0.54) / 0.27, 0, 1)) * 1.5 + 0.5;
    box(ctx, globalScale * scx, globalScale * scy, globalScale * scz);
    ctx.stroke();
  };
})();

// Now the cube logic
var baseCorners = [
  [-1, -1, 1],
  [1, -1, 1],
  [1, 1, 1],
  [-1, 1, 1],
  [1, -1, -1],
  [-1, -1, -1],
  [-1, 1, -1],
  [1, 1, -1],
];
// Here are the faces of the cube
// You can use the same draw for multiple faces !
// But be careful, the function will be called for every face
// So if you increment something it will be incremented multiple times per frame
// Name is not actually used here except for human-readability (but could be used in a drawing function)
var faces = [
  {
    name: "front",
    corners: [0, 1, 2, 3],
    draw: drawElectricity,
  },
  {
    name: "back",
    corners: [4, 5, 6, 7],
    draw: drawGrowing,
    // ... empty ?
    // draw: function() { return true; }
    // draw: function(ctx) { var c = ctx.canvas; ctx.clearRect(-c.width*.5, -c.height*.5, c.width, c.height); }
  },
  {
    name: "right",
    corners: [1, 4, 7, 2],
    draw: drawPong,
  },
  {
    name: "left",
    corners: [5, 0, 3, 6],
    draw: drawStars,
  },
  {
    name: "bottom",
    corners: [3, 2, 7, 6],
    draw: drawPhysics,
  },
  {
    name: "top",
    corners: [5, 4, 1, 0],
    draw: drawCubes,
  },
];

// Style things
var faceBg = "rgba(4,13,24,.65)",
  border = "#7ce38b";
var cubeSize = 180,
  perspective = 15;

// Change rot to change the initial rotation (radians)
// rotVel is the angular velocity in rad/sec around every axis
var rot = [0, 0, 0],
  rotVel = [-6e-3, 7.6e-3, 2.13e-3],
  rotBase = [1, 0, 0, 0, 1, 0, 0, 0, 1],
  rotMatrix;
// Used mainly when dragging
function setBase() {
  rotBase = rotMatrix;
  rot = [0, 0, 0];
}
var autoRot = true;
// Actual drawing loop
function loop() {
  if (autoRot) {
    rot[0] += rotVel[0];
    rot[1] += rotVel[1];
    rot[2] += rotVel[2];
  }
  // Compute the current rotation matrix
  var mx = rotate3dMatrix(1, 0, 0, rot[0]),
    my = rotate3dMatrix(0, 1, 0, rot[1]),
    mz = rotate3dMatrix(0, 0, 1, rot[2]);
  rotMatrix = chainMul33(mx, my, mz, rotBase);

  var w = c.width,
    h = c.height;
  var corners = baseCorners.map(function (c) {
    var res = projection(
      rotateMatrix(c, rotMatrix),
      perspective,
      cubeSize * 0.5
    );
    res[0] += w * 0.5;
    res[1] += h * 0.5;
    return res;
  });
  ctx.clearRect(0, 0, w, h);
  // Compute every face corners position and its z position
  for (var i = 0, l = faces.length; i < l; i++) {
    var face = faces[i];
    var z = 0;
    var faceCorners = (face.currentCorners = face.corners.map(function (i) {
      var c = corners[i];
      z += c[2];
      return c;
    }));
    face.z = z * 0.25;
  }
  // Sort by z to draw what is behind first
  faces.sort(function (a, b) {
    return a.z - b.z;
  });
  for (var i = 0, l = faces.length; i < l; i++) {
    var face = faces[i];
    var faceCorners = face.currentCorners;
    ctx.save();
    // Clip twice : the first time to remove the face when it's not facing us
    // The second time to actually only draw on the face
    ctx.beginPath();
    ctx.rect(0, 0, c.width, c.height);
    drawPath(ctx, faceCorners);
    ctx.clip();
    ctx.beginPath();
    drawPath(ctx, faceCorners);
    ctx.clip();
    var drawBg;
    if (face.draw) {
      ctx.save();
      ctx.translate(w * 0.5, h * 0.5);
      drawBg = face.draw(ctx, faces, corners);
      ctx.restore();
    }
    // if(drawBg === undefined) drawBg = true;
    ctx.restore();

    ctx.fillStyle = faceBg;
    ctx.strokeStyle = border;
    ctx.lineWidth = 0.5;

    // Always draw the background if facing back
    ctx.save();
    ctx.beginPath();
    ctx.rect(c.width, 0, -c.width, c.height);
    drawPath(ctx, faceCorners);
    ctx.clip();
    ctx.beginPath();
    drawPath(ctx, faceCorners);
    ctx.fill();
    ctx.restore();

    ctx.beginPath();
    drawPath(ctx, faceCorners);
    if (drawBg) ctx.fill();
    ctx.stroke();
  }
  requestAnimationFrame(loop);
}
requestAnimationFrame(loop);

function drawPath(ctx, corners) {
  if (!corners.length) return;
  ctx.moveTo(corners[0][0], corners[0][1]);
  for (var i = 0, l = corners.length; i < l; i++)
    ctx.lineTo(corners[i][0], corners[i][1]);
  ctx.lineTo(corners[0][0], corners[0][1]);
}

// Handle mouse/touch events
(function () {
  var grabbed = false,
    moved = false,
    cPos,
    pPos;
  var lastMoveTime, vel, timer;
  var factor = 2e-3;
  function getPos(e) {
    if (e.touches && e.touches.length) e = e.touches[0];
    return [e.clientX, e.clientY];
  }
  function stopMomentum() {
    cancelAnimationFrame(timer);
    timer = null;
  }
  function mouseDown(e) {
    if (grabbed) return;
    if (!e.touches) e.preventDefault();
    stopMomentum();
    cPos = pPos = grabbed = getPos(e);
    moved = false;
  }
  function mouseMove(e) {
    if (!grabbed) return;
    var pos = getPos(e);
    var dx = grabbed[1] - pos[1],
      dy = pos[0] - grabbed[0];
    if (!moved) {
      if (dx * dx + dy * dy < 16) return;
      moved = true;
      autoRot = false;
      // rotBase = getRotMatrix(getComputedStyle(cube).getPropertyValue('transform'));
      // rot = [0,0,0];
      setBase();
    }
    lastMoveTime = Date.now();
    pPos = cPos;
    cPos = pos;
    rot = [dx * factor, dy * factor, 0];
  }
  function mouseUp(e) {
    if (!grabbed) return;
    grabbed = false;
    if (!moved) return;
    var f = Math.max(0, 1 - (Date.now() - lastMoveTime) / 200);
    vel = [(pPos[1] - cPos[1]) * factor * f, (cPos[0] - pPos[0]) * factor * f];
    timer = requestAnimationFrame(momentum);
    setTimeout(() => {
      autoRot = true;
    }, 3000);
  }
  function momentum() {
    if (Math.abs(vel[0]) < 0.001 && Math.abs(vel[1]) < 0.001) return;
    var decay = 0.95;
    vel[0] *= decay;
    vel[1] *= decay;
    rot[0] += vel[0];
    rot[1] += vel[1];
    if (timer) timer = requestAnimationFrame(momentum);
  }
  document.addEventListener("mousedown", mouseDown);
  document.addEventListener("mousemove", mouseMove);
  document.addEventListener("mouseup", mouseUp);
  document.addEventListener(
    "click",
    function (e) {
      if (!moved) return;
      e.preventDefault();
      e.stopPropagation();
    },
    true
  );
  document.addEventListener("touchstart", mouseDown);
  document.addEventListener("touchmove", mouseMove);
  document.addEventListener("touchend", mouseUp);
})();
