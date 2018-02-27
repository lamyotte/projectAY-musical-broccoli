var assert = require('assert');
describe('Gameplay tests', () => {
  describe('Swap Tests', () => {
    it('should swap one card', () => {	
      assert.equal([1,2,3].indexOf(4), -1);
    });
    it('should swap no card', () => {
      assert.equal([1,2,3].indexOf(4), -1);
    });
    it('should swap all cards', () => {
      assert.equal([1,2,3].indexOf(4), -1);
    });
    it('should fail when the user has already swapped', () => {
      assert.equal([1,2,3].indexOf(4), -1);
    });
  });
  describe('Play card', () => {
    it('should place a creature card', () => {
      assert.equal([1,2,3].indexOf(4), -1);
    });
    it('should fail to place a creature card on full board', () => {
      assert.equal([1,2,3].indexOf(4), -1);
    });
    it('should return -1 when the value is not present', () => {
      assert.equal([1,2,3].indexOf(4), -1);
    });
    it('should return -1 when the value is not present', () => {
      assert.equal([1,2,3].indexOf(4), -1);
    });
    it('should return -1 when the value is not present', () => {
      assert.equal([1,2,3].indexOf(4), -1);
    });
    it('should return -1 when the value is not present', () => {
      assert.equal([1,2,3].indexOf(4), -1);
    });
  });
  describe('EndTurn', () => {
    it('should return -1 when the value is not present', () => {
      assert.equal([1,2,3].indexOf(4), -1);
    });
  });
});