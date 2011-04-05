({

    packages: [
      {
        name: 'compact',
        location: '../../../compact/',
        lib: 'scripts/'
      }
    ],

    dir: "../faq_editor_built",

   
    optimize: "uglify",

    //If using UglifyJS for script optimization, these config options can be
    //used to pass configuration values to UglifyJS.
    //See https://github.com/mishoo/UglifyJS for the possible values.
   /*
    uglify: {
        gen_codeOptions: {},
        strict_semicolons: {},
        do_toplevel: {},
        ast_squeezeOptions: {}
    },
    */
/*
    closure: {
        CompilerOptions: {},
        CompilationLevel: 'SIMPLE_OPTIMIZATIONS',
        loggingLevel: 'WARNING'
    },
*/

    //Inlines the text for any text! dependencies, to avoid the separate
    //async XMLHttpRequest calls to load those dependencies.
    inlineTemplates: true,
    
    //List the modules that will be optimized. All their immediate and deep
    //dependencies will be included in the module's file when the build is
    //done. If that module or any of its dependencies includes i18n bundles,
    //only the root bundles will be included unless the locale: section is set above.
    modules: [
        //Just specifying a module name means that module will be converted into
        //a built file that contains all of its dependencies. If that module or any
        //of its dependencies includes i18n bundles, they may not be included in the
        //built file unless the locale: section is set above.
        {
            name: "application",

            //Should the contents of require.js be included in the optimized module.
            //Defaults to false.
            includeRequire: false
        }
    ]
})