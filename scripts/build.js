'use strict';

// Do this as the first thing so that any code reading it knows the right env.
process.env.BABEL_ENV = 'production';
process.env.NODE_ENV = 'production';

// Makes the script crash on unhandled rejections instead of silently
// ignoring them. In the future, promise rejections that are not handled will
// terminate the Node.js process with a non-zero exit code.
process.on('unhandledRejection', err => {
  throw err;
});

// Ensure environment variables are read.
require('../config/env');

const path = require('path');
const chalk = require('chalk');
const fs = require('fs-extra');
const webpack = require('webpack');
const config = require('../config/webpack.config.prod');
const paths = require('../config/paths');
const checkRequiredFiles = require('react-dev-utils/checkRequiredFiles');
const formatWebpackMessages = require('react-dev-utils/formatWebpackMessages');
const printHostingInstructions = require('react-dev-utils/printHostingInstructions');
const FileSizeReporter = require('react-dev-utils/FileSizeReporter');
const printBuildError = require('react-dev-utils/printBuildError');
var btime=new Date().getTime()
var zipper = require("zip-local");
var stat=fs.stat;

const measureFileSizesBeforeBuild =
  FileSizeReporter.measureFileSizesBeforeBuild;
const printFileSizesAfterBuild = FileSizeReporter.printFileSizesAfterBuild;
const useYarn = fs.existsSync(paths.yarnLockFile);

// These sizes are pretty large. We'll warn for bundles exceeding them.
const WARN_AFTER_BUNDLE_GZIP_SIZE = 512 * 1024;
const WARN_AFTER_CHUNK_GZIP_SIZE = 1024 * 1024;

var localGithubAddress="C:/Users/10573.DESKTOP-CTGL3BJ/Documents/GitHub/corcb"//本地github地址
// Warn and crash if required files are missing
if (!checkRequiredFiles([paths.appHtml, paths.appIndexJs])) {
  process.exit(1);
}

// First, read the current file sizes in build directory.
// This lets us display how much they changed later.
chromeAnnotation();
measureFileSizesBeforeBuild(paths.appBuild)
  .then(previousFileSizes => {
    // Remove all content but keep the directory so that
    // if you're in it, you don't end up in Trash
    fs.emptyDirSync(paths.appBuild);
    // Merge with the public folder
    copyPublicFolder();
    // Start the webpack build
    return build(previousFileSizes);
  })
  .then(
    ({ stats, previousFileSizes, warnings }) => {
      chromeNoAnnotation();
      if (warnings.length) {
        console.log(chalk.yellow('Compiled with warnings.\n'));
        console.log(warnings.join('\n\n'));
        console.log(
          '\nSearch for the ' +
            chalk.underline(chalk.yellow('keywords')) +
            ' to learn more about each warning.'
        );
        console.log(
          'To ignore, add ' +
            chalk.cyan('// eslint-disable-next-line') +
            ' to the line before.\n'
        );
      } else {
        console.log(chalk.green('Compiled successfully.\n'));
      }

      console.log('File sizes after gzip:\n');
      printFileSizesAfterBuild(
        stats,
        previousFileSizes,
        paths.appBuild,
        WARN_AFTER_BUNDLE_GZIP_SIZE,
        WARN_AFTER_CHUNK_GZIP_SIZE
      );
      console.log();

      const appPackage = require(paths.appPackageJson);
      const publicUrl = paths.publicUrl;
      const publicPath = config.output.publicPath;
      const buildFolder = path.relative(process.cwd(), paths.appBuild);
      printHostingInstructions(
        appPackage,
        publicUrl,
        publicPath,
        buildFolder,
        useYarn
      );
    },
    err => {
      chromeNoAnnotation();
     
    }
  );

// Create the production build and print the deployment instructions.
function build(previousFileSizes) {
  
  console.log('Creating an optimized production build...');

  let compiler = webpack(config);
  return new Promise((resolve, reject) => {
    compiler.run((err, stats) => {
      if (err) {
        return reject(err);
      }
      const messages = formatWebpackMessages(stats.toJson({}, true));
      if (messages.errors.length) {
        // Only keep the first error. Others are often indicative
        // of the same problem, but confuse the reader with noise.
        if (messages.errors.length > 1) {
          messages.errors.length = 1;
        }
        return reject(new Error(messages.errors.join('\n\n')));
      }
      if (
        process.env.CI &&
        (typeof process.env.CI !== 'string' ||
          process.env.CI.toLowerCase() !== 'false') &&
        messages.warnings.length
      ) {
        console.log(
          chalk.yellow(
            '\nTreating warnings as errors because process.env.CI = true.\n' +
              'Most CI servers set it automatically.\n'
          )
        );
        return reject(new Error(messages.warnings.join('\n\n')));
      }
      return resolve({
        stats,
        previousFileSizes,
        warnings: messages.warnings,
      });
    });
  });
}

function copyPublicFolder() {
  fs.copySync(paths.appPublic, paths.appBuild, {
    dereference: true,
    filter: file => file !== paths.appHtml,
  });
}

function chromeAnnotation(){
  var file=path.join(__dirname, "../src/config/chromeOp.js")
  var str="";
  fs.readFile(file, 'utf8', function(err, data) {
    var dataList=data.match(/.*\r/g)
    dataList.forEach((item,index)=>{
        str+="//"+item+"\n"
    })
    str+=("export default chrome")
    fs.writeFile(file, str, 'utf8',(r)=>{
        console.log("添加注释")
    });
    
  })
}

function chromeNoAnnotation(){
  //解开注释
  var file=path.join(__dirname, "../src/config/chromeOp.js")
  fs.readFile(file, 'utf8', function(err, data) {
    console.log("解开注释")
    fs.writeFile(file, data.replace(/\/\//g,''), 'utf8',(r)=>{
      console.log('打包时间'+(new Date().getTime()-btime)/1000)
      exists(path.join(__dirname,'../../corcb'),localGithubAddress,copy)
      relocalGithub();
      
    });
    
  })
}


function relocalGithub(){
  //修改github的文件
  console.log('压缩中')
  zipper.sync.zip(path.join(__dirname,'../build')).compress().save(localGithubAddress+"/build.zip",(r)=>{    
    console.log(r)
    printBuildError(err);
    process.exit(1);
    
  })  
}

function copy(src,dst){
  //读取目录
  fs.readdir(src,function(err,paths){
      if(err){
          throw err;
      }
      paths.forEach(function(path){
          if(path!='node_modules'){
            var _src=src+'/'+path;
            var _dst=dst+'/'+path;
            var readable;
            var writable;
            stat(_src,function(err,st){
                if(err){
                    throw err;
                }
                
                if(st.isFile()){
                    readable=fs.createReadStream(_src);//创建读取流
                    writable=fs.createWriteStream(_dst);//创建写入流
                    readable.pipe(writable);
                }else if(st.isDirectory()){
                    exists(_src,_dst,copy);
                }
            });
          }          
      });
  });
}

function exists(src,dst,callback){
  //测试某个路径下文件是否存在cla
  fs.exists(dst,function(exists){
      if(exists){//不存在
          callback(src,dst);
      }else{//存在
          fs.mkdir(dst,function(){//创建目录
              callback(src,dst)
          })
      }
  })
}