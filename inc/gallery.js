jQuery.fn.makeGallery = function (o) {
    o = $.extend({
        interval: 1800, /* РёРЅС‚РµСЂРІР°Р» РІСЂР°С‰РµРЅРёСЏ 1000 = 1СЃРµРєСѓРЅРґР° */
        speed: 800, /* СЃРєРѕСЂРѕСЃС‚СЊ РїРµСЂРµРјРµС‰РµРЅРёСЏ 1000 = 1СЃРµРєСѓРЅРґР° */
        gallery_frame: '.gallery-frame',
        gallery_holder: 'ul',
        gallery_item: 'li'
    }, o || {});
    return this.each(
        function () {
            var _phase = true;
            var main_holder = $(this);
            var _gal_item = o.gallery_item;
            var btn_prev = $('.prev', main_holder);
            var btn_next = $('.next', main_holder);
            var _holder = $(o.gallery_holder, main_holder);
            var _speed = o.seepd;
            btn_prev.click(function () {
                if (_phase) {
                    _phase = false;
                    oneStepMinus();
                }
                return false;
            });
            btn_next.click(function () {
                if (_phase) {
                    _phase = false;
                    oneStepPlus();
                }
                return false;
            });
            function oneStepPlus() {
                var step = (_holder.find(_gal_item + ':first').outerWidth());
                _holder.animate({marginLeft: step * (-1) + 'px'}, _speed, function () {
                    $(this).append($(this).find(_gal_item + ':first'));
                    $(this).css('margin-left', '0');
                    _phase = true;
                });
            };
            function oneStepMinus() {
                var step = (_holder.find(_gal_item + ':last').outerWidth());
                _holder.css('margin-left', -step).prepend(_holder.find(_gal_item + ':last'));
                _holder.animate({marginLeft: 0}, _speed, function () {
                    $(this).css('margin-left', '0');
                    _phase = true;
                });
            };
        });
};
jQuery.fn.fadeGallery = function (_options) {
    var _options = jQuery.extend({
        slideElements: 'div.slideset > div',
        pagerLinks: false,
        btnNext: 'a.next',
        btnPrev: 'a.prev',
        btnPlayPause: 'a.play-pause',
        pausedClass: 'paused',
        playClass: 'playing',
        activeClass: 'active',
        pauseOnHover: true,
        autoRotation: false,
        autoHeight: false,
        switchTime: 3000,
        duration: 650,
        event: 'click'
    }, _options);

    return this.each(function () {
        var _this = jQuery(this);
        var _slides = jQuery(_options.slideElements, _this);
        var _pagerLinks = jQuery(_options.pagerLinks, _this);
        var _btnPrev = jQuery(_options.btnPrev, _this);
        var _btnNext = jQuery(_options.btnNext, _this);
        var _btnPlayPause = jQuery(_options.btnPlayPause, _this);
        var _pauseOnHover = _options.pauseOnHover;
        var _autoRotation = _options.autoRotation;
        var _activeClass = _options.activeClass;
        var _pausedClass = _options.pausedClass;
        var _playClass = _options.playClass;
        var _autoHeight = _options.autoHeight;
        var _duration = _options.duration;
        var _switchTime = _options.switchTime;
        var _controlEvent = _options.event;

        var _hover = false;
        var _prevIndex = 0;
        var _currentIndex = 0;
        var _slideCount = _slides.length;
        var _timer;
        if (!_slideCount) return;
        _slides.hide().eq(_currentIndex).show();
        if (_autoRotation) _this.removeClass(_pausedClass).addClass(_playClass);
        else _this.removeClass(_playClass).addClass(_pausedClass);

        if (_btnPrev.length) {
            _btnPrev.bind(_controlEvent, function () {
                prevSlide();
                return false;
            });
        }
        if (_btnNext.length) {
            _btnNext.bind(_controlEvent, function () {
                nextSlide();
                return false;
            });
        }
        if (_pagerLinks.length) {
            _pagerLinks.each(function (_ind) {
                jQuery(this).bind(_controlEvent, function () {
                    if (_currentIndex != _ind) {
                        _prevIndex = _currentIndex;
                        _currentIndex = _ind;
                        switchSlide();
                    }
                    return false;
                });
            });
        }

        if (_btnPlayPause.length) {
            _btnPlayPause.bind(_controlEvent, function () {
                if (_this.hasClass(_pausedClass)) {
                    _this.removeClass(_pausedClass).addClass(_playClass);
                    _autoRotation = true;
                    autoSlide();
                } else {
                    if (_timer) clearRequestTimeout(_timer);
                    _this.removeClass(_playClass).addClass(_pausedClass);
                }
                return false;
            });
        }

        function prevSlide() {
            _prevIndex = _currentIndex;
            if (_currentIndex > 0) _currentIndex--;
            else _currentIndex = _slideCount - 1;
            switchSlide();
        }

        function nextSlide() {
            _prevIndex = _currentIndex;
            if (_currentIndex < _slideCount - 1) _currentIndex++;
            else _currentIndex = 0;
            switchSlide();
        }

        function refreshStatus() {
            if (_pagerLinks.length) _pagerLinks.removeClass(_activeClass).eq(_currentIndex).addClass(_activeClass);
            _slides.eq(_prevIndex).removeClass(_activeClass);
            _slides.eq(_currentIndex).addClass(_activeClass);
        }

        function switchSlide() {
            _slides.stop(true, true);
            _slides.eq(_prevIndex).fadeOut(_duration);
            _slides.eq(_currentIndex).fadeIn(_duration);
            refreshStatus();
            autoSlide();
        }

        function autoSlide() {
            if (!_autoRotation || _hover) return;
            if (_timer) clearRequestTimeout(_timer);
            _timer = requestTimeout(nextSlide, _switchTime + _duration);
        }

        if (_pauseOnHover) {
            _this.hover(function () {
                _hover = true;
                if (_timer) clearRequestTimeout(_timer);
            }, function () {
                _hover = false;
                autoSlide();
            });
        }
        refreshStatus();
        autoSlide();
    });
}
/*
 * Drop in replace functions for setTimeout() & setInterval() that
 * make use of requestAnimationFrame() for performance where available
 * http://www.joelambert.co.uk
 *
 * Copyright 2011, Joe Lambert.
 * Free to use under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 */

