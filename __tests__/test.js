import microFps from '../src/index';

describe(`my first test`, () => {
  it(`must return a function`, () => {
    function cb(){}
    const fpsTick = microFps(cb);
    expect(fpsTick).toBeDefined();
  });
});
