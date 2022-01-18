import Debug from 'debug';

Debug.selectColor = (name) => {

  const colors = [{
    "server": 1,
  }, {
    "lobby-room": 2,
  }, {
    "play-room": 14,
  }, {
    "room": 12,
  }, {
    "game": 5,
  }, {
    "session": 3,
  }]

  for (const colorSpace of colors) {

    const nameSpace = Object.keys(colorSpace)[0];
    
    if (!!name.match(`citadels:${nameSpace}`)) return colorSpace[nameSpace];
  }

  return 9;
};

export default nameSpace => {

  // make sure nameSpace is 12 chars long
  nameSpace += ' '.repeat(12 - nameSpace.length);

  return Debug(`citadels:${nameSpace}`);
};