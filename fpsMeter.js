/**
 * This callback is displayed as a global member.
 * @callback fpsCallback
 * @param {number} fps The current frames per second
 * @this {Object} this Object containig other values, like average jitter, timestamps, etc
 */



/**
 * FPS Meter - Returns a function that is used to compute the framerate without the overhead of updating the DOM every frame.
 * @author Victor B - www.vitim.us
 * @param {callback} fpsCallback Function called on every DOM update
 * @param {number} refresh Updates per second of the DOM
 * @param {element} elm DOM Element to write the framerate
 * @return {function} Returns a function that will be called inside the loop
 */
function fpsMeter(fpsCallback, refresh, elm){
    //var elm;             //element
    //var refresh;         //refresh every x seconds
    
    var frameCount = 0,    //number of frames since last computation
        trigger = 1;       //compute frame rate every `x` frames (calculated on the go)
    
    var prev = 0; //previous timestamp
    
    var prevFps = 0; //previous fps value
    var jitter = 0;  //computed jitter (exp avg)
    
    return function(){
        if(++frameCount > trigger){
            
            var now = Date.now();
            if(prev===0) prev = now;
            var elapsed = now - prev;
            
            if(elapsed>0){
                //compute fps
                var fps = (1000/(elapsed/frameCount))<<0;
                
                //compute jitter
                jitter = (jitter+Math.abs(prevFps-fps))/2;
                
                //move the trigger value exponentialy to match the current refresh rate.
                trigger = ((trigger*0.5)+((fps*refresh)*0.5))<<0;
                
                //dispatch callback
                if(fpsCallback){
                    fpsCallback.call({ 
                        fps: fps,
                        jitter: jitter,
                        now: now,
                        previousTimestamp: prev,
                        elapsed: elapsed,
                        frameCount: frameCount,
                        triggerRate: trigger,  
                    }, fps);
                }
                if(elm) elm.innerHTML = fps;
                
                prev = now;
                prevFps = fps;
                frameCount = 0;
                
                return true;
            }
            else{
                trigger *= 2;                
            }
        }
    }
}

/* Example
    
    var f = fpsMeter(null, 4, fpsDiv);
    
    //or
    
    var f = fpsMeter(function(fps){
        
        console.log("FPS:"+this.fps+" Jitter:"+this.jitter);
        
        fpsDiv.innerHTML = fps;
    }, 4);
    
    
    //game loop
    setInterval(function(){
    
        f();
        //do stuff
    
    }, 1);
*/
