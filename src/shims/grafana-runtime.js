// Enhanced mock implementation of @grafana/runtime
const Runtime = {
  getBackendSrv: () => ({
    get: async (url) => {
      // Mock data for server details
      if (url && url.includes("/servers/")) {
        const serverId = url.split("/").pop()
        return {
          id: serverId,
          name: `Server-${serverId}`,
          ipAddress: `192.168.1.${serverId}`,
          model: "PowerEdge R750",
          type: "Compute",
          status: "normal",
          managedState: "Managed",
          identifier: `SRV-${serverId}`,
          generation: "Gen10",
          managementController: "iLO5",
          summary: {
            serialNumber: `SN-${serverId}123456`,
            manufacturer: "Dell",
            location: "Datacenter 1",
            rackPosition: "Rack 3, U5",
            assetTag: `ASSET-${serverId}`,
            biosVersion: "2.4.0",
            lastUpdated: new Date().toISOString(),
          },
          processors: [
            {
              id: "CPU-1",
              model: "Intel Xeon Gold 6330",
              manufacturer: "Intel",
              cores: 28,
              threads: 56,
              speed: "2.0GHz",
              status: "OK",
            },
          ],
          memory: [
            {
              id: "DIMM-A1",
              location: "DIMM A1",
              capacity: "32GB",
              type: "DDR4",
              speed: "3200MHz",
              status: "OK",
            },
            {
              id: "DIMM-A2",
              location: "DIMM A2",
              capacity: "32GB",
              type: "DDR4",
              speed: "3200MHz",
              status: "OK",
            },
          ],
          storage: [
            {
              id: "DISK-1",
              type: "SSD",
              model: "Samsung PM883",
              capacity: "1.92TB",
              interface: "SATA",
              status: "OK",
            },
          ],
          network: [
            {
              id: "NIC-1",
              macAddress: "00:11:22:33:44:55",
              type: "10GbE",
              speed: "10 Gbps",
              status: "OK",
              ipAddresses: ["192.168.1.100", "192.168.2.100"],
            },
          ],
        }
      }

      // Default empty response
      return {}
    },
    post: async () => ({}),
    put: async () => ({}),
    delete: async () => ({}),
  }),
}

module.exports = Runtime
