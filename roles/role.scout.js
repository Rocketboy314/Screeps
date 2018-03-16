/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.scout');
 * mod.thing == 'a thing'; // true
 */

module.exports = {
    run: function(creep) {
        if (creep.room.name == "E54N3") {
            if (creep.moveTo(Game.flags["ExtraResources1"], {visualPathStyle: {stroke: '#555555', opacity: '1.0'}}) == ERR_NO_PATH) {
                return;
            };
        }
    }
};