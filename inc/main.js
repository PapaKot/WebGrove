$(document).ready(function(){$('.md-modal').css('display','block');$(".tabs-menu a").click(function(event){event.preventDefault();$(this).parent().addClass("current");$(this).parent().siblings().removeClass("current");var tab=$(this).attr("href");$(".tab-content").not(tab).css("display","none");$(tab).fadeIn();});if($.fn.galleryScroll2){initSlideShow();}$('.order-form__aside_short input, .order-form__aside_short textarea').on('focus',function(){$('.dog-block').addClass('smile');});$('.order-form__aside_short input, .order-form__aside_short textarea').on('blur',function(){$('.dog-block').removeClass('smile');});$('input, textarea').focus(function(){$(this).closest('div').addClass('parent-focus');}).blur(function(){$(this).closest('div').removeClass('parent-focus');});if($.fn.placeholder){$('input, textarea').placeholder();}$('.input-file').click(function(e){e.preventDefault();$(this).next('input[type="file"]').trigger('click')});$('input[type="file"]').change(function(){$(this).next('.fileinfo').text($(this).val().split(/(\\|\/)/g).pop())})
$('.scroll_to_quote').click(function(e){e.preventDefault()
$('html,body').animate({scrollTop:$('#quote_form').offset().top},function(){$('#quote_form').find(':text:first').focus()});})
if($('#order').length==1&&document.location.hash=='#order'){$('#order').find(':text:first').focus()}$('.main-gallery__button-next').click(function(e){var slide=parseInt($('.main-gallery__holder').data('slide'))
if(slide<$('.main-gallery__holder > *').length){show_slide(slide+1)}})
$('.main-gallery__button-prev').click(function(e){var slide=parseInt($('.main-gallery__holder').data('slide'))
if(slide>1){show_slide(slide-1)}})
if($.fn.swipe){$('.main-gallery__holder').swipe({swipeLeft:function(){$('.main-gallery__button-next').trigger('click')},swipeRight:function(){$('.main-gallery__button-prev').trigger('click')}})}function show_slide(n){if($('.main-gallery__holder').data('slide')!=n){var next_slide=n-1;var offset=-next_slide*1180
var current_slide=Math.round(Math.abs($('.main-gallery__holder').position().left/1180))
var inner_offset=(n>current_slide)?-100:100;$('.main-nav > *').removeClass('active').eq(next_slide).addClass('active')
$('.main-gallery__holder > *').eq(next_slide).find('.main-slide').css('right',inner_offset+'px')
$('.main-gallery__holder').stop(true).animate({left:offset},300,'easeInExpo',function(){$('.main-gallery__holder > *').eq(next_slide).find('.main-slide').animate({right:0},150,'easeOutBack');var slides=$('.main-gallery__holder > *').length
if(n==slides){$('.main-gallery__button-next').hide()
$('.main-gallery__button-prev').show()}else if(n==1){$('.main-gallery__button-next').show()
$('.main-gallery__button-prev').hide()}else{$('.main-gallery__button-next').show()
$('.main-gallery__button-prev').show()}$('.main-gallery__button-next').attr('href',$('.main-nav a').eq(next_slide+1).attr('href'))
$('.main-gallery__button-prev').attr('href',$('.main-nav a').eq(next_slide-1).attr('href'))}).data('slide',n)}}$('.main-nav a').click(function(e){show_slide($(this).data('slide'))})
if($('.main-gallery__holder').length>0&&document.location.hash){var slide=$('.main-nav a[href="'+document.location.hash+'"]').data('slide')
if(slide){show_slide(slide)}}$(".services-item__left-block, .team-item").hover(function(){$(this).find('img.grey').stop().animate({"opacity":"0"},300);},function(){$(this).find('img.grey').stop().animate({"opacity":"1"},300);});$('.reviews.btn-ajax').click(function(){var _this=this
$.get($(this).data('url'),{'page':$(this).data('page')},function(response){$('.reviews-list').append(response)
if(response.indexOf('last page')!=-1){$(_this).hide();}else{$(_this).data('page',parseInt($(_this).data('page'))+1)}});return false;});$('.works.btn-ajax').click(function(){var _this=this
$.getJSON($(this).data('url'),{'page':$(this).data('page')},function(response){if(response.cases){$('.promotion-list').append(response.cases)}if(response.works){$('.works-development-list').append(response.works)}if(response.works_last_page&&response.cases_last_page){$(_this).hide();}else{$(_this).data('page',parseInt($(_this).data('page'))+1)}});return false;});$('#callback_form').submit(function(e){e.preventDefault()
$(this).find('input').removeClass('error')
$(this).find('.error').remove()
var form=this
$.ajax({'method':'post','dataType':'json','url':$(this).attr('action'),'data':$(this).serialize(),'success':function(response){if(response.success){$('#modal-7 .content').html('\
                    <div class="OK ">Заявка успешно отправлена</div>\
                    <input class="md-close" type="submit" value="OK">\
                    <span class="md-close">Закрыть</span>')}else{$.each(response.errors,function(field,errors){console.log()
$(form).find('[name^="'+field+'"]:visible').addClass('error').parent('div').append('<label class="error">'+errors.join(', ')+'</label>')})}}})})
$('.capcha img').click(function(){var img=this
var hidden=$(this).closest('.form-item').find(':hidden')
$.getJSON($(this).closest('.form-item').data('url'),{},function(json){$(img).attr('src',json.image_url)
hidden.val(json.key)});})
if($.fn.jcarousel){$('.jcarousel').jcarousel()
$('.jcarousel-prev').click(function(e){e.preventDefault()
$('.jcarousel').jcarousel('scroll','-=1');});$('.jcarousel-next').click(function(e){e.preventDefault()
$('.jcarousel').jcarousel('scroll','+=1');});}});$(window).resize(function(){if($(window).width()<1180){$('.main-gallery').css('left',-(1180-$(window).width()+24)+'px')}else{$('.main-gallery').css('left',0);}});$(window).trigger('resize');function initSlideShow(){$('.positions-gallery').galleryScroll2({btPrev:'a.position-gallery-prev',btNext:'a.position-gallery-next',holderList:'div.position-gallery__mask',scrollElParent:'ul.positions-gallery__holder',scrollEl:'>li',slideNum:false,duration:300,step:1,circleSlide:true,disableClass:'disable',funcOnclick:null,autoSlide:false,innerMargin:0});$(".revievs-controls.home").galleryScroll({btPrev:'a.revievs-controls__button-prev',btNext:'a.revievs-controls__button-next',holderList:'div.revievs-controls__gallery-mask',scrollElParent:'ul.revievs-controls__gallery-holder',scrollEl:'>li',slideNum:false,duration:1000,step:1,circleSlide:true,disableClass:'disable',funcOnclick:null,autoSlide:false,innerMargin:0,stepWidth:223})}