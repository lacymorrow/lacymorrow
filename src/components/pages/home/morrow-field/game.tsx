"use client";

import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { swapOnLoad } from "./model-loader";
import { NAV_LINKS, ZONES, type Zone } from "./zones";

const C = {
  sand: 0xead9b4,
  sky: 0xf3e2c8,
  road: 0xf6ecd6,
  terracotta: 0xcd5f38,
  teal: 0x1f6e66,
  mustard: 0xe3a44f,
  cream: 0xfaf3e2,
  ink: 0x35312c,
  blush: 0xe2937b,
  pine: 0x175048,
} as const;

const FONT: Record<string, string[]> = {
  L: ["#..", "#..", "#..", "#..", "###"],
  A: [".#.", "#.#", "###", "#.#", "#.#"],
  C: [".##", "#..", "#..", "#..", ".##"],
  Y: ["#.#", "#.#", ".#.", ".#.", ".#."],
  M: ["#...#", "##.##", "#.#.#", "#...#", "#...#"],
  O: [".###.", "#...#", "#...#", "#...#", ".###."],
  R: ["##.", "#.#", "##.", "#.#", "#.#"],
  W: ["#...#", "#...#", "#.#.#", "##.##", "#...#"],
};

interface Prop {
  g: THREE.Group;
  v: THREE.Vector3;
  w: THREE.Vector3;
  r: number;
  restY: number;
  asleep: boolean;
}

interface Gate {
  x: number;
  z: number;
  yaw: number;
  passed: boolean;
  lastSide: number;
  ring: THREE.Mesh;
}

interface Solid {
  x: number;
  z: number;
  r: number;
}

interface EngineOptions {
  canvas: HTMLCanvasElement;
  onZoneChange: (zone: Zone | null) => void;
  onGateCount: (count: number, total: number) => void;
  onToast: (msg: string, ms?: number) => void;
  onStart: () => void;
  getStarted: () => boolean;
  spawn?: { x: number; z: number };
}

