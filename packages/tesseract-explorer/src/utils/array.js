export const filterActive = item => item.active;

export const countActive = (sum, item) => sum + (item.active ? 1 : 0);

export function toggleFromArray(haystack, needle) {
  const haystackClone = haystack.slice();
  const index = haystackClone.indexOf(needle);
  if (index > -1) {
    haystackClone.splice(index, 1);
  }
  else {
    haystackClone.push(needle);
  }
  return haystackClone;
}

export function removeFromArray(haystack, needle) {
  const haystackClone = haystack.slice();
  const index = haystackClone.indexOf(needle);
  if (index > -1) {
    haystackClone.splice(index, 1);
  }
  return haystackClone;
}
