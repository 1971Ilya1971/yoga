window.addEventListener('DOMContentLoaded', function() {

    'use strict';

    //  Tabs

    let tab = document.querySelectorAll('.info-header-tab'),
        info = document.querySelector('.info-header'),
        tabContent = document.querySelectorAll('.info-tabcontent');
    
    //  Hiding the contents of the tabs
    function hideTabContent(a) {
        for (let i = a; i < tabContent.length; i++) {
            tabContent[i].classList.remove('show');
            tabContent[i].classList.add('hide');
        }
    }

    hideTabContent(1);  //  Hides all tabs except the first one

    //  Showing the contents of the current tab

    function showTabContent(b) {
        if (tabContent[b].classList.contains('hide')) {
            tabContent[b].classList.remove('hide');
            tabContent[b].classList.add('show');
        }
    }

    //  Changing tabs by clicking

    info.addEventListener('click', function(event) {
        let target = event.target;
        if (target && target.classList.contains('info-header-tab')) {
            for(let i = 0; i < tab.length; i++) {
                if (target == tab[i]) {
                     hideTabContent(0);  // Hides everything                    
                     showTabContent(i);  // Shows the required tab
                     break;
                }
            }
        }
    });

    //Timer
    
    let now = new Date(),                                                            // Getting the date of the next day
        deadline = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);   // and make it a deadline

    function getTimeRemaining(endtime) {
        let t  = Date.parse(endtime) - Date.parse(new Date()),  // Сalculate the remaining time
            seconds = Math.floor((t/1000) % 60),                // and convert it to the timer format 
            minutes = Math.floor((t/1000)/60 % 60),
            hours = Math.floor(t/(1000*60*60));

        return {                // return formatted data 
            'total' : t,        // in the form of an object 
            'seconds' : seconds,
            'minutes' : minutes,
            'hours' : hours
        };
    }

    function setClock(id, endtime) {                // set the timer to an end time and assign an identifier
        let timer = document.getElementById(id),
            hours = timer.querySelector('.hours'),
            minutes = timer.querySelector('.minutes'),
            seconds =  timer.querySelector('.seconds'),
            timeInterval = setInterval(updateClock, 1000);  // updating values every second 

        function updateClock() {
            let t = getTimeRemaining(endtime);
            
            function addZero(num) {     // Add zero in front of numbers with one character 
                if (num <= 9) {
                    return '0' + num; 
                } else return num;
            }

            hours.textContent = addZero(t.hours);      // Outputting timer values 
            minutes.textContent = addZero(t.minutes);
            seconds.textContent = addZero(t.seconds);



            if (t.total <= 0) {                        // Preventing negative timer values
                clearInterval(timeInterval);
                hours.textContent = '00';
                minutes.textContent = '00';
                seconds.textContent = '00';
            }
        }
    }

    setClock('timer', deadline);

    //  Modal

    let more = document.querySelector('.more'),
        overlay = document.querySelector('.overlay'),
        close = document.querySelector('.popup-close'),
        tabMoreBtns = document.querySelectorAll('.description-btn'),
        index, tempBtn;

        more.addEventListener('click', function() {     // The appearance of a modal window 
            overlay.style.display = 'block';            // Showing the window       
            this.classList.add('more-splash');          // appearance effect 
            document.body.style.overflow = 'hidden';    // block scrolling
        });

        for (index = 0; index < tabMoreBtns.length; index++) {  //same for all similar tab buttons 
            tempBtn = tabMoreBtns[index];
            tempBtn.addEventListener('click', function () {
                overlay.style.display = 'block';
                this.classList.add('more-splash');
                document.body.style.overflow = 'hidden';
                event.preventDefault();
            });
        }

        close.addEventListener('click', function() {    //closing windows
            overlay.style.display = 'none';             //and removing the corresponding classes 
            more.classList.remove('more-splash');
            for (index = 0; index < tabMoreBtns.length; index++){
                tabMoreBtns[index].classList.remove('more-splash');
            }
            document.body.style.overflow = '';
        });

    // Form

    let message = {             //  possible sending statuses 
        loading: 'Загрузка...',
        success: 'Спасибо! Скоро мы с вами свяжемся!',
        failure: 'Что-то пошло не так...'         
    };

    let form = document.querySelector('.main-form'),
        formBottom = document.getElementById('form'),
        input = document.getElementsByTagName('input'),
        statusMessage = document.createElement('div');

        statusMessage.classList.add('status');

    function sendForm(elem) {   //Sending form data using promise and AJAX
        elem.addEventListener('submit', function(e) {
            e.preventDefault();
            elem.appendChild(statusMessage);
            let formData = new FormData(elem);

            function postData(data) {

                return new Promise(function(resolve,reject) {
                    let request = new XMLHttpRequest();
                    request.open('POST', '../server.php');

                    request.setRequestHeader('Content-Type', 'application/json; charset=utf-8');

                    request.onreadystatechange = function() {
                        if (request.readyState < 4) {
                            resolve();                                                
                        } else if(request.readyState === 4) {
                            if (request.status >= 200 && request.status < 300) {
                                resolve();                                
                            }                            
                        } else {
                            reject();
                        }
                    };
                    let obj = {};
                        data.forEach(function(value,key) {
                            obj [key] = value;              //  Formatting data in JSON before sending 
                        });
                        let json = JSON.stringify(obj);
                    request.send(json);
                });
            } //End of postData
            function clearInput() {
                for (let i = 0; i < input.length; i++) {
                    input[i].value = '';
                }                
            }

            postData(formData)  // Getting the status via promise
                .then(()=> statusMessage.innerHTML = message.loading)
                .then(()=> statusMessage.innerHTML = message.success)
                .catch(()=> statusMessage.innerHTML = message.failure)
                .then(clearInput)       //  Сlearing input regardless of the result
                .then(setTimeout((()=> statusMessage.innerHTML = ''), 10000));  // Automatic status clearing after 10 seconds
        });
    }

    sendForm(form);
    sendForm(formBottom);

    //  Slider

    let slideIndex = 1,     //  Set the number for the current slide 
        slides = document.querySelectorAll('.slider-item'),
        prev = document.querySelector('.prev'),
        next = document.querySelector('.next'),
        dotsWrap = document.querySelector('.slider-dots'),
        dots = document.querySelectorAll('.dot');

    showSlides(slideIndex);
    function showSlides(n) {

        if (n > slides.length) {        //  Loop the last slide
            slideIndex = 1;
        }
        if (n < 1) {                    //  with the first 
            slideIndex = slides.length;
        }
        // Hide all slides and dots...
        slides.forEach((item) => item.style.display = 'none');
        dots.forEach((item) => item.classList.remove('dot-active'));
        // ...and show only the first[zero]
        slides[slideIndex - 1].style.display = 'block';
        dots[slideIndex - 1].classList.add('dot-active');
    }

    function plusSlides(n) {
        showSlides(slideIndex += n);
    }
    function currentSlide(n) {
        showSlides(slideIndex = n);
    }

    prev.addEventListener('click', function() { 
        plusSlides(-1);     // previous slide
    });

    next.addEventListener('click', function() {
        plusSlides(1);      // next slide 
    });

    dotsWrap.addEventListener('click', function() {     //Slide show according to the pressed dot
        for (let i = 0; i < dots.length + 1; i++) {
            if (event.target.classList.contains('dot') && event.target == dots[i-1]) {
                currentSlide(i);
            }
        }
    });

    // Calculator

    let persons = document.querySelectorAll('.counter-block-input')[0],
        restDays = document.querySelectorAll('.counter-block-input')[1],
        place = document.getElementById('select'),
        totalValue = document.getElementById('total'),
        personsSum = 0,
        daysSum = 0,
        ratio = 1,
        total = 0;

        totalValue.innerHTML = 0;
            //  As each variable changes, the total
            //  is recalculated using a formula.
        persons.addEventListener('change', function() {
            personsSum = +this.value;
            total = ((daysSum * personsSum)*4000)*ratio;

            if(restDays.value == '' || persons.value == '') {
                totalValue.innerHTML = 0;
            } else {
                totalValue.innerHTML = total;
            }
        });

        restDays.addEventListener('change', function() {
            daysSum = +this.value;
            total = ((daysSum * personsSum)*4000)*ratio;

            if(persons.value == '' || restDays.value == '') {
                totalValue.innerHTML = 0;
            } else {
                totalValue.innerHTML = total;
            }
        });

        place.addEventListener('change', function() {
            if (restDays.value == '' || persons.value == '') {
                totalValue.innerHTML = 0;
            } else {
                //  The coefficient is taken from the value of the "place" option
                ratio = this.options[this.selectedIndex].value 
                totalValue.innerHTML = ((daysSum * personsSum)*4000)*ratio;
            }
        });
});