const createEngine = (opts: EngineOptions) => {
  const { canvas, onZoneChange, onGateCount, onToast, getStarted } = opts;

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(C.sky);
  scene.fog = new THREE.Fog(C.sky, 70, 170);

  const camera = new THREE.PerspectiveCamera(
    50,
    window.innerWidth / window.innerHeight,
    0.1,
    400,
  );

  const hemi = new THREE.HemisphereLight(0xfff2e0, 0xd8bd92, 0.95);
  scene.add(hemi);
  const sun = new THREE.DirectionalLight(0xffe3b0, 1.35);
  sun.position.set(60, 80, 20);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  sun.shadow.camera.left = -110;
  sun.shadow.camera.right = 110;
  sun.shadow.camera.top = 110;
  sun.shadow.camera.bottom = -110;
  sun.shadow.camera.far = 260;
  sun.shadow.bias = -0.0004;
  scene.add(sun);

  const mats = new Map<number, THREE.MeshLambertMaterial>();
  const mat = (color: number) => {
    let m = mats.get(color);
    if (!m) {
      m = new THREE.MeshLambertMaterial({ color, flatShading: true });
      mats.set(color, m);
    }
    return m;
  };
  const box = (w: number, h: number, d: number, color: number) => {
    const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat(color));
    m.castShadow = true;
    m.receiveShadow = true;
    return m;
  };
  const cyl = (
    rT: number,
    rB: number,
    h: number,
    color: number,
    seg = 10,
  ) => {
    const m = new THREE.Mesh(
      new THREE.CylinderGeometry(rT, rB, h, seg),
      mat(color),
    );
    m.castShadow = true;
    m.receiveShadow = true;
    return m;
  };
  const cone = (r: number, h: number, color: number, seg = 8) => {
    const m = new THREE.Mesh(new THREE.ConeGeometry(r, h, seg), mat(color));
    m.castShadow = true;
    m.receiveShadow = true;
    return m;
  };
  const labelSprite = (
    text: string,
    fg = "#35312c",
    bg = "rgba(250,243,226,0.95)",
  ) => {
    const cv = document.createElement("canvas");
    cv.width = 1024;
    cv.height = 224;
    const g = cv.getContext("2d");
    if (!g) return new THREE.Sprite();
    g.font = '800 118px -apple-system, Helvetica, Arial, sans-serif';
    const w = Math.min(980, g.measureText(text).width + 90);
    g.fillStyle = bg;
    const x = (1024 - w) / 2;
    const r = 48;
    g.beginPath();
    (g as CanvasRenderingContext2D).roundRect(x, 24, w, 176, r);
    g.fill();
    g.strokeStyle = fg;
    g.lineWidth = 10;
    g.stroke();
    g.fillStyle = fg;
    g.textAlign = "center";
    g.textBaseline = "middle";
    g.fillText(text, 512, 118);
    const tex = new THREE.CanvasTexture(cv);
    tex.anisotropy = 4;
    const sp = new THREE.Sprite(
      new THREE.SpriteMaterial({ map: tex, transparent: true }),
    );
    sp.scale.set(11, 2.4, 1);
    return sp;
  };

  const WORLD_R = 100;
  const ground = new THREE.Mesh(
    new THREE.CircleGeometry(WORLD_R + 40, 64),
    mat(C.sand),
  );
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  scene.add(ground);

  const flatShape = (
    geo: THREE.BufferGeometry,
    color: number,
    x: number,
    z: number,
    rotY = 0,
  ) => {
    const m = new THREE.Mesh(geo, new THREE.MeshLambertMaterial({ color }));
    m.rotation.x = -Math.PI / 2;
    m.rotation.z = rotY;
    m.position.set(x, 0.02, z);
    m.receiveShadow = true;
    scene.add(m);
    return m;
  };
  flatShape(new THREE.CircleGeometry(14, 48), C.road, 0, 0);
  for (const zz of ZONES) {
    const len = Math.hypot(zz.x, zz.z);
    const geo = new THREE.PlaneGeometry(3.4, len);
    flatShape(geo, C.road, zz.x / 2, zz.z / 2, Math.atan2(zz.x, zz.z));
  }

  const solids: Solid[] = [];
  const solid = (x: number, z: number, r: number) => solids.push({ x, z, r });

  const addZoneLabel = (zone: Zone, y: number) => {
    const sp = labelSprite(zone.name.toUpperCase());
    sp.position.set(zone.x, y, zone.z);
    scene.add(sp);
  };

  // Work — stepped office tower with mustard sign
  {
    const g = new THREE.Group();
    const prim = new THREE.Group();
    const z = ZONES[0];
    const a = box(10, 7, 10, C.teal);
    a.position.y = 3.5;
    prim.add(a);
    const b = box(7.5, 5.5, 7.5, C.pine);
    b.position.y = 9.7;
    prim.add(b);
    const c2 = box(5, 4.5, 5, C.teal);
    c2.position.y = 14.6;
    prim.add(c2);
    const sign = box(6.4, 2.2, 0.5, C.mustard);
    sign.position.set(0, 8.2, 5.2);
    prim.add(sign);
    for (let i = 0; i < 3; i++) {
      const win = box(0.9, 0.9, 0.2, C.cream);
      win.position.set(-2.8 + i * 2.8, 4.2, 5.05);
      prim.add(win);
    }
    g.position.set(z.x, 0, z.z);
    scene.add(g);
    swapOnLoad({ key: "zone-work", parent: g, primitive: prim });
    solid(z.x, z.z, 8.5);
    addZoneLabel(z, 19.5);
  }
  // Play — striped big top + blocks
  {
    const g = new THREE.Group();
    const prim = new THREE.Group();
    const z = ZONES[1];
    const base = cyl(6.5, 7, 5.5, C.cream, 12);
    base.position.y = 2.75;
    prim.add(base);
    const top = cone(7.4, 5.5, C.terracotta, 12);
    top.position.y = 8.2;
    prim.add(top);
    const flagPole = cyl(0.12, 0.12, 3, C.ink, 6);
    flagPole.position.y = 12;
    prim.add(flagPole);
    const flag = box(1.8, 1, 0.1, C.mustard);
    flag.position.set(1, 12.8, 0);
    prim.add(flag);
    g.position.set(z.x, 0, z.z);
    scene.add(g);
    swapOnLoad({ key: "zone-play", parent: g, primitive: prim });
    solid(z.x, z.z, 8);
    addZoneLabel(z, 15.5);
  }
  // Flash Arcade — cabinet-shaped building with marquee
  {
    const g = new THREE.Group();
    const prim = new THREE.Group();
    const z = ZONES[2];
    const body = box(9, 8, 7, C.ink);
    body.position.y = 4;
    prim.add(body);
    const marquee = box(9.6, 2, 7.4, C.terracotta);
    marquee.position.y = 8.9;
    prim.add(marquee);
    const screen = box(6.5, 4, 0.3, C.mustard);
    screen.position.set(0, 5, 3.6);
    prim.add(screen);
    const joy2 = cyl(0.3, 0.3, 1.6, C.cream, 8);
    joy2.position.set(-1.5, 2, 3.8);
    joy2.rotation.x = 0.5;
    prim.add(joy2);
    g.position.set(z.x, 0, z.z);
    scene.add(g);
    swapOnLoad({ key: "zone-flash", parent: g, primitive: prim });
    solid(z.x, z.z, 7.5);
    addZoneLabel(z, 12.8);
  }
  // Writing — giant pencil + stack of paper
  {
    const g = new THREE.Group();
    const prim = new THREE.Group();
    const z = ZONES[3];
    for (let i = 0; i < 4; i++) {
      const sheet = box(8 - i * 0.6, 0.8, 6 - i * 0.4, C.cream);
      sheet.position.y = 0.4 + i * 0.8;
      sheet.rotation.y = (i % 2 ? 1 : -1) * 0.12;
      prim.add(sheet);
    }
    const pencil = new THREE.Group();
    const shaft = cyl(0.55, 0.55, 9, C.mustard, 6);
    shaft.position.y = 4.5;
    pencil.add(shaft);
    const tip = cone(0.55, 1.6, C.sand, 6);
    tip.position.y = -0.8;
    tip.rotation.x = Math.PI;
    pencil.add(tip);
    const lead = cone(0.2, 0.55, C.ink, 6);
    lead.position.y = -1.35;
    lead.rotation.x = Math.PI;
    pencil.add(lead);
    const eraser = cyl(0.55, 0.55, 0.9, C.blush, 6);
    eraser.position.y = 9.4;
    pencil.add(eraser);
    pencil.position.set(2.4, 3.4, 0);
    pencil.rotation.z = -0.45;
    prim.add(pencil);
    g.position.set(z.x, 0, z.z);
    scene.add(g);
    swapOnLoad({ key: "zone-writing", parent: g, primitive: prim });
    solid(z.x, z.z, 6.5);
    addZoneLabel(z, 13);
  }
  // Archive — columned museum
  {
    const g = new THREE.Group();
    const prim = new THREE.Group();
    const z = ZONES[4];
    const steps = box(14, 1, 10, C.cream);
    steps.position.y = 0.5;
    prim.add(steps);
    for (let i = 0; i < 5; i++) {
      const col = cyl(0.7, 0.8, 6, C.cream, 10);
      col.position.set(-5.2 + i * 2.6, 4, 3.4);
      prim.add(col);
    }
    const attic = box(14.5, 1.4, 10.4, C.sand);
    attic.position.y = 7.6;
    prim.add(attic);
    const ped = cone(8.2, 3, C.terracotta, 4);
    ped.position.y = 9.6;
    ped.rotation.y = Math.PI / 4;
    prim.add(ped);
    g.position.set(z.x, 0, z.z);
    scene.add(g);
    swapOnLoad({ key: "zone-archive", parent: g, primitive: prim });
    solid(z.x, z.z, 9);
    addZoneLabel(z, 14.5);
  }
  // Post Office — mailbox on a post
  {
    const g = new THREE.Group();
    const prim = new THREE.Group();
    const z = ZONES[5];
    const post = cyl(0.5, 0.6, 5, C.ink, 8);
    post.position.y = 2.5;
    prim.add(post);
    const bodyB = box(6, 4, 4.4, C.terracotta);
    bodyB.position.y = 7;
    prim.add(bodyB);
    const roof = new THREE.Mesh(
      new THREE.CylinderGeometry(2.2, 2.2, 6, 16, 1, false, 0, Math.PI),
      mat(C.terracotta),
    );
    roof.rotation.z = Math.PI / 2;
    roof.position.y = 9;
    roof.castShadow = true;
    prim.add(roof);
    const slot = box(3.4, 0.5, 0.3, C.ink);
    slot.position.set(0, 7.4, 2.3);
    prim.add(slot);
    const flagM = box(0.4, 2, 0.25, C.mustard);
    flagM.position.set(3.2, 9.4, 0);
    prim.add(flagM);
    g.position.set(z.x, 0, z.z);
    scene.add(g);
    swapOnLoad({ key: "zone-post", parent: g, primitive: prim });
    solid(z.x, z.z, 5);
    addZoneLabel(z, 13.5);
  }
  // Airfield — tower, helipad, wind sock
  {
    const g = new THREE.Group();
    const prim = new THREE.Group();
    const z = ZONES[6];
    const pad = cyl(6, 6, 0.4, C.ink, 24);
    pad.position.y = 0.2;
    prim.add(pad);
    const hRing = cyl(5.2, 5.2, 0.42, C.mustard, 24);
    hRing.position.y = 0.21;
    prim.add(hRing);
    const hPad = cyl(4.4, 4.4, 0.44, C.ink, 24);
    hPad.position.y = 0.22;
    prim.add(hPad);
    const tower = cyl(1, 1.3, 9, C.cream, 8);
    tower.position.set(-8, 4.5, -4);
    prim.add(tower);
    const cab = box(3.4, 2.2, 3.4, C.teal);
    cab.position.set(-8, 10, -4);
    prim.add(cab);
    const sockPole = cyl(0.12, 0.12, 5, C.ink, 6);
    sockPole.position.set(7, 2.5, -6);
    prim.add(sockPole);
    const sock = cone(0.7, 2.4, C.terracotta, 8);
    sock.position.set(8.2, 4.6, -6);
    sock.rotation.z = Math.PI / 2;
    prim.add(sock);
    g.position.set(z.x, 0, z.z);
    scene.add(g);
    swapOnLoad({ key: "zone-airfield", parent: g, primitive: prim });
    solid(z.x - 8, z.z - 4, 2.4);
    addZoneLabel(z, 14);
  }

  let seed = 7;
  const rnd = () => {
    seed = (seed * 16807) % 2147483647;
    return seed / 2147483647;
  };

  for (let i = 0; i < 46; i++) {
    const a = rnd() * Math.PI * 2;
    const d = 22 + rnd() * (WORLD_R - 26);
    const x = Math.cos(a) * d;
    const z = Math.sin(a) * d;
    if (ZONES.some((zz) => Math.hypot(zz.x - x, zz.z - z) < 14)) continue;
    if (rnd() < 0.7) {
      const t = new THREE.Group();
      const prim = new THREE.Group();
      const trunk = cyl(0.3, 0.4, 1.6 + rnd(), 0x8a5a3b, 6);
      trunk.position.y = 0.9;
      prim.add(trunk);
      const h = 2.2 + rnd() * 2.4;
      const crown = cone(
        1.4 + rnd() * 0.9,
        h,
        rnd() < 0.5 ? C.teal : C.pine,
        7,
      );
      crown.position.y = 1.6 + h / 2;
      prim.add(crown);
      t.position.set(x, 0, z);
      t.rotation.y = rnd() * 6.28;
      scene.add(t);
      swapOnLoad({ key: "trees", parent: t, primitive: prim });
      solid(x, z, 1.1);
    } else {
      const rGroup = new THREE.Group();
      const prim = new THREE.Group();
      const r = new THREE.Mesh(
        new THREE.DodecahedronGeometry(0.7 + rnd() * 1.1, 0),
        mat(C.cream),
      );
      r.castShadow = true;
      r.receiveShadow = true;
      r.position.y = 0.4;
      r.rotation.set(rnd(), rnd(), rnd());
      prim.add(r);
      rGroup.position.set(x, 0, z);
      scene.add(rGroup);
      swapOnLoad({ key: "rocks", parent: rGroup, primitive: prim });
      solid(x, z, 1.2);
    }
  }

  const props: Prop[] = [];
  const addProp = (
    group: THREE.Group,
    x: number,
    z: number,
    upH: number,
    r: number,
  ) => {
    group.position.set(x, upH, z);
    scene.add(group);
    props.push({
      g: group,
      v: new THREE.Vector3(),
      w: new THREE.Vector3(),
      r,
      restY: Math.min(upH, r * 0.8),
      asleep: true,
    });
  };

  const letterGroup = (ch: string, color: number) => {
    const rows = FONT[ch];
    const s = 0.62;
    const g = new THREE.Group();
    const wCells = rows[0].length;
    for (let r = 0; r < 5; r++) {
      for (let c = 0; c < wCells; c++) {
        if (rows[r][c] !== "#") continue;
        const b = box(s, s, s, color);
        b.position.set(
          (c - (wCells - 1) / 2) * s,
          (4 - r - 2) * s,
          0,
        );
        g.add(b);
      }
    }
    return { g, w: wCells * s };
  };
  const spellRow = (
    word: string,
    zPos: number,
    colors: number[],
    modelKey: string,
  ) => {
    const parts = word
      .split("")
      .map((ch, i) => letterGroup(ch, colors[i % colors.length]));
    const gap = 0.75;
    const total =
      parts.reduce((s2, p) => s2 + p.w, 0) + gap * (parts.length - 1);
    let cx = -total / 2;
    const letterGroups: THREE.Group[] = [];
    for (const p of parts) {
      addProp(p.g, cx + p.w / 2, zPos, 1.65, 1.6);
      letterGroups.push(p.g);
      cx += p.w + gap;
    }
    const wordParent = new THREE.Group();
    wordParent.position.set(0, 1.65, zPos);
    scene.add(wordParent);
    const proxy = new THREE.Group();
    swapOnLoad({
      key: modelKey,
      parent: wordParent,
      primitive: proxy,
      onLoaded: () => {
        for (const g of letterGroups) g.visible = false;
      },
    });
  };
  spellRow(
    "LACY",
    -12,
    [C.terracotta, C.teal, C.mustard, C.terracotta],
    "letters-lacy",
  );
  spellRow(
    "MORROW",
    -18,
    [C.teal, C.mustard, C.terracotta, C.teal, C.mustard, C.terracotta],
    "letters-morrow",
  );

  for (let i = 0; i < 8; i++) {
    const k = cone(0.55, 1.5, i % 2 ? C.terracotta : C.mustard, 8);
    const g = new THREE.Group();
    g.add(k);
    addProp(g, -6 + i * 1.9, 12 + (i % 2) * 2.2, 0.75, 0.75);
  }
  for (let i = 0; i < 5; i++) {
    const b = new THREE.Mesh(
      new THREE.IcosahedronGeometry(0.9, 1),
      mat([C.terracotta, C.teal, C.mustard, C.blush, C.cream][i]),
    );
    b.castShadow = true;
    const g = new THREE.Group();
    g.add(b);
    addProp(g, 42 + (i % 3) * 2.4, -14 + Math.floor(i / 3) * 2.6, 0.9, 0.95);
  }
  for (let i = 0; i < 6; i++) {
    const d = box(1.6, 3, 0.4, i % 2 ? C.cream : C.blush);
    const g = new THREE.Group();
    g.add(d);
    addProp(g, -5 + i * 2, -44 + i * 1.2, 1.5, 1.3);
  }

  const gates: Gate[] = [];
  {
    const zA = ZONES[6];
    const pts: Array<[number, number]> = [
      [-22, 18],
      [-12, 8],
      [0, 2],
      [12, 8],
      [22, 18],
    ];
    pts.forEach(([dx, dz], i) => {
      const g = new THREE.Group();
      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(2.6, 0.32, 10, 24),
        mat(i % 2 ? C.terracotta : C.mustard),
      );
      ring.castShadow = true;
      ring.position.y = 3.4;
      g.add(ring);
      const leg1 = cyl(0.16, 0.16, 3.4, C.ink, 6);
      leg1.position.set(-2.6, 1.7, 0);
      g.add(leg1);
      const leg2 = cyl(0.16, 0.16, 3.4, C.ink, 6);
      leg2.position.set(2.6, 1.7, 0);
      g.add(leg2);
      const prev = i ? pts[i - 1] : [dx, dz - 8];
      const yaw =
        Math.atan2(-(dz - prev[1]), dx - prev[0] || 1) + Math.PI / 2;
      g.rotation.y = yaw;
      g.position.set(zA.x + dx, 0, zA.z + dz);
      scene.add(g);
      gates.push({
        x: zA.x + dx,
        z: zA.z + dz,
        yaw,
        passed: false,
        lastSide: 0,
        ring,
      });
    });
  }

  const drone = new THREE.Group();
  {
    const bodyPrim = new THREE.Group();
    const body = box(1.5, 0.55, 1.9, C.teal);
    bodyPrim.add(body);
    const canopy = box(0.9, 0.4, 0.8, C.pine);
    canopy.position.set(0, 0.45, -0.15);
    bodyPrim.add(canopy);
    const lens = cyl(0.22, 0.22, 0.3, C.terracotta, 8);
    lens.rotation.x = Math.PI / 2;
    lens.position.set(0, 0.15, -1.05);
    bodyPrim.add(lens);
    const batt = box(0.7, 0.3, 1.1, C.ink);
    batt.position.y = -0.42;
    bodyPrim.add(batt);
    swapOnLoad({ key: "drone-body", parent: drone, primitive: bodyPrim });
  }
  const rotors: THREE.Mesh[] = [];
  const armPositions: Array<[number, number]> = [
    [-1.05, -1.05],
    [1.05, -1.05],
    [-1.05, 1.05],
    [1.05, 1.05],
  ];
  armPositions.forEach(([ax, az]) => {
    const arm = box(0.22, 0.14, 1.15, C.ink);
    arm.position.set(ax * 0.72, 0.05, az * 0.72);
    arm.rotation.y = Math.atan2(ax, az);
    drone.add(arm);
    const rot = cyl(0.85, 0.85, 0.07, C.cream, 12);
    rot.material = new THREE.MeshLambertMaterial({
      color: C.cream,
      transparent: true,
      opacity: 0.85,
    });
    rot.position.set(ax, 0.24, az);
    drone.add(rot);
    rotors.push(rot);
  });
  drone.position.set(0, 1.7, 8);
  scene.add(drone);

  const D = {
    pos: drone.position,
    vel: new THREE.Vector3(),
    yaw: Math.PI,
    r: 1.35,
    hover: 1.7,
    accel: 30,
    maxSp: 19,
    drag: 2.0,
    yawRate: 2.7,
  };

  if (opts.spawn) {
    D.pos.x = opts.spawn.x;
    D.pos.z = opts.spawn.z;
  }

  const resetDrone = () => {
    D.pos.set(0, D.hover, 8);
    D.vel.set(0, 0, 0);
    D.yaw = Math.PI;
  };

  const keys: Record<string, boolean> = {};
  const joy = { x: 0, y: 0, active: false };
  let activeZone: Zone | null = null;
  let gateCount = 0;

  const setZone = (zz: Zone | null) => {
    if (zz === activeZone) return;
    activeZone = zz;
    onZoneChange(zz);
  };

  const clock = new THREE.Clock();
  const camPos = new THREE.Vector3(-16, 20, 26);
  const camAim = new THREE.Vector3(0, 0, 0);
  const tmpV = new THREE.Vector3();

  const update = (dt: number) => {
    const started = getStarted();
    let thrust = 0;
    let steer = 0;
    if (started) {
      if (keys["KeyW"] || keys["ArrowUp"]) thrust += 1;
      if (keys["KeyS"] || keys["ArrowDown"]) thrust -= 0.7;
      if (keys["KeyA"] || keys["ArrowLeft"]) steer += 1;
      if (keys["KeyD"] || keys["ArrowRight"]) steer -= 1;
      if (joy.active) {
        thrust += -joy.y;
        steer += -joy.x;
      }
    }
    D.yaw += steer * D.yawRate * dt * (thrust < 0 ? -1 : 1);
    const fx = Math.sin(D.yaw);
    const fz = Math.cos(D.yaw);
    D.vel.x += fx * thrust * D.accel * dt;
    D.vel.z += fz * thrust * D.accel * dt;
    const damp = Math.exp(-D.drag * dt);
    D.vel.x *= damp;
    D.vel.z *= damp;
    const sp = Math.hypot(D.vel.x, D.vel.z);
    if (sp > D.maxSp) {
      D.vel.x *= D.maxSp / sp;
      D.vel.z *= D.maxSp / sp;
    }
    D.pos.x += D.vel.x * dt;
    D.pos.z += D.vel.z * dt;

    const dC = Math.hypot(D.pos.x, D.pos.z);
    if (dC > WORLD_R) {
      D.pos.x *= WORLD_R / dC;
      D.pos.z *= WORLD_R / dC;
      const nx = D.pos.x / WORLD_R;
      const nz = D.pos.z / WORLD_R;
      const dot = D.vel.x * nx + D.vel.z * nz;
      if (dot > 0) {
        D.vel.x -= nx * dot;
        D.vel.z -= nz * dot;
      }
    }
    for (const s of solids) {
      const dx = D.pos.x - s.x;
      const dz = D.pos.z - s.z;
      const d = Math.hypot(dx, dz);
      const minD = s.r + D.r;
      if (d < minD && d > 0.001) {
        const nx = dx / d;
        const nz = dz / d;
        D.pos.x = s.x + nx * minD;
        D.pos.z = s.z + nz * minD;
        const dot = D.vel.x * nx + D.vel.z * nz;
        if (dot < 0) {
          D.vel.x -= nx * dot * 1.4;
          D.vel.z -= nz * dot * 1.4;
        }
      }
    }

    const t = clock.elapsedTime;
    D.pos.y = D.hover + Math.sin(t * 2.2) * 0.08;
    drone.rotation.y = D.yaw;
    const fwdSp = D.vel.x * fx + D.vel.z * fz;
    drone.rotation.x = THREE.MathUtils.lerp(
      drone.rotation.x,
      THREE.MathUtils.clamp(fwdSp * 0.028, -0.5, 0.5),
      0.12,
    );
    drone.rotation.z = THREE.MathUtils.lerp(
      drone.rotation.z,
      THREE.MathUtils.clamp(steer * Math.min(1, sp / 6) * 0.45, -0.6, 0.6),
      0.1,
    );
    for (const r of rotors) r.rotation.y += dt * (26 + sp * 2);

    for (const p of props) {
      const dx = p.g.position.x - D.pos.x;
      const dz = p.g.position.z - D.pos.z;
      const d = Math.hypot(dx, dz);
      if (d < p.r + D.r && sp > 2.5) {
        const nx = dx / (d || 1);
        const nz = dz / (d || 1);
        const kick = 0.55 * sp;
        p.v.x += nx * kick + D.vel.x * 0.45;
        p.v.z += nz * kick + D.vel.z * 0.45;
        p.v.y += kick * 0.42;
        p.w.set(
          (rnd() - 0.5) * kick * 1.6,
          (rnd() - 0.5) * kick,
          (rnd() - 0.5) * kick * 1.6,
        );
        p.asleep = false;
        D.vel.x *= 0.82;
        D.vel.z *= 0.82;
      }
      if (p.asleep) continue;
      p.v.y -= 26 * dt;
      p.g.position.addScaledVector(p.v, dt);
      if (p.w.lengthSq() > 0.0001) {
        const ax = tmpV.copy(p.w).normalize();
        p.g.rotateOnWorldAxis(ax, p.w.length() * dt);
      }
      if (p.g.position.y < p.restY) {
        p.g.position.y = p.restY;
        if (Math.abs(p.v.y) > 1.6) p.v.y = -p.v.y * 0.32;
        else p.v.y = 0;
        p.v.x *= 0.86;
        p.v.z *= 0.86;
        p.w.multiplyScalar(0.82);
        if (p.v.lengthSq() < 0.02 && p.w.lengthSq() < 0.02) {
          p.asleep = true;
          p.v.set(0, 0, 0);
          p.w.set(0, 0, 0);
        }
      }
      const pd = Math.hypot(p.g.position.x, p.g.position.z);
      if (pd > WORLD_R) {
        p.g.position.x *= WORLD_R / pd;
        p.g.position.z *= WORLD_R / pd;
        p.v.x *= -0.4;
        p.v.z *= -0.4;
      }
    }

    for (const gGate of gates) {
      const relX = D.pos.x - gGate.x;
      const relZ = D.pos.z - gGate.z;
      const nx = Math.sin(gGate.yaw);
      const nz = Math.cos(gGate.yaw);
      const side = Math.sign(relX * nx + relZ * nz);
      const lat = Math.abs(relX * nz - relZ * nx);
      const dist = Math.hypot(relX, relZ);
      if (
        gGate.lastSide !== 0 &&
        side !== 0 &&
        side !== gGate.lastSide &&
        lat < 2.4 &&
        dist < 3.4 &&
        !gGate.passed
      ) {
        gGate.passed = true;
        gateCount++;
        gGate.ring.material = mat(C.teal);
        onGateCount(gateCount, gates.length);
        if (gateCount >= gates.length) {
          onToast(
            "🏁 CLEAN RUN! Unlocked: the drone reel on /work — nice flying.",
            4000,
          );
        } else {
          onToast(`Gate ${gateCount} / ${gates.length}`);
        }
      }
      if (dist > 3.6) gGate.lastSide = side;
      else if (gGate.lastSide === 0) gGate.lastSide = side;
    }

    let best: Zone | null = null;
    let bestD = 1e9;
    for (const zz of ZONES) {
      const d = Math.hypot(zz.x - D.pos.x, zz.z - D.pos.z);
      if (d < 13 && d < bestD) {
        best = zz;
        bestD = d;
      }
    }
    if (started) setZone(best);

    const wantPos = started
      ? tmpV.set(D.pos.x - 10, 23, D.pos.z + 12)
      : tmpV.set(Math.sin(t * 0.08) * 30, 24, Math.cos(t * 0.08) * 30 + 6);
    camPos.lerp(wantPos, started ? 0.06 : 0.02);
    camera.position.copy(camPos);
    camAim.lerp(
      started ? D.pos : new THREE.Vector3(0, 1, -12),
      0.08,
    );
    camera.lookAt(camAim);
  };

  const onResize = () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  };
  window.addEventListener("resize", onResize);

  renderer.setAnimationLoop(() => {
    const dt = Math.min(clock.getDelta(), 0.05);
    update(dt);
    renderer.render(scene, camera);
  });

  return {
    setKey(code: string, down: boolean) {
      keys[code] = down;
    },
    setJoystick(x: number, y: number, active: boolean) {
      joy.x = x;
      joy.y = y;
      joy.active = active;
    },
    getActiveZone: () => activeZone,
    reset: resetDrone,
    destroy() {
      renderer.setAnimationLoop(null);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      mats.forEach((m) => m.dispose());
      scene.traverse((obj) => {
        const anyObj = obj as THREE.Mesh;
        if (anyObj.geometry) anyObj.geometry.dispose?.();
      });
    },
  };
};

