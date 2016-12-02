/**
 * Created by kate on 29/11/16.
 */

export const anim = {
    //slide effects

    id: 0,

    slideToggle: function (elem) {
        if(elem.classList.contains('active')){
            elem.classList.remove('active');
            this.slideUp(elem);
        }else{
            if(this.time){
                window.clearInterval(this.id);
            }
            elem.classList.add('active');
            this.slideDown(elem);
        }
    },
   
    slideDown: function (elem) {
        elem.style.maxHeight = '300px';
        elem.style.opacity = '1';
    },

    slideUp: function (elem) {
        elem.style.maxHeight = '0';
        this.once(1, function () {
            elem.style.opacity = '0';
        });
    },

    once: function (seconds, callback) {
        var counter = 0;
        this.id = window.setInterval( ()=> {
            counter++;
            if (counter >= seconds) {
                callback();
                window.clearInterval(this.id);
            }
        }, 1000);
    }


};
