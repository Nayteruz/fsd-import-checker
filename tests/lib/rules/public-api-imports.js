/**
 * @fileoverview feature sliced relative path checker
 * @author nayteruz
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/public-api-imports"),
	RuleTester = require("eslint").RuleTester;


//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({
	parserOptions: {ecmaVersion: 6, sourceType: 'module'}
});

const aliasOptions = [
	{
		alias: '@'
	}
]

ruleTester.run("public-api-imports", rule, {
	valid: [
		{
			code: "import { addCommentFormActions, addCommentFormReducer } from '../../model/slices/addCommentFormSlice'",
			errors: [],
		},
		{
			code: "import { addCommentFormActions, addCommentFormReducer } from '@/entities/Article'",
			errors: [],
			options: aliasOptions,
		},
		{
			filename: 'C:\\Users\\tim\\Desktop\\javascript\\production_project\\src\\entities\\file.test.ts',
			code: "import { addCommentFormActions, addCommentFormReducer } from '@/entities/Article/testing'",
			errors: [],
			options: [{
				alias: '@',
				testFilesPatterns: ['**/*.test.ts', '**/*.test.ts', '**/StoryDecorator.tsx']
			}],
		},
		{
			filename: 'C:\\Users\\tim\\Desktop\\javascript\\production_project\\src\\entities\\StoreDecorator.tsx',
			code: "import { addCommentFormActions, addCommentFormReducer } from '@/entities/Article/testing'",
			errors: [],
			options: [{
				alias: '@',
				testFilesPatterns: ['**/*.test.ts', '**/*.test.ts', '**/StoreDecorator.tsx']
			}],
		}
	],

	invalid: [
		{
			code: "import { addCommentFormActions, addCommentFormReducer } from '@/entities/Article/model/file.ts'",
			errors: [{messageId: 'PUBLIC_ERROR'}],
			options: aliasOptions,
			output: "import { addCommentFormActions, addCommentFormReducer } from '@/entities/Article'",
		},
		{
			filename: 'C:\\Users\\tim\\Desktop\\javascript\\production_project\\src\\entities\\StoreDecorator.tsx',
			code: "import { addCommentFormActions, addCommentFormReducer } from '@/entities/Article/testing/file.tsx'",
			errors: [{messageId: 'PUBLIC_ERROR'}],
			options: [{
				alias: '@',
				testFilesPatterns: ['**/*.test.ts', '**/*.test.ts', '**/StoreDecorator.tsx']
			}],
			output: "import { addCommentFormActions, addCommentFormReducer } from '@/entities/Article'",
		},
		{
			filename: 'C:\\Users\\tim\\Desktop\\javascript\\production_project\\src\\entities\\forbidden.ts',
			code: "import { addCommentFormActions, addCommentFormReducer } from '@/entities/Article/testing'",
			errors: [{messageId: 'TESTING_PUBLIC_ERROR'}],
			options: [{
				alias: '@',
				testFilesPatterns: ['**/*.testing.ts', '**/*.test.ts', '**/*.stories.ts', '**/StoreDecorator.tsx']
			}],
		}
	],
});
