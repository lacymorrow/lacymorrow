// Via https://stackoverflow.com/questions/1068834/object-comparison-in-javascript
// Works when you have simple JSON - style objects without methods and DOM nodes inside.
// The ORDER of the properties IS IMPORTANT, so this method will return false for following objects:

export const deepCompare = (obj1: object, obj2: object) => JSON.stringify(obj1) === JSON.stringify(obj2)

