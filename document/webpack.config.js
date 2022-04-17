// Generated using webpack-cli https://github.com/webpack/webpack-cli

// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path');
/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require('fs');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const CopyPlugin = require('copy-webpack-plugin');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const tjs = require('typescript-json-schema');

const isProduction = process.env.NODE_ENV === 'production';
const sourceDirectory = path.resolve(__dirname, 'src');
const destinationDirectory = path.resolve(__dirname, 'dist');

const config = {
  entry: './src/index.ts',
  output: {
    path: destinationDirectory,
    filename: 'index.js',
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/i,
        loader: 'ts-loader',
        exclude: ['/node_modules/'],
      },
    ],
  },
  // 処理中でfsを使用できるように
  target: 'node',
  resolve: {
    // axiosを使用する関係上、jsファイルも含めている
    extensions: ['.tsx', '.ts', '.js'],
    // Javascriptファイル内での「@」の解決を行うための記述
    alias: {
      '@': sourceDirectory,
      fs: false,
    },
  },
};

module.exports = () => {
  config.mode = isProduction ? 'production' : 'development';

  createJsonSchema();

  // 静的ファイルのコピー
  const copyConfigs = [
    {
      from: path.resolve(sourceDirectory, 'appConfigs.json'),
      to: path.resolve(destinationDirectory, 'appConfigs.json'),
    },
  ];

  if (!isProduction) {
    const sampleDirectory = path.resolve(sourceDirectory, 'sample');
    copyConfigs.push({
      from: path.resolve(sampleDirectory, 'googleMessage.txt'),
      to: path.resolve(destinationDirectory, 'googleMessage.txt'),
    });
    copyConfigs.push({
      from: path.resolve(sampleDirectory, 'backlogMessage.txt'),
      to: path.resolve(destinationDirectory, 'backlogMessage.txt'),
    });
  }

  config.plugins = [new CopyPlugin({ patterns: copyConfigs })];
  return config;
};

/**
 * JSONスキーマ作成
 */
const createJsonSchema = () => {
  const configPath = path.resolve(sourceDirectory, 'commons', 'config');
  const configDataPath = path.resolve(configPath, 'def', 'configData.ts');
  const program = tjs.getProgramFromFiles([configDataPath]);
  const settings = {
    strictNullChecks: true,
    required: true,
  };
  const generator = tjs.buildGenerator(program, settings);
  const symbols = generator.getMainFileSymbols(program);

  const configSchemaDirectory = path.resolve(configPath, 'schema');
  if (!fs.existsSync(configSchemaDirectory)) {
    fs.mkdirSync(configSchemaDirectory);
  }

  const outputTarget = path.resolve(
    configSchemaDirectory,
    'configData.schema.json',
  );
  // スキーマ作成対象のinterfaceは必ず1つ以上存在する想定（appConfigが存在するため）
  const schema = generator.getSchemaForSymbols(symbols);
  const content = JSON.stringify(schema, null, 2);
  fs.writeFileSync(outputTarget, content, {
    encoding: 'utf-8',
  });
};
