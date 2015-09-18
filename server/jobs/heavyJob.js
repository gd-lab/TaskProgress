var iterations = 0;
var maxIterations = 345;
var interval = null;

function startJob() {
    process.send(0);
    
    interval = setInterval(function() {
        iterations += Math.floor(Math.random()*10);
        if (iterations > maxIterations) {
            clearInterval(interval);
            iterations = 0;
            process.send(100);
        } else {
            process.send(Math.floor(100 / maxIterations * iterations));
        }
    }, 500);
}

startJob();