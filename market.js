/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('market');
 * mod.thing == 'a thing'; // true
 */

module.exports = {
    run: function () {
        var orders = Game.market.getAllOrders();
        for (var i=0; i<orders.length; i++) {
            if (orders[i].type === "sell") {
                orders.splice(i, 1);
                i--;
            } else if (!(orders[i].resourceType === "L" || orders[i].resourceType === "energy")) {
                orders.splice(i, 1);
                i--;
            }
        }
        var l_orders = [];
        var energy_orders = [];
        for (var i=0; i<orders.length; i++) {
            if (orders[i].resourceType === "L" && orders[i].price > 0.14)
                l_orders.push(orders[i]);
            else if (orders[i].resourceType === "energy" && orders[i].price > 0.05)
                energy_orders.push(orders[i]);
        }
        
        if (l_orders.length > 0) {
            l_orders.sort(function(a,b){
                return b.price - a.price;
            });
            //console.log("Highest L      Order: " + l_orders[0].price);
        }
        if (energy_orders.length > 0) {
            energy_orders.sort(function(a,b) {
                return b.price - a.price;
            })
            //console.log("Highest Energy Order: " + energy_orders[0].price);
            var order = energy_orders[0];
            var amount = order.amount > 300 ? 300 : order.amount;
            var cost = Game.market.calcTransactionCost(amount, "E59S26", order.roomName);
            if (order.price*amount - cost > order.price*amount * 0.01) {
                console.log("Available Offer: Amount: " + amount + " Cost: " + cost + " Profit: " + (amount-cost));
            } else {
                console.log("Bad Offer: Amount: " + amount + " Cost: " + cost + " Profit: " + (amount-cost));
            }
        }
        
    }
};