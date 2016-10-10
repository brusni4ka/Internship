/**
 * Created by kate on 10/10/16.
 */
module.exports = function(grunt) {

    // ===========================================================================
    // CONFIGURE GRUNT ===========================================================
    // ===========================================================================
    grunt.initConfig({

        // get the configuration info from package.json ----------------------------
        // this way we can use things like name and version (pkg.name)
        pkg: grunt.file.readJSON('package.json'),

        // all of our configuration will go here

        // compile less stylesheets to css -----------------------------------------
        less: {
            build: {
                files: {
                    'css/style.css': 'css/style.less'
                }
            }
        },

        // configure cssmin to minify css files ------------------------------------
        cssmin: {
            options: {
                banner: '/*\n <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> \n*/\n'
            },
            build: {
                files: {
                    'css/style.min.css': 'css/style.css',
                    'css/normalize.min.css': 'css/normalize.css'
                }
            }
        },

        // configure watch to auto update ----------------
        watch: {

            // for stylesheets, watch css and less files 
            // only run less and cssmin stylesheets: { 
            files: ['src//*.css', 'src//*.less'],
            tasks: ['less', 'cssmin']
            
        }

    });

    // ===========================================================================
    // LOAD GRUNT PLUGINS ========================================================
    // ===========================================================================


    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('default', ['less','cssmin']);


};




