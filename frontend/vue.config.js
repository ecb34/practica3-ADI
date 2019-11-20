module.exports = {
  "outputDir": "D:\\Software\\ADI\\practica3\\public",
  "devServer": {
    "proxy": {
      "/api": {
        "target": "http://localhost:3000"
      }
    }
  },
  "transpileDependencies": [
    "vuetify"
  ],
  configureWebpack: {
    devtool: 'source-map'
  }
}