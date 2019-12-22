module.exports = function (api) {
  api.cache(true);

  const presets = [
    [ "module:metro-react-native-babel-preset" ]
  ];

  const plugins = [
    [ 
      "rewrite-require", 
      {
        aliases: {
          path: 'path-browserify',
          joi: 'joi-react-native',
        }
      }
    ],
    [
     "@babel/plugin-proposal-decorators",
      {
        "legacy": true
      }
    ]
  ];

  return { presets, plugins }
}
