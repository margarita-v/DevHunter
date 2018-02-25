/**
 * Helpful function which checks if the object has a properties which passed to args
 */
export function expectProperties(object, props) {
    props.forEach((prop) => expect(object).toHaveProperty(prop));
}