import ESLintPlugin from 'eslint-webpack-plugin';
import TerserPlugin from "terser-webpack-plugin";
import HtmlWebpackPlugin from "html-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import CssMinimizerPlugin from "css-minimizer-webpack-plugin";
import postCssNormalize from "postcss-normalize";
import postCssPresetEnv from "postcss-preset-env";
import { resolve } from 'path';

const babelLoader = {
	test: /\.js$/,
	exclude: /node_modules/,
	use: "babel-loader"
};

const ejsLoader = {
	test: /\.ejs$/,
	use: [{
		loader: "ejs-loader",
		options: {
			variable: 'locals',
			// esModule: false
		}
	}]
};

const cssLoaders = {
	test: /\.css$/,
	use: [{
		loader: MiniCssExtractPlugin.loader,
	},
	{
		loader: "css-loader",
		options: {
			importLoaders: 1
		}
	},
	{
		loader: "postcss-loader",
		options: {
			postcssOptions: {
				ident: "postcss",
				plugins: [
					postCssNormalize(),
					postCssPresetEnv({
						stage: 3,
						features: {
							"nesting-rules": true
						}
					})
				]
			}
		}
	}
	]
}

export default isDevMode => ({ input, output }) => ({

	target: "web",

	mode: isDevMode ? "development" : "production",

	watch: isDevMode,

	entry: `${input.folder}/${input.entry}`,

	resolve: {
		alias: getAliases(input)
	},

	output: {
		filename: output.js,
		path: output.folder,
		publicPath: output.publicPath || "/"
	},

	optimization: {
		minimize: !isDevMode,
		minimizer: [new TerserPlugin(), new CssMinimizerPlugin()],
	},

	module: {
		rules: [
			!isDevMode && babelLoader,
			ejsLoader,
			cssLoaders
		].filter(Boolean)
	},

	plugins: [

		isDevMode && new ESLintPlugin({
			emitWarning: true,
		}),

		output.css && new MiniCssExtractPlugin({
			filename: output.css,
		}),

		input.template && new HtmlWebpackPlugin({
			filename: output.html,
			inject: output.inject || true,
			template: `${input.folder}/${input.template}`,
		})

	].filter(Boolean),
});

function getAliases(input) {

	const output = {
		views: resolve("views"),
	}

	if (input.alias) {

		Object.entries(input.alias)
			.forEach(([key, value]) => {
				Object.assign(output, {
					[key]: `${input.folder}/${value}/`
				});
			});
	}

	return output
}