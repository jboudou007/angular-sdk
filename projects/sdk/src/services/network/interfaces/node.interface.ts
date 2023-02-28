/**
 * Node interface
 * @interface Node
 * @property {string} operator - The name of the node operator
 * @property {string} publicKey - The public key of the node
 * @property {string} url - The url of the node
 */
export interface Node {
  /**
   * The name of the node operator
   * @type {string}
   */
  operator: string,

  /**
   * The public key of the node
   * @type {string}
   */
  publicKey: string,

  /**
   * The url of the node
   * @type {string}
   */
  url: string
}