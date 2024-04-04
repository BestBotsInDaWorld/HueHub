import src  from 'gulp';
import * as nodePath from "path";
const rootFolder = nodePath.basename(nodePath.resolve());

const buildFolder = './static';
const srcFolder = './src';


export const path = {
    build: {
        js: `${buildFolder}/js/`,
        css: `${buildFolder}/css/`,
        backend: `${buildFolder}/backend/`, 
        images: `${buildFolder}/img`,
        html: `${buildFolder}/`,
        fonts: `${buildFolder}/fonts/`,
        files: `${buildFolder}/files/`,
    },
    src: {
        js: `${srcFolder}/js/app.js`,
        html: `${srcFolder}/*.html`,
        backend: `${srcFolder}/backend/**/*.*`,
        images: `${srcFolder}/img/**/*.{png,webp,jpg,jpeg,gif}`,
        svg: `${srcFolder}/img/**/*.svg`,
        scss: `${srcFolder}/scss/style.scss`,
        files: `${srcFolder}/files/**/*.*`,
    },
    watch: {
        js: `${srcFolder}/js/**/*.js`,
        scss: `${srcFolder}/scss/**/*.scss`,
        backend: `${srcFolder}/backend/**/*.py`, 
        images: `${srcFolder}/img/**/*.{png,webp,jpg,jpeg,gif,svg}`,
        html: `${srcFolder}/**/*.html`,
        files: `${srcFolder}/files/**/*.*`, 
    },
    clean: buildFolder,
    srcFolder: srcFolder,
    rootFolder: rootFolder,
    ftp: ``
}