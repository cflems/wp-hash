/*
 *  Wrapper Function
 */
function wp_hash_password (str) {
  let randbytes = '';
  for (let i = 0; i < 6; i++)
    randbytes += String.fromCharCode(Math.floor(Math.random()*256));
  return hashwsalt(str, mksalt(randbytes));
}


/*
 *  Functional Body
 */
const itoa64 = './0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

function enc64 (str, count) {
  let output = '', i = 0;
  do {
    let value = str.charCodeAt(i++);
    output += itoa64[value & 0x3f];
    if (i < count) value |= str.charCodeAt(i) << 8;
    output += itoa64[(value >> 6) & 0x3f];
    if (i++ >= count) break;
    if (i < count) value |= str.charCodeAt(i) << 16;
    output += itoa64[(value >> 12) & 0x3f];
    if (i++ >= count) break;
    output += itoa64[(value >> 18) & 0x3f];
  } while (i < count);
  
  return output;
}

// Takes in 6 random bytes
function mksalt (rand) {
  return '$P$B' + enc64(rand, rand.length);
}

function hashwsalt (str, saltstr) {
  let output = (saltstr.substr(0, 2) == '*0') ? '*1' : '*0';
  let count = 1 << itoa64.indexOf(saltstr.charAt(3));
  let salt = saltstr.substr(4, 8);
  let hash = md52(salt + str);
  do {
    hash = md52(hash + str);
  } while (--count);

  return saltstr.substr(0, 12) + enc64(hash, 16);
}
