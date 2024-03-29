# eslint-plugin-fsd-checker-imports

Плагин для проверки импорта файлов согласно FSD(Feature Sliced Design) методологии.
Плагин подсвечивает ошибку если файл импортирован не верно и помогает исправить путь(относительный/абсолютный).

## Github
[Ссылка на проект](https://github.com/Nayteruz/fsd-import-checker)

## Установка

Сначала необходимо установить сам [ESLint](https://eslint.org/):

```sh
npm i eslint --save-dev
```

Затем устанавливаем `eslint-plugin-fsd-checker-imports`:

```sh
npm install --save-dev eslint-plugin-fsd-checker-imports 
```

## Использование

Добавляем плагин `eslint-plugin-fsd-checker-imports` в секцию плагинов вашего конфигурационного файла `.eslintrc` . Префикс `eslint-plugin-` в названии плагина исключаем :

```
module.exports = {
    // other info ...
    "plugins": [ 
      // "other-plugins",
      "fsd-checker-imports"
    ],
  // other info ...
}
```


### Использование в секции `rules`

`path-checker` - используется для проверки правильности пути(относительный/абсолютный).
Относительными пути могут быть только внутри модуля, между слоями(shared, feature) пути должны быть абсолютными. Для shared слоя пути по умолчанию абсолютные.
Если используется алиас, необходимо его указать.
```
module.exports = {
    //...
    "rules": {
      "fsd-checker-imports/path-checker": [
        "error", { alias: "@" }
      ]
    },
    //...
}
```
`layer-imports` - проверка импорта слоев согласно методологии. Например, shared можно импортировать в любой слой, а во features можно имортировать только 'shared' и 'entities'. Данное правильно это проверяет.
Если используется алиас, необходимо его указать.
ignoreImportPatterns - указывает какие паттерны файлов игнорировать.
```
module.exports = {
    "rules": {
      //...
      "fsd-checker-imports/layer-imports": [
        "error",
        {
          alias: "@",
          ignoreImportPatterns: ["**/StoryProvider", "**/testing"],
        },
      ],
      //...
    }
}
```
`public-api-imports` проверяет правильность импорта публичного api. Правило проверяет что бы код экспортировался только из публичного api.
Если используется алиас, необходимо его указать.
testFilesPatterns - указывает какие паттерны файлов игнорировать.
```
module.exports = {
    "rules": {
      //..
      "fsd-checker-imports/public-api-imports": [
        "error",
        {
          alias: "@",
          testFilesPatterns: [
            "**/*.test.*",
            "**/*.story.*",
            "**/StoryDecorator.tsx",
          ],
        },
      ],
      //...
    }
}
```
