import {deleteAsync} from 'del';
import zipPlugin from "gulp-zip";

export const zip = () => {
    // Удалить архив, если существует
    deleteAsync(`./${app.path.rootFolder}.zip`);
    // Получить все файлы из папки с результатом
    return app.gulp.src(`${app.path.buildFolder}/**/*.*`, {})
        /* 
        * Создать архив с проектом, дав ему название 
        * rootFolder (папка, в которой сейчас лежат все файлы)
        */
        .pipe(zipPlugin(`${app.path.rootFolder}.zip`))
        // Выгрузить архив в корень папки проекта
}

