/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.dying');
 * mod.thing == 'a thing'; // true
 */

module.exports = {
    run: function(creep) {
        var diePosition = new RoomPosition(24, 16, "E54N3");
        creep.moveTo(diePosition, {visualizePathStyle: {stroke: '#000000', opacity: '0.7'}});
        if (creep.pos.x == diePosition.x && creep.pos.y == diePosition.y)
            creep.room.memory.recycle = creep.id;
    }
};