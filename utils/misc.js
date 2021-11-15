function getRandom(min, max) {
    if(max == null) {
		max = min;
		min = 0;
	}
        min = Math.ceil(min);
        max = max | 0; // binary OR operator is faster than Math.floor() function
        return ((Math.random() * (max - min + 1)) | 0) + min;
}

function getRandomFloat(min, max) {
    if(max == null) {
		max = min;
		min = 0;
	}
        return (Math.random() * (max - min)) + min;
}

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

function constrain(n, low, high) {
    return Math.max(Math.min(n, high), low);
}

function map(value, currentMin, currentMax, newMin, newMax) {
    let currentRange = currentMax - currentMin;
    let newRange = newMax - newMin;
    let ratio = newRange / currentRange;
    if(ratio < 0)
        ratio *= -1;
    return value * ratio;
}


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
