/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.tower');
 * mod.thing == 'a thing'; // true
 */

module.exports = {
    run: function(tower) {
        var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        var status = -1;
        if(closestHostile) {
            status = (tower.attack(closestHostile));
            tower.room.memory.attackCooldown = 50;
            var pos = {
                x:closestHostile.pos.x,
                y:closestHostile.pos.y
            };
            new RoomVisual(tower.room.name).circle(pos.x,pos.y).line(pos.x-5,pos.y-5,pos.x+5,pos.y+5)
                    .line(pos.x-5,pos.y+5,pos.x+5,pos.y-5);
            new RoomVisual().text("Room " + tower.room.name + " is under attack by " + closestHostile.owner.username + "!", 1, 1, {align: 'left'});
        }
        
        var worstDamagedStructure = tower.room.find(FIND_STRUCTURES, {
            filter: (structure) => structure.hits < structure.hitsMax && (
                structure.structureType == STRUCTURE_ROAD ||
                structure.structureType == STRUCTURE_CONTAINER
                )
        });
        if (worstDamagedStructure.length == 0)
            return;
        worstDamagedStructure.sort(function(a,b) {
                    var road_mult_a = a.structureType == STRUCTURE_ROAD ? 50 : 1;
                    var road_mult_b = b.structureType == STRUCTURE_ROAD ? 50 : 1;
                    return (a.hits*road_mult_a)-(b.hits*road_mult_b);
                });
        if (status != 0)
            tower.repair(worstDamagedStructure[0]);
    }
};