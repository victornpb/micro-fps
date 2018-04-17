fpsMeter
========

A super lightweight fps meter, with near zero overhead.

createFpsMeter is a function factory, it returns a new meter.



Usage example

    const REFRESH_RATE = 2; //update twice a second
    
    const fpsTick = createFpsMeter(info=>{
	    fps_div.innerHTML = info.fps.toFixed(2);
	    console.log(info);
    }, REFRESH_RATE);
    
    
Then call the returned function on every frame of your loop    
    
    //game loop
    setInterval(function loop(){
        fpsTick();
        
        //do stuff
    
    }, 1000/60);
    
 
Callback info object

| property | type    | description                                           |
|----------|---------|-------------------------------------------------------|
| fps      | number  | The calculated frames per second                      |
| jitter   | number  | The absolute difference since the last calculated fps |
| elapsed  | number  | Milliseconds ellapsed since the last computation      |
| frames   | integer | Number of frames since the last computation           |
| trigger  | number  | Next computation will happen at this amount of frames |
