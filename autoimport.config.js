export function AutoImport() {
  return {
    // targets to transform
    include: [
      /\.[tj]sx?$/, // .ts, .tsx, .js, .jsx
      /\.vue$/,
      /\.vue\?vue/, // .vue
      /\.md$/, // .md
    ],

    // global imports to register
    imports: [
      // presets
      'vue',
      'vue-router',
      'pinia',
      //'quasar',
      // example type import
      {
        from: 'vue-router',
        imports: ['RouteLocationRaw', 'RouteRecordRaw'],
        type: true,
      },
    ],
    // Enable auto import by filename for default module exports under directories
    defaultExportByFilename: false,

    // Auto import for module exports under directories
    // by default it only scan one level of modules under the directory
    dirs: [
      'src/composables',
      'src/stores',
      //'./src/boot',
      'src/models',
      // './src/models',
    ],

    // Filepath to generate corresponding .d.ts file.
    // Defaults to './auto-imports.d.ts' when `typescript` is installed locally.
    // Set `false` to disable.
    dts: './src/auto-imports.d.ts',

    // Cache the result of resolving, across multiple vite builds.
    // A custom path is supported.
    // When set to `true`, the cache will be stored in `node_modules/.cache/unplugin-auto-import.json`.
    cache: false,

    // Auto import inside Vue template
    // see https://github.com/unjs/unimport/pull/15 and https://github.com/unjs/unimport/pull/72
    vueTemplate: false,

    // Custom resolvers, compatible with `unplugin-vue-components`
    // see https://github.com/antfu/unplugin-auto-import/pull/23/
    resolvers: [
      /* ... */
    ],

    // Inject the imports at the end of other imports
    injectAtEnd: true,

    // Generate corresponding .eslintrc-auto-import.json file.
    // eslint globals Docs - https://eslint.org/docs/user-guide/configuring/language-options#specifying-globals
    eslintrc: {
      enabled: true, // Default `false`
      //filepath: './.eslintrc-auto-import.json', // Default `./.eslintrc-auto-import.json`
      //globalsPropValue: true // Default `true`, (true | false | 'readonly' | 'readable' | 'writable' | 'writeable')
    },
  }
}
