// Основной модуль;
import gulp from "gulp";
import shell from "gulp-shell";
// Импорт путей;
import { path } from "./gulp/config/path.js";

// Передаем значения в глобальную переменную
global.app = {
    isBuild: process.argv.includes('--build'), // Продакшен
    isDev: !process.argv.includes("--build"), // Режим разработки
    path: path,
    gulp: gulp,
    plugins: plugins,
}

// Импорт задач

// Функция, которая импортирует исзодники
import { copy } from "./gulp/tasks/copy.js";

// Функция, которая импортирует html
import { html } from "./gulp/tasks/html.js";

// Функция, которая преобразовывает scss в .min.css
import { scss } from "./gulp/tasks/scss.js";

// Функция, которая импортирует py
import { py } from "./gulp/tasks/python.js";

// Функция, которая импортирует js 
import { js } from "./gulp/tasks/js.js";

// Функция, которая импортирует image
import { image } from "./gulp/tasks/image.js";

// Работа со шрифтами
import { otfToTtf, ttfToWoff, fontsToStyle } from "./gulp/tasks/fonts.js";

// Функция, которая очищает удаленные исходники
import { reset } from "./gulp/tasks/reset.js";

// Функция, подключающая плагины
import { plugins } from "./gulp/config/plugins.js";

// Функция, подключающая сервер
import { server } from './gulp/tasks/server.js';

// Функция архиватор
import { zip } from "./gulp/tasks/zip.js";



// Наблюдатель за изменениями в файлах
function watcher(){
    gulp.watch(path.watch.files, copy);
    gulp.watch(path.watch.html, html);
    gulp.watch(path.watch.scss, scss);
    gulp.watch(path.watch.js, js);
    gulp.watch(path.watch.images, image);
    gulp.watch(path.watch.backend, py);
}

const fonts = gulp.series(otfToTtf, ttfToWoff, fontsToStyle)

// Копируем как файлы, так и html разметку
const mainTask = gulp.series(fonts, gulp.parallel(copy, html, scss, js, image, py))

// Построение сценариев для выполнения задач
const runFlaskServer = () => {
    return gulp.src('.')
      .pipe(shell('python app.py'));
  };
  
const migrate = () => {
    return gulp.src('.')
      .pipe(shell('alembic revision --autogenerate'));
  };

const upgrade = () => {
return gulp.src('.')
    .pipe(shell('alembic upgrade head'));
};

const dev = gulp.series(reset, mainTask, gulp.parallel(watcher, runFlaskServer));
const build = gulp.series(reset, mainTask);
const deployZip = gulp.series(reset, mainTask, zip)
const migration = gulp.series(migrate, upgrade)

// Экспорт сценариев
export { dev }
export { build }
export { deployZip }

// Выполнение сценария по умолчанию
gulp.task('default', dev);
gulp.task('migration', migration);