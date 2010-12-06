/**
* jQuery Lite Menu - A simple menu renderer
* ====================================================
* jQuery Lite Menu displays a multi-level menu.
* This plug-in simply notifies when a sub menu should be visible or hidden. By default, they appear or disappear immediately, without fancy animations.
* However, the user can override the default behavior and apply custom animations for the onShowSubmenu and OnHideSubmenu.
* Everything else is configurable through CSS.
*
* Licensed under The MIT License
* 
* @version   0.1
* @since     12.05.2010
* @author    Jose Rui Santos
* @web       http://ruisoftware.com/
*
* 
* Input parameter  Default value  Remarks
* ================ =============  ===============================================================================================
* onShowSubmenu                   Override this parameter to specify a custom behavior when a submenu (children of UL or OL elements need to show)
* onHideSubmenu                   Override this parameter to specify a custom behavior when a submenu (all children of UL or OL elements need to hide)
*
* 
* Usage with default values:
* ==========================
* $('#menu').rsLiteMenu();
*
* <ul id="menu">
*   <li>Home</li>
*   <li>Blog</li>
*   <li>Shopping
*       <ul>
*         <li>Electronics</li>
*         <li>Clothes
*             <ol>
*                 <li>Men</li>
*                 <li>Women</li>
*                 <li>Children</li>
*             </ol>
*         </li>
*         <li>Food</li>
*       </ul>
*   </li>
*   <li>About</li>
* </ul>
*
*
*/
(function ($) {
    $.fn.rsLiteMenu = function (options) {

        // defaults input parameters
        var defaults = {
    
            // invoked when mouse enters a parent element
            onShowSubmenu: function (parent) {
                $(parent).children().show();       // show immediate children
            },

            // invoked when mouse leaves a parent element
            onHideSubmenu: function (parent) {
                $("ul, ol", parent).hide();        // hide all descendants
            }
        };

        return this.each(function () {
            var menuCtrl = $(this);

            // if options is not empty, then merge with the default settings
            if (options) {
                $.extend(defaults, options);
            }

            $("ul, ol", menuCtrl).hide();

            $("li", menuCtrl).mouseenter(function () {
                defaults.onShowSubmenu(this);
            }).mouseleave(function () {
                defaults.onHideSubmenu(this);
            });
        });
    };
})(jQuery);
