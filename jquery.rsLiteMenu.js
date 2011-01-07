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
        
        if (!Array.prototype.indexOf) { // IE does not support indexOf(), so implement it. Other browsers will use the native indexOf()
            Array.prototype.indexOf = function (obj, start) {
                for (var i = (start || 0); i < this.length; i++) {
                    if (this[i] === obj) {
                        return i;
                    }
                }
                return -1;
            }
        }

        var openSubMenus = {
            stackObjs: [],      // stack of DOM elements that need to appear/disappear
            stackHidden: [],    // stack of booleans that specify if the DOM element (from stackObjs at same index) should be hidden during pop

            push: function (element, hidden) {
                this.stackObjs.push(element);
                this.stackHidden.push(hidden);
            },

            pop: function () {
                if (this.stackObjs.length == 0) {
                    return null;
                } else {
                    this.stackHidden.pop();
                    return this.stackObjs.pop();
                }
            },

            setVisible: function (element) {
                var index = this.stackObjs.indexOf(element);
                if (index == -1) {
                    // the element does not exist in the stack: push it and display it
                    this.push(element, false);
                    defaults.onShowSubmenu($(element));
                } else {
                    // the element already exists in the stack: just update the flag to be visible
                    this.stackHidden[index] = false;
                }
            },

            setHidden: function (element) {
                var index = this.stackObjs.indexOf(element);
                if (index > -1) {
                    // flag this element to be hidden
                    this.stackHidden[index] = true;
                    // if this is top element in stack, then...
                    if (index == this.stackObjs.length - 1) {
                        // ... hide it and pop it. Keep hiding and poping the top stack elements as long as they are flagged to hidden
                        while (index > -1 && this.stackHidden[index]) {
                            defaults.onHideSubmenu($(this.stackObjs[index--]));
                            this.pop();
                        }
                    }
                }
            }
        };

        // defaults input parameters
        var defaults = {

            // invoked when a UL or OL elements needs to become visible (when the mouse enters the area)
            onShowSubmenu: function (element) {
                element.show();
            },

            // invoked when a UL or OL elements needs to become hidden (when the mouse leaves the area)
            onHideSubmenu: function (element) {
                element.hide();
            }
        },

        showSubMenuFromLI = function (liElement) {
            // get the UL or OL children of this LI
            var ulOlElements = $("ul, ol", liElement);
            if (ulOlElements.length > 0) {
                openSubMenus.setVisible(ulOlElements.first()[0]);
            }
        },

        hideSubMenuFromULorOL = function (ulOlElement) {
            openSubMenus.setHidden(ulOlElement);
        },

        hideSubMenuFromLI = function (liElement) {
            // get the UL or OL children of this LI
            var ulOlElements = $("ul, ol", liElement);
            if (ulOlElements.length > 0) {
                hideSubMenuFromULorOL(ulOlElements.first()[0]);
            }
        };

        return this.each(function () {
            var menuCtrl = $(this);

            // if options is not empty, then merge with the default settings
            if (options) {
                $.extend(defaults, options);
            }

            // initially we want only the top level LI to be visible, all the other submenus are hidden
            $("ul, ol", menuCtrl).hide().mouseleave(function () {
                hideSubMenuFromULorOL(this);
            });

            $("li", menuCtrl).mouseenter(function () {
                showSubMenuFromLI(this);
            }).mouseleave(function () {
                hideSubMenuFromLI(this);
            });
        });
    };
})(jQuery);
