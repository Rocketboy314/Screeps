/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.soldier');
 * mod.thing == 'a thing'; // true
 */

var roleCarrier = require('role.carrier');

module.exports = {
    run: function(creep) {
        if (creep.memory.ticksToEnd == null) creep.memory.ticksToEnd = 0;
        if (creep.memory.ticksToEnd >= 200) creep.memory.role = 'dying';
        var closestHostile = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if(closestHostile) {
            if (creep.attack(closestHostile) == ERR_NOT_IN_RANGE) {
                creep.moveTo(closestHostile, {visualizePathStyle: {stroke: '#FF55FF', opacity: '1.0'}});
            }
            creep.memory.ticksToEnd = 0;
        } else {
            roleCarrier.run(creep);
            creep.memory.ticksToEnd++;
        }
    }
};