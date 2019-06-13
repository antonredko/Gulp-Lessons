// Установил и подключил плагины: 
// gulp-rename 
// gulp-sass 
// gulp-autoprefixer
// gulp-sourcemaps
// browser-sync
// Команда для установки: npm install --save-dev gulp-<pluginName>

var gulp = require("gulp");
var rename = require("gulp-rename");
var sass = require("gulp-sass");
var autoprefixer = require("gulp-autoprefixer");
var sourcemaps = require("gulp-sourcemaps");
var browserSync = require("browser-sync").create();

function css_style(done) {

    gulp.src("./scss/**/*.scss") // Путь к начальному файлу со стилями
        .pipe(sourcemaps.init()) // Позволяет просмотреть файл стилей в панели разработчика браузера в несжатом виде
        .pipe(sass({
            errorLogToConsole: true, // Разрешает отображать ошибки в консоли
            outputStyle: "compressed" // Минимизирует файл стилей
        }))
        .on("error", console.error.bind(console)) // Отображает ошибки в консоли
        .pipe(autoprefixer({
            overrideBrowserslist: ['last 10 versions'], // Добавляет префиксы к стилям для последних 10 версий браузеров
            cascade: false
        }))
        .pipe(rename({suffix: ".min"})) // Добавляет суфикс .min к новому скомпилированному файлу стилей
        .pipe(sourcemaps.write("./"))
        .pipe(gulp.dest("./css/")) // Сохраняет новый скомпилированный файл стилей в папку css
        .pipe(browserSync.stream());

    done();
}

function sync(done) { // Создает локальный сервер с нужными настройками. При запуске в консоли отобразится ссылка на проэкт для отслеживания изменений в режиме live
    browserSync.init({
        server: {
            baseDir: "./"
        },
        port: 3000
    });

    done();
}

function browserReload(done) { // Перезагружает страницу браузера
    browserSync.reload();

    done();
}

function watchFiles() { // При изменении файлов с разширением html, php, js и всех фалов и папок в папке scss будет вызываться функция browserReload();
    gulp.watch("./scss/**/*", css_style);
    gulp.watch("./**/*.html", browserReload);
    gulp.watch("./**/*.php", browserReload);
    gulp.watch("./**/*.js", browserReload);
}

// gulp.task(css_style);
// gulp.task(print);

gulp.task("default", gulp.parallel(watchFiles, sync)); // Метод .parallel() - для паралельного выполнения функций

// exports.default = defaultSomeTask;
// exports.printHello = printHello;