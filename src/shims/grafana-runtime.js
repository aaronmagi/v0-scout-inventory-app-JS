// Mock implementation of @grafana/runtime
const Runtime = {
  getBackendSrv: () => ({
    get: async () => ({}),
    post: async () => ({}),
    put: async () => ({}),
    delete: async () => ({}),
  }),
}

module.exports = Runtime
