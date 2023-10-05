// via https://stackoverflow.com/questions/679915/how-do-i-test-for-an-empty-javascript-object
export default function isObjEmpty(o: object) { for (let k in o) return false; return true; }
