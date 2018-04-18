import microFps from '../src/index';

/**
 * Mocking performance.now() method
 * @class MockPerformanceNow
 */
class MockPerformanceNow {
  constructor() {
    const self = this;

    this._original = global.performance;
    this.timestamp = 1E8;

    global.performance = {
      now() {
        return self.timestamp;
      },
    };
  }
  restore() {
    global.performance = this._original;
  }
}

const mockPerf = new MockPerformanceNow();

describe('validation', () => {

  it(`should require a callback`, () => {
    expect(() => {
      microFps();
    }).toThrowError();
  });


  it(`should require refresh rate to be a number`, () => {
    const mockCallback = jest.fn();

    expect(microFps(mockCallback)).toBeTruthy();
    expect(microFps(mockCallback), 1).toBeTruthy();
    expect(microFps(mockCallback), 0).toBeTruthy();
    expect(microFps(mockCallback), 10).toBeTruthy();
    expect(microFps(mockCallback), 0.5).toBeTruthy();

    expect(() => {
      microFps(mockCallback, -1);
    }).toThrowError();

    expect(() => {      const mockCallback = jest.fn();
      microFps(mockCallback, NaN);
    }).toThrowError();

    expect(() => {
      microFps(mockCallback, null);
    }).toThrowError();

    expect(() => {
      microFps(mockCallback, {});
    }).toThrowError();

    expect(() => {
      microFps(mockCallback, Infinity);
    }).toThrowError();

    expect(() => {
      microFps(mockCallback, -Infinity);
    }).toThrowError();

    expect(() => {
      microFps(mockCallback, "foo");
    }).toThrowError();
  });
});

describe('fps calculation', () => {
  it('Should be 50fps on the 3rd frame, refresh rate set to 0', (done) => {
    expect.assertions(1);

    mockPerf.timestamp = 1E8;

    const FPS = 50;
    const FRAMEDURATION = 1000 / FPS;

    const fpsTick = microFps((info) => {
      expect(info.fps).toBe(FPS);
      done();
    }, 0);


    fpsTick();
    mockPerf.timestamp += FRAMEDURATION; // increment in 20ms (50fps)
    fpsTick();
    mockPerf.timestamp += FRAMEDURATION; // increment in 20ms (50fps)
    fpsTick();
  });

  // it(`should be 50fps`, (done) => {
  //   mockPerf.timestamp = 1;

  //   const fpsTick = microFps((info) => {
  //     expect(info.fps).toEqual(50);
  //     done();
  //   }, 0);

  //   fpsTick();
  //   mockPerf.timestamp = 1000/50;
  //   fpsTick();
  // });


  // it(`should be 50fps 2`, (done) => {
  //   expect.assertions(1);

  //   mockPerf.timestamp = 1E5;

  //   const FPS = 50;
  //   const DURATION = 2000;
  //   const FRAMEDURATION = 1000 / FPS;

  //   const fpsTick = microFps((info) => {
  //     // if (mockPerf.timestamp < 1000) return;
  //     // expect(info.fps).toBeGreaterThanOrEqual(FPS - 1);
  //     // expect(info.fps).toBeLessThanOrEqual(FPS + 1);

  //     // done();
  //   }, 0);


  //   for (let i = 0; i < (DURATION / FRAMEDURATION); i++) {
  //     fpsTick();
  //     mockPerf.timestamp += FRAMEDURATION; // increment in 20ms (50fps)
  //     console.log(mockPerf.timestamp);
  //   }
  // });


  
});


