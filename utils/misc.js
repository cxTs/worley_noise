/**
* @description : return a random integer in range [min, max]
*
* @param {NUMBER} min : minimum value of the range
* @param {NUMBER} min : maximum value of the range
* @return {NUMBER} : a random integer
*
**/
function getRandom(min, max) {
    if(max == null) {
		max = min;
		min = 0;
	}
        min = Math.ceil(min);
        max = max | 0; // binary OR operator is faster than Math.floor() function
        return ((Math.random() * (max - min + 1)) | 0) + min;
}
/**
* @description : return a random float in range [min, max]
*
* @param {NUMBER} min : minimum value of the range
* @param {NUMBER} min : maximum value of the range
* @return {NUMBER} : a random float
*
**/
function getRandomFloat(min, max) {
    if(max == null) {
		max = min;
		min = 0;
	}
        return (Math.random() * (max - min)) + min;
}

/**
* @description : create a random color formated as rgba(x, x, x, x)
*
* @param {NUMBER} min : minimum value of the range
* @param {NUMBER} min : maximum value of the range
* @param {NUMBER} alpha : value of the alpha to apply. (default at 1)
* @return {STRING} : return a random color with r, g and b in [min, max]
*
**/
function getRandomColor(min, max, alpha) {
    min = (min == null) ? 0 : min;
    max = (max == null) ? 255 : max;
    let r = getRandom(min, max);
    let g = getRandom(min, max);
    let b = getRandom(min, max);
    if(alpha != null && alpha >= 0 && alpha <= 1) {
        return "rgba(" + r + ", " + g + ", " + b + ", " + alpha + ")";
    }
    return "rgba(" + r + ", " + g + ", " + b + ", 1)";
}

/**
* @description : constrains a given number in [low, high] range
*
* @param {NUMBER} n : the value to constrain
* @param {NUMBER} low : the min value of the range
* @param {NUMBER} high : the max value of the range
* @return {NUMBER} : a number in [min, max]
*
**/
function constrain(n, low, high) {
    return Math.max(Math.min(n, high), low);
}

/**
* @description : map a value from a range to another
*
* @param {NUMBER} value : value to map in a new range
* @param {NUMBER} currentMin : min of the actual range the value is in
* @param {NUMBER} currentMax : mmax of the actual range the value is in
* @param {NUMBER} newMin : new min of the range you wnat the value to be in
* @param {NUMBER} newMax : new max of the range you wnat the value to be in
* @return {NUMBER} a new value in the given new range respecting the ratio its add beside the previous range
*
**/
function map(value, currentMin, currentMax, newMin, newMax) {
    let currentRange = currentMax - currentMin;
    let newRange = newMax - newMin;
    let ratio = newRange / currentRange;
    if(ratio < 0)
        ratio *= -1;
    return value * ratio;
}


//
//
/**
* @description : calculate prime numbers
*
* @param {NUMBER} nbOfPrimesWanted : the amount of prime numbers you wnat in the returned array
* @return {ARRAY} return an array of "nbOfPrimesWanted" prime numbers
*
**/
function getPrime(nbOfPrimesWanted) {
    // ERATOSTHENE'S SIEVE STYLE

    // the indexes of the array represent the eventually prime numbers
    // i.e an array of lenght 10 gives prime numbers up to length-1, so 9


    // init array with one true
    let ar = [true];
    // setting length to nbOfPrimesWanted
    ar.length = nbOfPrimesWanted + 1;
    // getting nbOfPrimesWanted true values filled array
    ar.fill(true);
    // 0 and 1 out for prime calculus
    ar[0] = false;
    ar[1] = false;
    // first known prime number is 2
    let n = 2;

    do {
        /*
        if the ar[n] is true, it's a prime number (function initialized with n = 2),
        the following ar[n + n] will be set to false, they are not prime numbers
        n is incremented by 1, and process restart while n * n < nbOfPrimesWanted,
        i.e ar.length - 1;
        */
        if(ar[n]) {
            for(let i = n + n; i < ar.length; i += n ) {
                ar[i] = false;
            }
        }
        n++;
    } while((n * n) < ar.length - 1);
    return ar;
}
