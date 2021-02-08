// select of preprocessor
let preprocessor = 'sass'; // or 'less'
let fs = require('fs');

const { src, dest, parallel, series, watch } = require('gulp');
const browserSync = require('browser-sync').create();
const concat = require('gulp-concat');
const uglify = require('gulp-uglify-es').default;
const sass = require('gulp-sass');
const less = require('gulp-less');
const autoprefixer = require('gulp-autoprefixer');
const cleancss = require('gulp-clean-css');
const imagemin = require('gulp-imagemin');
const newer = require('gulp-newer');
const del = require('del');
const group_media = require("gulp-group-css-media-queries");
const svgmin = require('gulp-svgmin');
const rename = require('gulp-rename');
const fileinclude = require('gulp-file-include');
const ttf2woff = require('gulp-ttf2woff');
const ttf2woff2 = require('gulp-ttf2woff2');
const ttf2eot = require('gulp-ttf2eot');
const fonter = require('gulp-fonter');
const webp = require('gulp-webp');
const webphtml = require('gulp-webp-html');
const webpcss = require('gulp-webp-css');
const embedSvg = require("gulp-embed-svg");

function browsersync() {
    browserSync.init({
        server: {
            baseDir: 'dist/'
        },
        port: 9000,
        notify: false, // notification
        online: false, // work offline
    })
}

function htmlrigger() {
    return src(['app/**/*.html'])
        .pipe(fileinclude({
            prefix: '@@',
            basepath: 'app/'
        }))
        .pipe(embedSvg({
            root: 'app/'
        }))
        .pipe(webphtml())
        .pipe(dest('dist/'))
        .pipe(browserSync.stream())
}

function scripts(cb) {
    src([
        'node_modules/jquery/dist/jquery.min.js',
        'app/js/**/*.js'
    ])
        .pipe(concat('app.min.js'))
        .pipe(uglify())
        .pipe(dest('dist/js/'))
        .pipe(browserSync.stream())
    cb();
}

function styles() {
    return src('app/' + preprocessor + '/main.' + preprocessor + '')
        .pipe(eval(preprocessor)())
        .pipe(group_media())
        .pipe(concat('style.min.css'))
        .pipe(webpcss())
        .pipe(autoprefixer({
            overrideBrowserslist: ['last 10 versions'],
            grid: true,
            
        }))
        .pipe(cleancss(({
            level: { 1: { specialComments: 0 } }, // min css
            // format: 'beautify' // beautify css
        })))
        .pipe(dest('dist/css/'))
        .pipe(browserSync.stream())
}

function images() {
    return src(['app/images/**/*'])
        .pipe(newer('dist/images/'))
        .pipe(webp({
            quality: 70
        }))
        .pipe(imagemin())
        .pipe(dest('dist/images/'))
}

function fonts(cb) {
    src('app/fonts/**/*')
        .pipe(newer('dist/images/'))
        .pipe(dest('dist/fonts/'))
    src('app/fonts/**/*')
        .pipe(newer('dist/images/'))
        .pipe(ttf2woff())
        .pipe(dest('dist/fonts/'))
    src('app/fonts/**/*')
        .pipe(newer('dist/images/'))
        .pipe(ttf2eot())
        .pipe(dest('dist/fonts/'))
    src('app/fonts/**/*')
        .pipe(newer('dist/images/'))
        .pipe(ttf2woff2())
        .pipe(dest('dist/fonts/'))
    src('app/fonts/*.otf')
        .pipe(newer('dist/images/'))
        .pipe(fonter({
            formats: ['ttf']
        }))
        .pipe(dest('dist/fonts/'))
    cb();
}

function fontsStyle(cb) {
    let file_content = fs.readFileSync('app/sass/_fonts.sass');
    if (file_content == '') {
        fs.writeFile('app/sass/_fonts.sass', '', cb);
        return fs.readdir('dist/fonts/', function (err, items) {
            if (items) {
                let c_fontname;
                for (var i = 0; i < items.length; i++) {
                    let fontname = items[i].split('.');
                    fontname = fontname[0];
                    if (c_fontname != fontname) {
                        fs.appendFile('app/sass/_fonts.sass', '@include font("' + fontname + '", "' + fontname + '", "400", "normal")\r\n', cb);
                    }
                    c_fontname = fontname;
                }
            }
        })
    }
    cb();
}

function cleanimages() {
    return del('dist/images/**/*', {
        force: true
    })
}

function cleandist() {
    return del('dist/**/*', {
        force: true
    })
}

function startwatch() {

    watch(['app/' + preprocessor + '/**/*.*'], styles);

    watch(['app/**/*.js'], scripts);

    watch('app/**/*.html').on('change', htmlrigger);
    watch('app/**/*.html').on('change', browserSync.reload);

    watch(['app/images/**/*'], images);

}

// function for build project
exports.browsersync = browsersync;
exports.scripts = scripts;
exports.htmlrigger = htmlrigger;
exports.styles = styles;
exports.images = images;

// starting build (gulp)
exports.default = parallel(htmlrigger, styles, images, scripts, browsersync, startwatch);

// cleaning images (gulp cleanimages)
exports.cleanimages = cleanimages;

// build fonts (gulp fonts fontsStyle)
exports.fonts = fonts;
exports.fontsStyle = fontsStyle;

// cleaning dist (gulp cleandist)
exports.cleandist = cleandist;