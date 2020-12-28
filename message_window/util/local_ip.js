function getLocalIp() {
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
          return address;
      }
   }
  }


module.exports = {
    getLocalIp
};