'use strict';
document.addEventListener('DOMContentLoaded', function () {
    // Мобильное меню

    const buttonMenu = document.getElementById('menu-btn'),
        menuMobile = document.getElementById('menu-mobile');
    function menuHandler(e) {
        const target = e.target;
        target.classList.toggle('active');
        menuMobile.classList.toggle('active');
        document.body.classList.toggle('active');
    }
    buttonMenu.addEventListener('click', menuHandler);

    //statistic
    const time = 2;
    let cc = 1;

    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting && cc < 2) {
                const numbers = document.querySelectorAll('.number');
                numbers.forEach(function (number) {
                    number.classList.add('viz');
                });

                const divs = document.querySelectorAll('[data-num]');
                divs.forEach(function (div) {
                    let i = 1;
                    const num = parseInt(div.getAttribute('data-num'), 10);
                    const step = 1000 * time / num;

                    const interval = setInterval(function () {
                        if (i <= num) {
                            div.textContent = i;
                        } else {
                            cc += 2;
                            clearInterval(interval);
                        }
                        i++;
                    }, step);
                });

                // Отключаем наблюдатель, чтобы анимация запускалась только один раз
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 }); // 0.5 означает, что элемент должен быть наполовину виден на экране

    const counter = document.getElementById('statistic');
    if (counter) {
        observer.observe(counter);
    }
    const gallery = document.querySelector('.statistic-gallery');
    const allComedians = Array.from(gallery.querySelectorAll('.statistic-comedian'));

    let visibleComedians = [];

    function getRandomComedians() {
        let availableComedians = [...allComedians];
        let randomComedians = [];

        while (randomComedians.length < 6) {
            const randomIndex = Math.floor(Math.random() * availableComedians.length);
            const selectedComedian = availableComedians.splice(randomIndex, 1)[0];
            randomComedians.push(selectedComedian);
        }

        return randomComedians;
    }

    function displayComedians(comedians) {
        gallery.innerHTML = ''; // Очистить текущие фотографии
        comedians.forEach((comedian, index) => {
            comedian.style.opacity = 0;
            comedian.style.position = 'relative'; // Относительное позиционирование для показа по порядку
            gallery.appendChild(comedian);
        });

        // Показать изображения поочередно
        comedians.forEach((comedian, index) => {
            setTimeout(() => {
                comedian.style.opacity = 1;
                comedian.style.position = 'relative'; // Обновить позицию
            }, index * 500); // Показать каждое изображение через 500мс
        });
    }

    function changeImages() {
        const newComedians = getRandomComedians();
        displayComedians(newComedians);
    }

    changeImages(); // Инициализация с начальным набором изображений
    setInterval(changeImages, 5000); // Обновление каждые 5 секунд


    const tabs = document.getElementById('schedule__triggers');
    const contents = document.querySelectorAll('.schedule__event');

    function tabsHandler(e) {
        const target = e.target;
        if (target && target.classList.contains('schedule__trigger')) {
            document.querySelectorAll('.schedule__trigger').forEach(elem => {
                elem.classList.remove('active');
            })
            target.classList.add('active');

            contents.forEach(content => {
                content.classList.remove('active');
                if (content.classList.contains(target.dataset.tab)) {
                    content.classList.add('active');
                }
            })
        }
    };
    contents.forEach(content => {
        content.classList.remove('active');
        if (content.classList.contains('top')) {
            content.classList.add('active');
        }
    })
    tabs.addEventListener('click', tabsHandler);


    //section.about


    const images = document.querySelectorAll('.about__img');
    let currentIndex = 0;
    images[currentIndex].classList.add('active');
    setInterval(() => {
        images[currentIndex].classList.remove('active');
        currentIndex = (currentIndex + 1) % images.length;
        images[currentIndex].classList.add('active');
    }, 5000); // 5 seconds



    // function copyText(text) {
    //     navigator.clipboard.writeText(text).then(function () {
    //         showNotification();
    //     }).catch(function (error) {
    //         console.error("Ошибка при копировании: ", error);
    //     });
    // }

    // function showNotification() {
    //     const notification = document.getElementById("notification");
    //     notification.classList.add("show");

    //     setTimeout(function () {
    //         notification.classList.remove("show");
    //     }, 3000);
    // }


    let map;

    // Функция инициализации карты
    async function initMap(center, zoom) {
        await ymaps3.ready;

        const {
            YMap,
            YMapDefaultSchemeLayer,
            YMapDefaultFeaturesLayer,
            YMapMarker
        } = ymaps3;

        // Создание карты
        map = new YMap(
            document.getElementById('map'), {
            location: {
                center: center,
                zoom: zoom
            }
        });
        map.addChild(new YMapDefaultSchemeLayer());
        map.addChild(new YMapDefaultFeaturesLayer());

        // Добавление маркера
        const markerHTML = document.createElement('img');
        markerHTML.classList.add('marker');
        markerHTML.src = 'images/map-icon.svg';
        markerHTML.style.height = '54px';
        markerHTML.style.width = '54px';
        markerHTML.style.position = 'relative';
        markerHTML.style.top = '0px';
        markerHTML.style.left = '0px';

        const marker = new YMapMarker({
            coordinates: center
        }, markerHTML);

        map.addChild(marker);
    }

    // Функция для отображения описания
    function showDescription(tag) {
        // Скрываем все описания
        document.querySelectorAll('.locations__descr').forEach(descr => {
            descr.style.display = 'none';
        });

        // Отображаем соответствующее описание
        const targetDescr = document.querySelector(`.locations__descr[data-descr="${tag}"]`);
        if (targetDescr) {
            targetDescr.style.display = 'block';
        }
    }

    // Инициализация карты на основе активной кнопки при загрузке страницы

    const activeTrigger = document.querySelector('.locations__trigger.active');
    const initialCoord = JSON.parse(activeTrigger.dataset.cord);
    const initialZoom = activeTrigger.dataset.zoom;
    const initialTag = activeTrigger.dataset.tag;

    // Инициализируем карту с начальными координатами и зумом
    initMap(initialCoord, initialZoom);

    // Отображаем соответствующее описание
    showDescription(initialTag);

    // Обработчик кликов по кнопкам
    const placesTriggers = document.querySelector('.locations__triggers');
    placesTriggers.addEventListener('click', (e) => {
        const target = e.target;

        if (target && target.classList.contains('locations__trigger')) {
            // Удаляем класс active у всех кнопок и назначаем его текущей
            document.querySelectorAll('.locations__trigger').forEach(btn => btn.classList.remove('active'));
            target.classList.add('active');

            // Получаем координаты и зум из атрибутов data
            const coord = JSON.parse(target.dataset.cord);
            const zoom = target.dataset.zoom;
            const tag = target.dataset.tag;

            // Пересоздаем карту с новыми координатами и зумом
            map.destroy();
            initMap(coord, zoom);

            // Отображаем соответствующее описание
            showDescription(tag);
        }
    });





    //section.faq
    const faqWrapper = document.querySelector('.faq__content');
    const faqButtons = document.querySelectorAll('.faq__accordeon-button');
    function accordeonsHandler(e) {
        const target = e.target;
        if (target && target.classList.contains('faq__accordeon-button')) {

            if (target.nextElementSibling.style.maxHeight) {
                target.nextElementSibling.style.maxHeight = null;
                target.classList.remove('active');
            }
            else {
                target.classList.add('active');
                target.nextElementSibling.style.maxHeight = target.nextElementSibling.scrollHeight + "px";
            }
        }
    };

    faqWrapper.addEventListener('click', accordeonsHandler);
    // const videoWrapper = document.querySelector('.video__wrapper');
    // const video = videoWrapper.querySelector('video');
    // const playButton = videoWrapper.querySelector('.video__icon');

    // // Воспроизведение видео при нажатии на кнопку
    // playButton.addEventListener('click', function() {
    //     video.play();
    //     playButton.style.display = 'none'; // Скрыть кнопку, когда видео воспроизводится
    // });

    // // Пауза видео при нажатии на само видео
    // video.addEventListener('click', function() {
    //     if (!video.paused) {
    //         video.pause();
    //         playButton.style.display = 'block'; // Показать кнопку, когда видео на паузе
    //     }
    // });

    // // Показать кнопку воспроизведения, когда видео заканчивается
    // video.addEventListener('ended', function() {
    //     playButton.style.display = 'block';
    // });


       // якорные ссылки

       const links = document.querySelectorAll('.anchors-link');
       const mobileMenu = document.getElementById('menu-mobile');
   
   
       mobileMenu.addEventListener('click', function (e) {
           const target = e.target;
           links.forEach((item, index) => {
               if (target && target === item) {
                   buttonMenu.classList.remove('active');
                   menuMobile.classList.remove('active');
                   document.body.classList.remove('active');
               }
           })
       })
   
       links.forEach(function (link) {
           link.addEventListener('click', function (event) {
               event.preventDefault();
               const sectionId = link.getAttribute('data-href').substring(1);;
               if (sectionId === 'header') {
                   window.scrollTo({ top: 0, behavior: 'smooth' });
               }
               else {
                   const section = document.getElementById(`${sectionId}`);
                   if (section) {
                       section.scrollIntoView({ behavior: 'smooth' });
                   }
               }
           });
       });
   
});
