import fs from "fs";
import fonter from "gulp-fonter";
import ttf2woff2 from "gulp-ttf2woff2";


export const otfToTtf = () => {
  // Ищем файлы шрифтов .otf
  return app.gulp.src(`${app.path.srcFolder}/fonts/*.otf`, {})
    .pipe(app.plugins.plumber(
      app.plugins.notify.onError({
        title: "FONTS",
        message: "Error: <%=error.message%>"
      })
    ))
    // Конвертируем в .ttf
    .pipe(fonter({
      formats: ['ttf']
    }))
    .pipe(app.gulp.dest(`${app.path.srcFolder}/fonts/`))
}


export const ttfToWoff = () => {
  // Ищем файлы шрифтов .ttf
  return app.gulp.src(`${app.path.srcFolder}/fonts/*.ttf`, {})
    .pipe(app.plugins.plumber(
      app.plugins.notify.onError({
        title: "FONTS",
        message: "Error: <%=error.message%>"
      })
    ))
    // Конвертируем в .ttf
    .pipe(fonter({
      formats: ['woff']
    }))
    .pipe(app.gulp.dest(`${app.path.srcFolder}`))
    .pipe(app.gulp.src(`${app.path.srcFolder}/fonts/*.ttf`))
    .pipe(ttf2woff2())
    .pipe(app.gulp.dest(`${app.path.build.fonts}`))
}


export const fontsToStyle = () => {
  let fontsFile = `${app.path.srcFolder}/scss/fonts.scss`;
  // Ищем файлы шрифтов .otf
  fs.readdir(app.path.build.fonts, function (err, fontsFiles) {
    if (fontsFiles) {
      if (!fs.existsSync(fontsFile)) {
        fs.writeFile(fontsFile, "", cb);
        let newFileOnly;
        for (var i = 0; i < fontsFiles.length; i++) {
          // Записываем подключения шрифтов в файл стилей
          let fontFileName = fontsFiles[i].split('.')[0];

          if (newFileOnly !== fontFileName) {
            let fontName = fontFileName.split('-')[0] ? fontFileName.split("-")[0] : fontFileName;
            let fontWeight = fontFileName.split('-')[1] ? fontFileName.split("-")[1] : fontFileName;
            if (fontWeight.toLowerCase() === "thin") {
              fontWeight = 100;
            }
            if (fontWeight.toLowerCase() === "extralight") {
              fontWeight = 200;
            }
            if (fontWeight.toLowerCase() === "light") {
              fontWeight = 300;
            }
            if (fontWeight.toLowerCase() === "medium") {
              fontWeight = 500;
            }
            if (fontWeight.toLowerCase() === "semibold") {
              fontWeight = 600;
            }
            if (fontWeight.toLowerCase() === "bold") {
              fontWeight = 700;
            }
            if (fontWeight.toLowerCase() === "extrabold" || fontWeight.toLowerCase === "heavy") {
              fontWeight = 800;
            }
            if (fontWeight.toLowerCase() === "black") {
              fontWeight = 900;
            } else {
              fontWeight = 400;
            }

            fs.appendFile(fontsFile,`@font-face {\n\tfont-family: ${fontName};\n\tfont-display: swap;\n\tsrc: url("../fonts/${fontFileName}.woff2") format("woff2"), url("../fonts/${fontFileName}");\n\tfont-weight: ${fontWeight};\n\tfont-style: normal;}\r\n`, cb)
            newFileOnly = fontFileName;
          }
        }
      } else {
        // Если файл есть, выводим сообщение
        console.log("Файл scss/fonts.scss уже существует. Для обновления его нужно удалить.")
      }
    }
  })
  return app.gulp.src(`${app.path.srcFolder}`);
  function cb() {}
}


