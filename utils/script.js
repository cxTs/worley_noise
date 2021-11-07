/**
* @description : Script base for canvas project.
*                Called by window.requestAniamtionFrame(), draw the entire animation on canvas
* @param {VOID}
* @return {VOID}
*
**/
function draw() {
    clear();



    if(!__paused) {
        window.requestAnimationFrame(draw);
    }
}
window.requestAnimationFrame(draw);
