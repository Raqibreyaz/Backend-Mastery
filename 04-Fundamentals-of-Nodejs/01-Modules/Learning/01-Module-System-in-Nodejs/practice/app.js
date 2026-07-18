/*
- var is function scoped so only function block can limit it
- const,let is limited to any block
- nodejs wraps each file in a module wrapper, so variables and functions declared at top level are present in module scope not global
*/

// module scope
var x = 42;
const val = 32;

console.log();

// module scope
function fn() {
  // block scope
  const val = 32;
}
fn();

{
  // block scope
  const y = 45;

  // module scope
  var z = 54;
}

console.log();
