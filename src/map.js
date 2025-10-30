// VERY BAD CODE FROM FIRST MAP METHOD IDEA
let map = [
  [3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
  [3, 0, 0, 0, 0, 0, 0, 0, 0, 3],
  [3, 0, 0, 0, 0, 0, 0, 0, 0, 3],
  [3, 0, 1, 0, 0, 0, 0, 0, 0, 3],
  [3, 0, 3, 0, 0, 0, 0, 0, 0, 3],
  [3, 0, 0, 0, 0, 0, 0, 0, 0, 3],
  [3, 0, 0, 0, 0, 0, 2, 0, 0, 3],
  [3, 0, 0, 0, 0, 0, 0, 0, 0, 3],
  [3, 0, 0, 0, 0, 0, 0, 0, 0, 3],
  [3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
];

let curLocation, targetLocation;
for (let i = 0; i < map.length; i++) {
  for (let j = 0; j < map[i].length; j++) {
    if (map[i][j] === 1) {
      curLocation = [i, j];
      console.log("Current Location: ", curLocation);
    }
    if (map[i][j] === 2) {
      targetLocation = [i, j];
      console.log("Target Location: ", targetLocation);
    }
  }
}

var lastMove = "";
while (map[targetLocation[0]][targetLocation[1]] !== 1) {
  if (
    curLocation[0] < targetLocation[0] &&
    map[curLocation[0] + 1][curLocation[1]] !== 3
  ) {
    //move down
    map[curLocation[0] + 1][curLocation[1]] = 1;
    curLocation[0] += 1;
    lastMove = "down";
  } else if (
    curLocation[0] > targetLocation[0] &&
    map[curLocation[0] - 1][curLocation[1]] !== 3
  ) {
    //move up
    map[curLocation[0] - 1][curLocation[1]] = 1;
    curLocation[0] -= 1;
    lastMove = "up";
  } else if (
    curLocation[1] < targetLocation[1] &&
    map[curLocation[0]][curLocation[1] + 1] !== 3
  ) {
    //move right
    map[curLocation[0]][curLocation[1] + 1] = 1;
    curLocation[1] += 1;
    lastMove = "right";
  } else if (
    curLocation[1] > targetLocation[1] &&
    map[curLocation[0]][curLocation[1] - 1] !== 3
  ) {
    //move left
    map[curLocation[0]][curLocation[1] - 1] = 1;
    curLocation[1] -= 1;
    lastMove = "left";
  } else {
    //blocked, move any possible direction
    if (map[curLocation[0] + 1][curLocation[1]] !== 3 && lastMove !== "up") {
      //move down
      map[curLocation[0] + 1][curLocation[1]] = 1;
      curLocation[0] += 1;
      lastMove = "down";
    } else if (
      map[curLocation[0] - 1][curLocation[1]] !== 3 &&
      lastMove !== "down"
    ) {
      //move up
      map[curLocation[0] - 1][curLocation[1]] = 1;
      curLocation[0] -= 1;
      lastMove = "up";
    } else if (
      map[curLocation[0]][curLocation[1] + 1] !== 3 &&
      lastMove !== "left"
    ) {
      //move right
      map[curLocation[0]][curLocation[1] + 1] = 1;
      curLocation[1] += 1;
      lastMove = "right";
    } else if (
      map[curLocation[0]][curLocation[1] - 1] !== 3 &&
      lastMove !== "right"
    ) {
      //move left
      map[curLocation[0]][curLocation[1] - 1] = 1;
      curLocation[1] -= 1;
      lastMove = "left";
    } else {
      console.log("Something went very wrong");
      break;
    }
  }
}

for (let i = 0; i < map.length; i++) {
  for (let j = 0; j < map[i].length; j++) {
    process.stdout.write(map[i][j] + " ");
  }
  console.log();
}
