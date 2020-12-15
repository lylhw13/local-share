// var
//     // Local ip address that we're trying to calculate
//     address
//     // Provides a few basic operating-system related utility functions (built-in)
//     ,os = require('os')
//     // Network interfaces
//     ,ifaces = os.networkInterfaces();


// // Iterate over interfaces ...
// for (var dev in ifaces) {

//     // console.log(ifaces[dev])

//     // ... and find the one that matches the criteria
//     var iface = ifaces[dev].filter(function(details) {
//         return details.family === 'IPv4' && details.internal === false && !details.mac.startsWith("00:50:56");
//     });

//     if(iface.length > 0) address = iface[0].address;
//     // console.log(address)
// }

// // Print the result
// console.log(address);

var address;
var ifaces = require("os").networkInterfaces();
for (var dev in ifaces) {
    var iface = ifaces[dev].filter((details) => {
        return (
            details.family === "IPv4" &&
            details.internal === false &&
            !details.mac.startsWith("00:50:56")
        );
    });

    if (iface.length > 0) {
        address = iface[0].address;
        break;
    }
}