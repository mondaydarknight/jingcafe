'use strict';
const path = require('../../../path');
const webpack = require('../../../webpack');
const ExtractTextPlugin = require('../../../extract-text-webpack-plugin');

console.log(path);

// const extractSass = new ExtractTextPlugin({
// 	filename: 'bundle.css'
// });

// module.exports = {
// 	entry: "./src/app/module.js",
// 	devtool: 'source-map',
// 	output: {
// 		path: path.resolve(__dirname, 'public/minified'),
// 		filename: "bundle.js",
// 		publicPath: 'http://cdn.example.com/[hash]/'
// 	},
// 	module: {
// 		rules: [
// 			 {
//                 test: /\.css$/, 
//                 loader: ExtractTextPlugin.extract({
//                    fallback: 'style-loader',
//                    use: [
//                     	{ 
//                       		loader: 'css-loader'
//                      	}
//                    ]
//                  })
//             },
// 			{
// 				test: /\.scss$/,
// 				loader: ExtractTextPlugin.extract({
//                    fallback: 'style-loader',
//                    use: [
//                     	'css-loader',
//                     	'sass-loader'
//                    ]
//                  })
// 			},
// 			{
//          		test: /.(ttf|otf|eot|svg|woff(2)?)(\?[a-z0-9]+)?$/,
//          		use: [{
//            		loader: 'file-loader',
//            			options: {
// 	             		name: '[name].[ext]',
// 	             		outputPath: '../fonts/',    // where the fonts will go
// 	             		publicPath: '../'       // override the default path
//            			}
//          		}]
//        		},
//        		{
// 				test: /\.js$/,
// 				exclude: /node_modules/,
// 				loader: "babel-loader",
// 				query: {
// 					presets: ['es2015']
// 				}
// 			},
// 			{
// 				test: /\.jpg$/,
// 				use: [
// 					'file-loader'
// 				]
// 			},
// 			{
// 				test: /\.png$/,
// 				use: [
// 					'url-loader?mimetype=image/png'
// 				]
// 			},
// 			{
// 				test: /\.html$/,
// 				use: [
// 					{
// 						loader: 'html-loader',
// 						options: {
// 							attrs: [':data-src']
// 							// minimize: true
// 						}
// 					}
// 				]
// 			}
// 			// {
// 			// 	test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
//   	// 			loader: 'url?limit=10000',
// 			// }
// 			// {
// 			// 	test: /\.woff(\?v=\d+\.\d+\.\d+)?$/,
//    //    			loader: "url?limit=10000&mimetype=application/font-woff"
// 			// },
// 			// {
// 			// 	test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/,
//    //    			loader: "url?limit=10000&mimetype=application/font-woff"
// 			// },
// 			// {
// 			// 	test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
//    //    			loader: "url?limit=10000&mimetype=application/octet-stream"
// 			// },
// 			// {
// 			// 	test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
//    //    			loader: "file"
// 			// },
// 			// {
// 			// 	test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
//    //    			loader: "url?limit=10000&mimetype=image/svg+xml"
// 			// }
// 		]
// 	},
// 	plugins: [
// 		// new webpack.optimize.CommonsChunkPlugin('vendors', 'vendors.js'),
// 		new webpack.ProvidePlugin({'window.jQuery': 'jquery'}),
// 		new ExtractTextPlugin('bundle.css')
// 	]
// };