// requestAnimationFrame() shim by Paul Irish
// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
window.requestAnimFrame = (function () {
    return  window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function (/* function */ callback, /* DOMElement */ element) {
            window.setTimeout(callback, 1000 / 60);
        };
})();
/**
 * Behaves the same as setTimeout except uses requestAnimationFrame() where possible for better performance
 * @param {function} fn The callback function
 * @param {int} delay The delay in milliseconds
 */

window.requestTimeout = function (fn, delay) {
    if (!window.requestAnimationFrame && !window.webkitRequestAnimationFrame && !window.mozRequestAnimationFrame && !window.oRequestAnimationFrame && !window.msRequestAnimationFrame)
        return window.setTimeout(fn, delay);

    var start = new Date().getTime(),
        handle = new Object();

    function loop() {
        var current = new Date().getTime(),
            delta = current - start;

        delta >= delay ? fn.call() : handle.value = requestAnimFrame(loop);
    };

    handle.value = requestAnimFrame(loop);
    return handle;
};

/**
 * Behaves the same as clearInterval except uses cancelRequestAnimationFrame() where possible for better performance
 * @param {int|object} fn The callback function
 */
window.clearRequestTimeout = function (handle) {
    window.cancelAnimationFrame ? window.cancelAnimationFrame(handle.value) :
        window.webkitCancelRequestAnimationFrame ? window.webkitCancelRequestAnimationFrame(handle.value) :
            window.mozCancelRequestAnimationFrame ? window.mozCancelRequestAnimationFrame(handle.value) :
                window.oCancelRequestAnimationFrame ? window.oCancelRequestAnimationFrame(handle.value) :
                    window.msCancelRequestAnimationFrame ? msCancelRequestAnimationFrame(handle.value) :
                        clearTimeout(handle);
};

