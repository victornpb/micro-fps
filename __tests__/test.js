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

    expect(() => {
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
  it('Should be 50fps on the 3rd frame, refresh rate set to 0', () => {
    expect.assertions(1);

    mockPerf.timestamp = 1E8;

    const FPS = 50;
    const FRAMEDURATION = 1000 / FPS;

    const fpsTick = microFps((info) => {
      expect(info.fps).toBe(FPS);
      // done();
    }, 0);


    fpsTick();
    mockPerf.timestamp += FRAMEDURATION; // increment timestamp
    fpsTick();
    mockPerf.timestamp += FRAMEDURATION; // increment timestamp
    fpsTick();
  });


  it(`should be 50fps after 100 frames`, () => {
    expect.assertions(2);

    mockPerf.timestamp = 1E5;

    const FPS = 50;
    const DURATION = 2000;
    const FRAMEDURATION = 1000 / FPS;
    let i = 0;
    const fpsTick = microFps((info) => {
      if (i+1 < (DURATION / FRAMEDURATION)) return;
      expect(info.fps).toBeGreaterThanOrEqual(FPS - 1);
      expect(info.fps).toBeLessThanOrEqual(FPS + 1);
      // done();
    }, 0);

    for (i = 0; i < (DURATION / FRAMEDURATION); i++) {
      fpsTick();
      mockPerf.timestamp += FRAMEDURATION; // increment timestamp
    }
  });


  it(`should invoke callback the correct number of times (refreshRate=0)`, () => {
    const mockCallback = jest.fn();
    // expect.assertions(1);

    mockPerf.timestamp = 1E5;

    const FPS = 60;
    const DURATION = 5000;
    const FRAMEDURATION = 1000 / FPS;
    const REFRESH_RATE = 0;

    const fpsTick = microFps(mockCallback, REFRESH_RATE);

    let ticks = 0;
    let i = 0;
    for (i = 0; i < DURATION; i += FRAMEDURATION) {
      fpsTick();
      mockPerf.timestamp += FRAMEDURATION; // increment timestamp
      ticks++;
    }
    expect(mockCallback).toHaveBeenCalledTimes(ticks-2);
  });


  it(`should invoke callback the correct number of times (with a refreshRate)`, () => {
    const mockCallback = jest.fn();
    expect.assertions(1);

    mockPerf.timestamp = 1E5;

    const FPS = 60;
    const DURATION = 5000;
    const FRAMEDURATION = 1000 / FPS;
    const REFRESH_RATE = 7;

    const fpsTick = microFps(mockCallback, REFRESH_RATE);
    
    let ticks = 0;
    let i = 0;
    for (i = 0; i < DURATION; i += FRAMEDURATION) {
      fpsTick();
      mockPerf.timestamp += FRAMEDURATION; // increment timestamp
      ticks++;
    }
    
    expect(mockCallback).toHaveBeenCalledTimes((DURATION / (1000/REFRESH_RATE))-1);
  });


  // it(`should be 50fps after 100 frames with 10fps refresh`, () => {
  //   expect.assertions(2);

  //   mockPerf.timestamp = 1E5;

  //   const FPS = 50;
  //   const DURATION = 5000;
  //   const FRAMEDURATION = 1000 / FPS;

  //   let i = 0;
  //   const fpsTick = microFps((info) => {
  //     if (i <= DURATION) {
  //       expect(info.fps).toBeGreaterThanOrEqual(FPS - 1);
  //       expect(info.fps).toBeLessThanOrEqual(FPS + 1);
  //       // done();
  //     }
  //   }, 4);

  //   for (i = 0; i <= DURATION; i += FRAMEDURATION) {
  //     fpsTick();
  //     mockPerf.timestamp += FRAMEDURATION; // increment timestamp
  //   }
  // });
  
});


