const path = require('path');


const opts = {
    WEB: true,
    NODE: false,
    version: 3,
    "ifdef-verbose": true, // add this for verbose output
    //"ifdef-triple-slash": false // add this to use double slash comment instead of default triple slash
};


const webConfig = {
    target: 'web',
    //target: 'es5',
    mode: 'development',
    devtool: 'source-map',  
    entry: './src/index.tsx',
    externals: {
        '@tuval/core':'tuval$core',
        '@tuval/forms':'tuval$forms'
    },
    module: {
        rules: [
            /*  {
               test: /\.js$/,
               use: ['babel-loader', 'webpack-conditional-loader']
             }, */
            {
                test: /\.tsx?$/,
                use: [
                    { loader: "ts-loader", options: { configFile: 'web.tsconfig.json' } },
                    { loader: "ifdef-loader", options: opts }
                ],
                exclude: /node_modules/,

            },
            {
                test: /\.(wasm|eot|woff|woff2|svg|ttf)([\?]?.*)$/,
                type: 'javascript/auto',
                loader: 'arraybuffer-loader',
            },
            {
                test: /\.css$/,
                use: ['to-string-loader', 'css-loader']
            },
            {
                test: /\.s[ac]ss$/i,
                use: [
                    // Creates `style` nodes from JS strings
                    "style-loader",
                    // Translates CSS into CommonJS
                    "css-loader",
                    // Compiles Sass to CSS
                    "sass-loader",
                ],
            },
            {
                test: /\.(png|jpg|gif)$/i,
                use: [{
                    loader: 'url-loader',
                    options: {
                        limit: 8192
                    }
                }]
            },
            /* {
                test: /\.(woff|woff2|eot|ttf|otf)$/,
                use: [
                    'file-loader'
                ]
            } */
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
        fallback: {
            child_process: false,
            fs: false,
            crypto: false,
            net: false,
            tls: false,
            ws: false,
            os: false,
            path: false
        }
    },
    output: {
        filename: 'index.js',
        path: path.resolve(__dirname, 'dist_web'),
    },
    plugins: [
        // new BundleAnalyzerPlugin(),
    ]
};

module.exports = [webConfig /* webClientConfig */ /* umdConfig */ /* , umdWebProcess */ ];