//Fade Gallery End ==============================================================

// Scroll Gallery Start vert =========================================================


jQuery.fn.galleryScroll = function (_options) {
    // defaults options
    var _options = jQuery.extend({
        btPrev: 'a.prev',
        btNext: 'a.next',
        holderList: 'div.gallery-frame',
        scrollElParent: 'ul.gallery',
        scrollEl: '>li',
        slideNum: true,
        duration: 1000,
        step: false,
        circleSlide: true,
        disableClass: 'disable',
        funcOnclick: null,
        autoSlide: false,
        innerMargin: 0,
        stepWidth: false
    }, _options);

    return this.each(function () {
        var _this = jQuery(this);
        var _holderBlock = jQuery(_options.holderList, _this);
        var _gWidth = _holderBlock.height() + 5;
        var _animatedBlock = jQuery(_options.scrollElParent, _holderBlock);
        var _liWidth = jQuery(_options.scrollEl, _animatedBlock).outerHeight(true);
        var _liSum = jQuery(_options.scrollEl, _animatedBlock).length * _liWidth;
        var _margin = -_options.innerMargin;
        var f = 0;
        var _step = 0;
        var _autoSlide = _options.autoSlide;
        var _timerSlide = null;
        if (!_options.step) _step = _gWidth; else _step = _options.step * _liWidth;
        if (_options.stepWidth) _step = _options.stepWidth;

        if (!_options.circleSlide) {
            if (_options.innerMargin == _margin)
                jQuery(_options.btPrev, _this).addClass('prev-' + _options.disableClass);
        }
        if (_options.slideNum && !_options.step) {
            var _lastSection = 0;
            var _sectionWidth = 0;
            while (_sectionWidth < _liSum) {
                _sectionWidth = _sectionWidth + _gWidth;
                if (_sectionWidth > _liSum) {
                    _lastSection = _sectionWidth - _liSum;
                }
            }
        }
        if (_autoSlide) {
            _timerSlide = setTimeout(function () {
                autoSlide(_autoSlide);
            }, _autoSlide);
            _animatedBlock.hover(function () {
                clearTimeout(_timerSlide);
            }, function () {
                _timerSlide = setTimeout(function () {
                    autoSlide(_autoSlide)
                }, _autoSlide);
            });
        }

        // click button 'Next'
        jQuery(_options.btNext, _this).bind('click', function () {
            jQuery(_options.btPrev, _this).removeClass('prev-' + _options.disableClass);
            if (!_options.circleSlide) {
                if (_margin + _step > _liSum - _gWidth - _options.innerMargin) {
                    if (_margin != _liSum - _gWidth - _options.innerMargin) {
                        _margin = _liSum - _gWidth + _options.innerMargin;
                        jQuery(_options.btNext, _this).addClass('next-' + _options.disableClass);
                        _f2 = 0;
                    }
                } else {
                    _margin = _margin + _step;
                    if (_margin == _liSum - _gWidth - _options.innerMargin) {
                        jQuery(_options.btNext, _this).addClass('next-' + _options.disableClass);
                        _f2 = 0;
                    }
                }
            } else {
                if (_margin + _step > _liSum - _gWidth + _options.innerMargin) {
                    if (_margin != _liSum - _gWidth + _options.innerMargin) {
                        _margin = _liSum - _gWidth + _options.innerMargin;
                    } else {
                        _f2 = 1;
                        _margin = -_options.innerMargin;
                    }
                } else {
                    _margin = _margin + _step;
                    _f2 = 0;
                }
            }

            _animatedBlock.animate({marginTop: -_margin + "px"}, {queue: false, duration: _options.duration });

            if (_timerSlide) {
                clearTimeout(_timerSlide);
                _timerSlide = setTimeout(function () {
                    autoSlide(_options.autoSlide)
                }, _options.autoSlide);
            }

            if (_options.slideNum) {
                jQuery.fn.galleryScroll.numListActive(_margin, jQuery(_options.slideNum, _this), _gWidth, _lastSection);

            }
            if (jQuery.isFunction(_options.funcOnclick)) {
                _options.funcOnclick.apply(_this);
            }
            return false;
        });
        // click button 'Prev'
        var _f2 = 1;
        jQuery(_options.btPrev, _this).bind('click', function () {
            jQuery(_options.btNext, _this).removeClass('next-' + _options.disableClass);
            if (_margin - _step >= -_step - _options.innerMargin && _margin - _step <= -_options.innerMargin) {
                if (_f2 != 1) {
                    _margin = -_options.innerMargin;
                    _f2 = 1;
                } else {
                    if (_options.circleSlide) {
                        _margin = _liSum - _gWidth + _options.innerMargin;
                        f = 1;
                        _f2 = 0;
                    } else {
                        _margin = -_options.innerMargin
                    }
                }
            } else if (_margin - _step < -_step + _options.innerMargin) {
                _margin = _margin - _step;
                f = 0;
            }
            else {
                _margin = _margin - _step;
                f = 0;
            }
            ;

            if (!_options.circleSlide && _margin == _options.innerMargin) {
                jQuery(this).addClass('prev-' + _options.disableClass);
                _f2 = 0;
            }

            if (!_options.circleSlide && _margin == -_options.innerMargin) jQuery(this).addClass('prev-' + _options.disableClass);
            _animatedBlock.animate({marginTop: -_margin + "px"}, {queue: false, duration: _options.duration});

            if (_options.slideNum) jQuery.fn.galleryScroll.numListActive(_margin, jQuery(_options.slideNum, _this), _gWidth, _lastSection);

            if (_timerSlide) {
                clearTimeout(_timerSlide);
                _timerSlide = setTimeout(function () {
                    autoSlide(_options.autoSlide)
                }, _options.autoSlide);
            }

            if (jQuery.isFunction(_options.funcOnclick)) {
                _options.funcOnclick.apply(_this);
            }
            return false;
        });

        if (_liSum <= _gWidth) {
            jQuery(_options.btPrev, _this).addClass('prev-' + _options.disableClass).unbind('click');
            jQuery(_options.btNext, _this).addClass('next-' + _options.disableClass).unbind('click');
        }
        // auto slide
        function autoSlide(autoSlideDuration) {
            //if (_options.circleSlide) {
            jQuery(_options.btNext, _this).trigger('click');
            //}
        };
        // Number list
        jQuery.fn.galleryScroll.numListCreate = function (_elNumList, _liSumWidth, _width, _section) {
            var _numListElC = '';
            var _num = 2;
            var _difference = jQuery(_options.scrollEl, _animatedBlock).size();
            while (_difference) {
                _numListElC += '<li><a href="">' + _num + '</a></li>';
                _num++;
                _difference--;
            }
            //jQuery(_elNumList).html('<ul>'+_numListElC+'</ul>');
        };
        jQuery.fn.galleryScroll.numListActive = function (_marginEl, _slideNum, _width, _section) {
            if (_slideNum) {
                jQuery('a', _slideNum).removeClass('active');
                var _activeRange = _width - _section - 1;
                var _n = 0;
                if (_marginEl != 0) {
                    while (_marginEl > _activeRange) {
                        _activeRange = (_n * _width) - _section - 1 + _options.innerMargin;
                        _n++;
                    }
                }
                var _a = _marginEl / _width;
                jQuery('a', _slideNum).eq(Math.round(_a)).addClass('active');
            }
        };
        if (_options.slideNum) {
            jQuery.fn.galleryScroll.numListCreate(jQuery(_options.slideNum, _this), _liSum, _gWidth, _lastSection);
            jQuery.fn.galleryScroll.numListActive(_margin, jQuery(_options.slideNum, _this), _gWidth, _lastSection);
            numClick();
        }
        ;
        function numClick() {
            jQuery(_options.slideNum, _this).find('a').click(function () {
                jQuery(_options.btPrev, _this).removeClass('prev-' + _options.disableClass);
                jQuery(_options.btNext, _this).removeClass('next-' + _options.disableClass);

                var _indexNum = jQuery(_options.slideNum, _this).find('a').index(jQuery(this));
                _margin = (_step * _indexNum) - _options.innerMargin;
                f = 0;
                _f2 = 0;
                if (_indexNum == 0) _f2 = 1;
                if (_margin + _step > _liSum) {
                    _margin = _margin - (_margin - _liSum) - _step + _options.innerMargin;
                    if (!_options.circleSlide) jQuery(_options.btNext, _this).addClass('next-' + _options.disableClass);
                }
                _animatedBlock.animate({marginTop: -_margin + "px"}, {queue: false, duration: _options.duration});

                if (!_options.circleSlide && _margin == 0) jQuery(_options.btPrev, _this).addClass('prev-' + _options.disableClass);
                jQuery.fn.galleryScroll.numListActive(_margin, jQuery(_options.slideNum, _this), _gWidth, _lastSection);

                if (_timerSlide) {
                    clearTimeout(_timerSlide);
                    _timerSlide = setTimeout(function () {
                        autoSlide(_options.autoSlide)
                    }, _options.autoSlide);
                }
                $(this).addClass('active').parent().siblings().find('a').removeClass('active');
                return false;
            });
        };
    });
}

