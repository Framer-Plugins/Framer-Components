const path = require("path");

module.exports = {
  mode: "development",
  entry: "./src/main.tsx",
  output: {
    filename: "ZqFramerComponents.js",
    path: path.resolve(__dirname, "dist"),
    library: "ZqFramerComponents",
    libraryTarget: "window",
  },
  module: {
    rules: [
      {
        test: /\.(js|ts)x?$/,
        exclude: /node_modules/,
        use: "babel-loader",
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  resolve: {
    extensions: [".js", ".jsx", ".ts", ".tsx"],
  },
  /* externals: {
    react: "React",
    "react-dom": "ReactDOM",
  }, */
};
