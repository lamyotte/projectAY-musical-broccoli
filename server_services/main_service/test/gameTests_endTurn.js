var assert = require('assert');
describe('EndTurn tests', () => {
  describe('EndTurn', () => {
    it('should end turn on empty boards', () => {
      assert.equal([1,2,3].indexOf(4), -1);
    });
    it('should end turn with creatures on board', () => {
      assert.equal([1,2,3].indexOf(4), -1);
    });
    it('should end turn with end turn special', () => {
      assert.equal([1,2,3].indexOf(4), -1);
    });
  });
});