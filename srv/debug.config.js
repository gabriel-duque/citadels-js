import Debug from 'debug';

export default nameSpace => {

  // make sure nameSpace is 12 chars long
  nameSpace += ' '.repeat(20 - nameSpace.length);

  return Debug(`app:${nameSpace}`);
};