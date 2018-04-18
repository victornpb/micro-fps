
/**
 * @typedef {function(FpsInfo)} fpsCallback
 * @callback fpsCallback
 * @param {FpsInfo} fps Fps info object
 */

/**
* @typedef {Object} FpsInfo
* @property {number} fps The calculated frames per second
* @property {number} jitter The absolute difference since the last calculated fps
* @property {number} elapsed Milliseconds ellapsed since the last computation
* @property {number} frames Number of frames since the last computation
* @property {number} trigger Next computation will happen at this amount of frames
*/

/**
 * FPS Meter - Returns a function that is used to compute the framerate without the overhead of updating the DOM every frame.
 * @param {fpsCallback} callback Callback fired every time the FPS is computed
 * @param {number} [refreshRate=1] Refresh rate which the fps is computed and the callback is fired (0 to compute every frame, not recommended)
 * @return {function} Returns a function that should be called on every the loop tick
 * @author Victor B - www.vitim.us - github.com/victornpb/fpsMeter
 */
export default function microFps(callback, refreshRate = 1) {
  if (typeof callback !== 'function') throw new Error('Callback is not a function');
  if (typeof refreshRate !== 'number' || isNaN(refreshRate) || refreshRate < 0 || refreshRate===Infinity) throw new Error('refreshRate should be a positive number! e.g. 2 (fps)');


  /** number of frames since last computation */
  let frames = -1;
  /** compute fps at this amount of frames (it will try to match the refresh rate) */
  let trigger = 0;

  /** previous timestamp */
  let lastTimestamp = undefined;

  /** last computed fps value */
  let lastFps = 0;
  /** computed jitter */
  let jitter = 0;

  // use performance.now() or fallback to Date.now() only check on initialization
  const millis = (typeof performance === 'object' && 'now' in performance) ? performance.now.bind(performance) : Date.now.bind(Date);

  return function fpsMeterTick() {
    if (frames >= trigger) {
      
      const now = millis();
      if (lastTimestamp === undefined) lastTimestamp = now;
      const elapsed = now - lastTimestamp;

      if (elapsed > 0) {
        // calculate fps
        const fps = frames>0 ? 1000 / (elapsed / frames) : 0;

        // calculate jitter
        jitter = Math.abs(lastFps - fps);

        if (refreshRate > 0) {
          // converge the trigger value exponentialy to match the current refresh rate.
          trigger = (trigger * 0.5) + ((fps / refreshRate) * 0.5);
          if (trigger < 0) trigger = 0;
        }
        else {
          trigger = 0;
        }
        
        const info = {
          fps: fps,
          jitter: jitter,
          elapsed: elapsed,
          frames: frames,
          trigger: trigger,
        };

        // reset variables for the next measurement
        lastTimestamp = now;
        lastFps = fps;
        frames = 0;

        callback(info);
      } else {
        // 2 frames on the same milliseconds, ramp the trigger up
        trigger *= 2;
      }
    }
    frames++;
  };
}