interface GameProps {
  spawn?: { x: number; z: number };
  autoStart?: boolean;
}

export const Game = ({ spawn, autoStart }: GameProps) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const stickRef = useRef<HTMLDivElement | null>(null);
  const knobRef = useRef<HTMLDivElement | null>(null);
  const engineRef = useRef<ReturnType<typeof createEngine> | null>(null);
  const router = useRouter();
  const [started, setStarted] = useState<boolean>(!!autoStart);
  const startedRef = useRef(started);
  const [zone, setZone] = useState<Zone | null>(null);
  const zoneRef = useRef<Zone | null>(null);
  const [gateHud, setGateHud] = useState<{ count: number; total: number } | null>(null);
  const [toast, setToast] = useState<string>("");
  const toastTimer = useRef<number | null>(null);

  useEffect(() => {
    startedRef.current = started;
  }, [started]);
  useEffect(() => {
    zoneRef.current = zone;
  }, [zone]);

  useEffect(() => {
    if (!canvasRef.current) return;
    const engine = createEngine({
      canvas: canvasRef.current,
      spawn,
      onZoneChange: setZone,
      onGateCount: (count, total) => setGateHud({ count, total }),
      onToast: (msg, ms = 1800) => {
        setToast(msg);
        if (toastTimer.current) window.clearTimeout(toastTimer.current);
        toastTimer.current = window.setTimeout(() => setToast(""), ms);
      },
      onStart: () => setStarted(true),
      getStarted: () => startedRef.current,
    });
    engineRef.current = engine;
    return () => {
      engine.destroy();
      engineRef.current = null;
      if (toastTimer.current) window.clearTimeout(toastTimer.current);
    };
  }, [spawn]);

  const enterActive = () => {
    const z = zoneRef.current;
    if (!z) return;
    router.push(z.route);
  };

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLElement &&
        ["INPUT", "TEXTAREA", "SELECT"].includes(e.target.tagName)
      ) {
        return;
      }
      engineRef.current?.setKey(e.code, true);
      if (e.code === "Enter" && !startedRef.current) {
        setStarted(true);
        return;
      }
      if ((e.code === "Enter" || e.code === "KeyE") && startedRef.current) {
        enterActive();
      }
      if (e.code === "KeyR") engineRef.current?.reset();
    };
    const onKeyUp = (e: KeyboardEvent) => {
      engineRef.current?.setKey(e.code, false);
    };
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, [router]);

  useEffect(() => {
    const stick = stickRef.current;
    const knob = knobRef.current;
    if (!stick || !knob) return;
    const handle = (e: TouchEvent) => {
      const t = e.touches[0];
      const rect = stick.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      let dx = (t.clientX - cx) / (rect.width / 2);
      let dy = (t.clientY - cy) / (rect.height / 2);
      const len = Math.hypot(dx, dy);
      if (len > 1) {
        dx /= len;
        dy /= len;
      }
      engineRef.current?.setJoystick(dx, dy, true);
      knob.style.transform = `translate(calc(-50% + ${dx * 33}px), calc(-50% + ${dy * 33}px))`;
      e.preventDefault();
    };
    const end = () => {
      engineRef.current?.setJoystick(0, 0, false);
      knob.style.transform = "translate(-50%,-50%)";
    };
    stick.addEventListener("touchstart", handle, { passive: false });
    stick.addEventListener("touchmove", handle, { passive: false });
    stick.addEventListener("touchend", end);
    return () => {
      stick.removeEventListener("touchstart", handle);
      stick.removeEventListener("touchmove", handle);
      stick.removeEventListener("touchend", end);
    };
  }, []);

  return (
    <div
      className="fixed inset-0 z-30"
      style={{ background: "#f3e2c8", color: "#35312c" }}
    >
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        style={{ display: "block", width: "100%", height: "100%" }}
      />

      {!started && (
        <div
          role="dialog"
          aria-label="Start screen"
          onClick={() => setStarted(true)}
          className="fixed inset-0 z-40 flex cursor-pointer flex-col items-center justify-center gap-4 text-center"
          style={{
            background:
              "radial-gradient(ellipse at 50% 40%, rgba(250,243,226,0), rgba(243,226,200,0.55))",
          }}
        >
          <div
            className="text-xs font-medium uppercase tracking-[0.12em]"
            style={{ color: "#1f6e66" }}
          >
            Developer · Designer · Drone Pilot
          </div>
          <h1
            className="text-5xl font-extrabold leading-[0.95] sm:text-6xl md:text-8xl"
            style={{
              letterSpacing: "0.04em",
              color: "#35312c",
              textShadow: "0 3px 0 rgba(205,95,56,0.35)",
            }}
          >
            LACY
            <br />
            MORROW
          </h1>
          <button
            type="button"
            className="mt-3 rounded-full px-6 py-3 text-sm font-bold tracking-[0.08em]"
            style={{ background: "#35312c", color: "#faf3e2" }}
            onClick={(e) => {
              e.stopPropagation();
              setStarted(true);
            }}
          >
            PRESS ENTER TO FLY
          </button>
          <div className="text-xs opacity-70">
            <b>W A S D</b> / arrows to fly · <b>E</b> to enter buildings ·{" "}
            <b>R</b> reset · knock stuff over
          </div>
        </div>
      )}

      <div
        className="fixed left-4 top-4 z-20 text-sm font-extrabold tracking-[0.06em]"
        style={{ color: "#35312c" }}
      >
        LACY MORROW
        <small
          className="block text-[10px] font-medium tracking-[0.14em]"
          style={{ color: "#1f6e66" }}
        >
          PORTFOLIO
        </small>
      </div>

      <div
        className="fixed right-4 top-4 z-20 hidden text-right text-xs leading-6 md:block"
        style={{ color: "rgba(53,49,44,0.75)" }}
      >
        <span className="rounded border px-1.5 py-0.5 font-bold" style={{ background: "#faf3e2", borderColor: "rgba(53,49,44,0.25)" }}>WASD</span>{" "}
        fly ·{" "}
        <span className="rounded border px-1.5 py-0.5 font-bold" style={{ background: "#faf3e2", borderColor: "rgba(53,49,44,0.25)" }}>E</span>{" "}
        enter ·{" "}
        <span className="rounded border px-1.5 py-0.5 font-bold" style={{ background: "#faf3e2", borderColor: "rgba(53,49,44,0.25)" }}>R</span>{" "}
        reset
      </div>

      {gateHud && (
        <div
          className="fixed right-4 top-[74px] z-20 rounded-lg border-2 px-3 py-1 text-sm font-bold"
          style={{ background: "#faf3e2", borderColor: "#1f6e66", color: "#1f6e66" }}
        >
          ⬡ Gates {gateHud.count} / {gateHud.total}
        </div>
      )}

      {zone && (
        <div
          role="status"
          className="fixed bottom-24 left-1/2 z-25 w-[min(430px,calc(100vw-32px))] -translate-x-1/2 rounded-2xl border-2 p-4 shadow-[0_10px_0_rgba(53,49,44,0.18)]"
          style={{ background: "#faf3e2", borderColor: "#35312c", color: "#35312c" }}
        >
          <h3 className="text-lg font-extrabold tracking-[0.02em]">{zone.name}</h3>
          <p className="mt-1 text-xs leading-6" style={{ color: "rgba(53,49,44,0.8)" }}>
            {zone.desc}
          </p>
          <div className="mt-2 flex items-center justify-between gap-2">
            <span
              className="rounded-md px-2 py-1 font-mono text-xs"
              style={{ background: "#35312c", color: "#faf3e2" }}
            >
              router.push(&apos;{zone.route}&apos;)
            </span>
            <button
              type="button"
              onClick={enterActive}
              className="whitespace-nowrap rounded-full border-2 px-3 py-1 text-xs font-bold"
              style={{ borderColor: "#cd5f38", color: "#cd5f38" }}
            >
              Enter ⏎
            </button>
          </div>
        </div>
      )}

      {toast && (
        <div
          className="fixed left-1/2 top-[84px] z-26 -translate-x-1/2 rounded-full px-5 py-2 text-sm font-bold"
          style={{ background: "#35312c", color: "#faf3e2", letterSpacing: "0.04em" }}
        >
          {toast}
        </div>
      )}

      <nav
        aria-label="Site navigation (always available)"
        className="fixed bottom-4 left-1/2 z-40 flex max-w-[calc(100vw-24px)] -translate-x-1/2 flex-wrap justify-center gap-1 rounded-full border px-2 py-1 backdrop-blur"
        style={{ background: "rgba(250,243,226,0.92)", borderColor: "rgba(53,49,44,0.35)" }}
      >
        {NAV_LINKS.map((n) => (
          <a
            key={n.href}
            href={n.href}
            onClick={(e) => {
              e.preventDefault();
              router.push(n.href);
            }}
            className="rounded-full px-3 py-1 text-xs font-semibold hover:bg-[#35312c] hover:text-[#faf3e2]"
            style={{ color: "#35312c" }}
          >
            {n.label}
          </a>
        ))}
      </nav>

      <div
        ref={stickRef}
        className="fixed bottom-24 left-6 z-30 h-32 w-32 rounded-full border-2 md:hidden"
        style={{
          borderColor: "rgba(53,49,44,0.35)",
          background: "rgba(250,243,226,0.55)",
          touchAction: "none",
        }}
      >
        <div
          ref={knobRef}
          className="absolute left-1/2 top-1/2 h-14 w-14 -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{ background: "#35312c" }}
        />
      </div>
    </div>
  );
};
