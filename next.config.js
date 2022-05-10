module.exports = {
  async headers() {
    return [
      {
        source: '/api/schedule',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' }
        ]
      }
    ]
  }
}