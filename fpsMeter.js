/**
* FPS Meter
* @author Victor N - www.vitim.us
*
* @param {function} callback Function that will display the fps rate
* @param {number} refreshRate Defines the frequency the fps will be updated in ms
* @returns {function}
*/
function fpsMeter(callback, refreshRate){
    
    if(typeof callback!="function") throw new Error("callback must be a function");
    
    var compRate = 1;   //compute frame rate every x frames (calculated on the go)
    var frames = 0;     //number of frames since last timing
    var last = 0;       //used for timing
    refreshRate/=1000;
    
    return function(){
        if(++frames > compRate){
            var now = Date.now();
            var diff = now - last;
            
            if(diff>0){
                var fps = (1000/(diff/frames))<<0;
                last = now;
                frames = 0;
                
                //exponential ramp the next update to match the current refresh rate
                compRate = ((compRate*0.5)+((fps*refreshRate)*0.5));
                 
                var timestamp = now;
                var currentRefreshRate = diff;
                callback(fps, currentRefreshRate, timestamp, arguments);
            }
            else compRate*=2;
        }
    }
}
