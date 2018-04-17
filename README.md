fpsMeter
========

#### A super lightweight fps meter, with near zero overhead.

createFpsMeter is a function factory, it returns a new meter.
A function with closure variables is cheaper than a class instance with public members.


## Usage example

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
| fps      | float   | The calculated frames per second                      |
| jitter   | float   | The absolute difference since the last calculated fps |
| elapsed  | float   | Milliseconds ellapsed since the last computation      |
| frames   | integer | Number of frames since the last computation           |
| trigger  | float   | Next computation will happen at this amount of frames |
