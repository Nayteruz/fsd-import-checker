/**
 * @fileoverview feature sliced relative path checker
 * @author nayteruz
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/path-checker"),
  RuleTester = require("eslint").RuleTester;


//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------
const aliasOptions = [
  {
    alias: '@'
  }
]
const ruleTester = new RuleTester({
  parserOptions: { ecmaVersion: 6, sourceType: 'module' },
});
ruleTester.run("path-checker", rule, {
  valid: [
    {
      filename: 'C:\\Users\\tim\\Desktop\\javascript\\production_project\\src\\entities\\Article',
      code: "import { addCommentFormActions, addCommentFormReducer } from '../../model/slices/addCommentFormSlice'",
    },
    {
      filename: 'D:\\React_pay_lessons\\react_global\\src\\shared\\ui\\AppLink',
      code: "import { classNames as cn } from '@/shared/lib/classNames/classNames'",
      options: aliasOptions
    },
  ],

  invalid: [
    {
      filename: 'C:\\Users\\tim\\Desktop\\javascript\\production_project\\src\\entities\\Article',
      code: "import { addCommentFormActions, addCommentFormReducer } from 'entities/Article/model/slices/addCommentFormSlice'",
      errors: [{ message: "В рамках одного слайса все пути должны быть относительными" }],
      options: aliasOptions,
      output: "import { addCommentFormActions, addCommentFormReducer } from './Article/model/slices/addCommentFormSlice'"
    },
    {
      filename: 'C:\\Users\\tim\\Desktop\\javascript\\production_project\\src\\entities\\Article',
      code: "import { addCommentFormActions, addCommentFormReducer } from 'entities/Article/tttssdds/nidgh/addCommentFormSlice'",
      errors: [{ message: "В рамках одного слайса все пути должны быть относительными" }],
      output: "import { addCommentFormActions, addCommentFormReducer } from './Article/tttssdds/nidgh/addCommentFormSlice'"
    },
    {
      filename: 'D:\\React_pay_lessons\\react_global\\src\\shared\\ui\\AppLink',
      code: "import { classNames as cn } from '../../lib/classNames/classNames'",
      errors: [{ message: "В рамках одного слайса shared все пути должны быть абсолютными" }],
    },
  ],
});