//Scroll Gallery End =================================================================

jQuery.fn.galleryScroll2 = function (_options) {
    var _options = jQuery.extend({
        btPrev: 'a.prev',
        btNext: 'a.next',
        holderList: '.gallery-holder',
        scrollElParent: 'ul',
        scrollEl: 'li',
        slideNum: '.switcher',
        duration: 1000,
        step: false,
        circleSlide: true,
        disableClass: 'disable',
        funcOnclick: null,
        autoSlide: false,
        innerMargin: 0,
        stepWidth: false,
        fix: 0
    }, _options);
    return this.each(function () {
        var _this = jQuery(this);
        var _holderBlock = jQuery(_options.holderList, _this);
        var _gWidth = _holderBlock.width();
        var _animatedBlock = jQuery(_options.scrollElParent, _holderBlock);
        var _liWidth = jQuery(_options.scrollEl, _animatedBlock).outerWidth(true);
        var _liSum = jQuery(_options.scrollEl, _animatedBlock).length * _liWidth;
        if (_options.fix) {
            _liSum -= _options.fix;
        }
        var _margin = -_options.innerMargin;
        var f = 0;
        var _step = 0;
        var _autoSlide = _options.autoSlide;
        var _timerSlide = null;
        if (!_options.step) _step = _gWidth; else _step = _options.step * _liWidth;
        if (_options.stepWidth) _step = _options.stepWidth;

        if (!_options.circleSlide) {
            if (_options.innerMargin == _margin)
                jQuery(_options.btPrev, _this).addClass('prev-' + _options.disableClass);
        }
        if (_options.slideNum && !_options.step) {
            var _lastSection = 0;
            var _sectionWidth = 0;
            while (_sectionWidth < _liSum) {
                _sectionWidth = _sectionWidth + _gWidth;
                if (_sectionWidth > _liSum) {
                    _lastSection = _sectionWidth - _liSum;
                }
            }
        }
        if (_autoSlide) {
            _timerSlide = setTimeout(function () {
                autoSlide(_autoSlide);
            }, _autoSlide);
            _animatedBlock.hover(function () {
                clearTimeout(_timerSlide);
            }, function () {
                _timerSlide = setTimeout(function () {
                    autoSlide(_autoSlide)
                }, _autoSlide);
            });
        }
        jQuery(_options.btNext, _this).unbind('click');
        jQuery(_options.btPrev, _this).unbind('click');
        jQuery(_options.btNext, _this).bind('click', function (e) {
            jQuery(_options.btPrev, _this).removeClass('prev-' + _options.disableClass);
            if (!_options.circleSlide) {
                if (_margin + _step > _liSum - _gWidth - _options.innerMargin) {
                    if (_margin != _liSum - _gWidth - _options.innerMargin) {
                        _margin = _liSum - _gWidth + _options.innerMargin;
                        jQuery(_options.btNext, _this).addClass('next-' + _options.disableClass);
                        _f2 = 0;
                    }
                } else {
                    _margin = _margin + _step;
                    if (_margin == _liSum - _gWidth - _options.innerMargin) {
                        jQuery(_options.btNext, _this).addClass('next-' + _options.disableClass);
                        _f2 = 0;
                    }
                }
            } else {
                if (_margin + _step > _liSum - _gWidth + _options.innerMargin) {
                    if (_margin != _liSum - _gWidth + _options.innerMargin) {

                        _margin = _liSum - _gWidth + _options.innerMargin;
                    } else {
                        _f2 = 1;
                        _margin = -_options.innerMargin;

                    }
                } else {
                    _margin = _margin + _step;
                    _f2 = 0;
                }
            }

            _animatedBlock.animate({marginLeft: -_margin + "px"}, {queue: false, duration: _options.duration });

            if (_timerSlide) {
                clearTimeout(_timerSlide);
                _timerSlide = setTimeout(function () {
                    autoSlide(_options.autoSlide)
                }, _options.autoSlide);
            }

            if (_options.slideNum && !_options.step) jQuery.fn.galleryScroll.numListActive(_margin, jQuery(_options.slideNum, _this), _gWidth, _lastSection);
            if (jQuery.isFunction(_options.funcOnclick)) {
                _options.funcOnclick.apply(_this);
            }
            e.preventDefault();
        });
        var _f2 = 1;
        jQuery(_options.btPrev, _this).bind('click', function (e) {
            jQuery(_options.btNext, _this).removeClass('next-' + _options.disableClass);
            if (_margin - _step >= -_step - _options.innerMargin && _margin - _step <= -_options.innerMargin) {
                if (_f2 != 1) {
                    _margin = -_options.innerMargin;
                    _f2 = 1;
                } else {
                    if (_options.circleSlide) {
                        _margin = _liSum - _gWidth + _options.innerMargin;
                        f = 1;
                        _f2 = 0;
                    } else {
                        _margin = -_options.innerMargin
                    }
                }
            } else if (_margin - _step < -_step + _options.innerMargin) {
                _margin = _margin - _step;
                f = 0;
            }
            else {
                _margin = _margin - _step;
                f = 0;
            }
            ;

            if (!_options.circleSlide && _margin == _options.innerMargin) {
                jQuery(this).addClass('prev-' + _options.disableClass);
                _f2 = 0;
            }

            if (!_options.circleSlide && _margin == -_options.innerMargin) jQuery(this).addClass('prev-' + _options.disableClass);
            _animatedBlock.animate({marginLeft: -_margin + "px"}, {queue: false, duration: _options.duration});

            if (_options.slideNum && !_options.step) jQuery.fn.galleryScroll.numListActive(_margin, jQuery(_options.slideNum, _this), _gWidth, _lastSection);

            if (_timerSlide) {
                clearTimeout(_timerSlide);
                _timerSlide = setTimeout(function () {
                    autoSlide(_options.autoSlide)
                }, _options.autoSlide);
            }

            if (jQuery.isFunction(_options.funcOnclick)) {
                _options.funcOnclick.apply(_this);
            }
            e.preventDefault();
        });

        if (_liSum <= _gWidth) {
            jQuery(_options.btPrev, _this).addClass('prev-' + _options.disableClass).unbind('click');
            jQuery(_options.btNext, _this).addClass('next-' + _options.disableClass).unbind('click');
        }
        // auto slide
        function autoSlide(autoSlideDuration) {
            //if (_options.circleSlide) {
            jQuery(_options.btNext, _this).trigger('click');
            //}
        };
        // Number list
        jQuery.fn.galleryScroll.numListCreate = function (_elNumList, _liSumWidth, _width, _section) {
            var _numListElC = '';
            var _num = 1;
            var _difference = _liSumWidth + _section;
            while (_difference > 0) {
                _numListElC += '<li><a href="">' + _num + '</a></li>';
                _num++;
                _difference = _difference - _width;
            }
            jQuery(_elNumList).html('<ul class="control">' + _numListElC + '</ul>');
        };
        jQuery.fn.galleryScroll.numListActive = function (_marginEl, _slideNum, _width, _section) {
            if (_slideNum) {
                jQuery('a', _slideNum).removeClass('active');
                var _activeRange = _width - _section - 1;
                var _n = 0;
                if (_marginEl != 0) {
                    while (_marginEl > _activeRange) {
                        _activeRange = (_n * _width) - _section - 1 + _options.innerMargin;
                        _n++;
                    }
                }
                var _a = (_activeRange + _section + 1 + _options.innerMargin) / _width - 1;
                jQuery('a', _slideNum).eq(_a).addClass('active');
            }
        };
        if (_options.slideNum && !_options.step) {

            jQuery.fn.galleryScroll.numListCreate(jQuery(_options.slideNum, _this), _liSum, _gWidth, _lastSection);
            jQuery.fn.galleryScroll.numListActive(_margin, jQuery(_options.slideNum, _this), _gWidth, _lastSection);
            numClick();
        }
        ;
        function numClick() {
            jQuery(_options.slideNum, _this).find('a').click(function (e) {
                jQuery(_options.btPrev, _this).removeClass('prev-' + _options.disableClass);
                jQuery(_options.btNext, _this).removeClass('next-' + _options.disableClass);

                var _indexNum = jQuery(_options.slideNum, _this).find('a').index(jQuery(this));
                _margin = (_step * _indexNum) - _options.innerMargin;
                f = 0;
                _f2 = 0;
                if (_indexNum == 0) _f2 = 1;
                if (_margin + _step > _liSum) {
                    _margin = _margin - (_margin - _liSum) - _step + _options.innerMargin;
                    if (!_options.circleSlide) jQuery(_options.btNext, _this).addClass('next-' + _options.disableClass);
                }
                _animatedBlock.animate({marginLeft: -_margin + "px"}, {queue: false, duration: _options.duration});

                if (!_options.circleSlide && _margin == 0) jQuery(_options.btPrev, _this).addClass('prev-' + _options.disableClass);
                jQuery.fn.galleryScroll.numListActive(_margin, jQuery(_options.slideNum, _this), _gWidth, _lastSection);

                if (_timerSlide) {
                    clearTimeout(_timerSlide);
                    _timerSlide = setTimeout(function () {
                        autoSlide(_options.autoSlide)
                    }, _options.autoSlide);
                }
                e.preventDefault();
            });
        };
        jQuery(window).resize(function () {
            _gWidth = _holderBlock.width();
            _liWidth = jQuery(_options.scrollEl, _animatedBlock).outerWidth(true);
            _liSum = jQuery(_options.scrollEl, _animatedBlock).length * _liWidth;
            if (!_options.step) _step = _gWidth; else _step = _options.step * _liWidth;
            if (_options.slideNum && !_options.step) {
                var _lastSection = 0;
                var _sectionWidth = 0;
                while (_sectionWidth < _liSum) {
                    _sectionWidth = _sectionWidth + _gWidth;
                    if (_sectionWidth > _liSum) {
                        _lastSection = _sectionWidth - _liSum;
                    }
                }
                ;
            }
            ;
        });
    });
}