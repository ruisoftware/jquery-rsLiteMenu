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
* @version   1
* @since     12.05.2010
* @author    Jose Rui Santos
* @web       http://ruisoftware.com/
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
* Input parameter       Default value  Remarks
* ---------------------------------------------------------------------------------------------------------------------------------------------------------
* onShowSubmenu                        Override this parameter to specify a custom behavior when a submenu (children of UL or OL elements need to show)
* onHideSubmenu                        Override this parameter to specify a custom behavior when a submenu (all children of UL or OL elements need to hide)
* hideOnlyTopSubMenus   false          If true, only the 1st level submenus are hidden when the mouse leaves their submenu area.
*                                      If false, all submenus are hidden (regardeless of their deepness level) when the mouse leaves their submenu area.
*
* Method      Description
* ---------------------------------------------------------------------------------------------------------------------------------------------------------
* 'destroy'   Unbinds all events and completely removes the plugin from the page.       
*             Usage:  $e.rsLiteMenu('destroy')
*/
(function ($) {
    var LiteMenuClass = function ($elem, opts) {
        var $topSubmenus = $elem.children("li").children("ul, ol"),
            init = function () {
                // initially we want only the top level LI to be visible, all the other submenus are hidden
                $("ul, ol", $elem).hide();

                $("li:has(ul,ol)", $elem).
                    bind('mouseenter.rsLiteMenu', onMouseEnter).
                    bind('mouseleave.rsLiteMenu', onMouseLeave);
                $elem.bind('destroy.rsLiteMenu', onDestroy);
            },
            onMouseEnter = function () {
                showSubMenu($(this));
            },
            onMouseLeave = function () {
                hideSubMenu($(this));
            },
            subMenuManager = {
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

                setVisible: function ($element) {
                    var element = $element[0],
                        index = $.inArray(element, this.stackObjs);
                    if (index == -1) {
                        // the element does not exist in the stack: push it and display it
                        this.push(element, false);
                        if (opts.onShowSubmenu) {
                            opts.onShowSubmenu($element);
                        }
                    } else {
                        // the element already exists in the stack: just update the flag to be visible
                        this.stackHidden[index] = false;
                    }
                },

                setHidden: function (element) {
                    var index = $.inArray(element, this.stackObjs);
                    if (index > -1) {
                        // flag this element to be hidden
                        this.stackHidden[index] = true;
                        // if this is top element in stack, then...
                        if (index == this.stackObjs.length - 1) {
                            // ... hide it and pop it. Keep hiding and poping the top stack elements as long as they are flagged to hidden
                            while (index > -1 && this.stackHidden[index]) {
                                if (opts.onHideSubmenu) {
                                    opts.onHideSubmenu($(this.stackObjs[index]));
                                }
                                --index;
                                this.pop();
                            }
                        }
                    }
                },

                setHiddenAll: function (element) {
                    var index = $.inArray(element, this.stackObjs);
                    if (index > -1) {
                        index = this.stackObjs.length - 1;
                        while (index > -1) {
                            if (opts.onHideSubmenu) {
                                opts.onHideSubmenu($(this.stackObjs[index]));
                            }
                            --index;
                            this.pop();
                        }
                    }
                }

            },

            showSubMenu = function ($liElement) {
                // get the UL or OL children of this LI
                var $ulOlElements = $liElement.children("ul, ol");
                if ($ulOlElements.length > 0) {
                    subMenuManager.setVisible($ulOlElements.eq(0));
                }
            },

            hideSubMenu = function ($liElement) {
                // get the UL or OL children of this LI
                var $ulOlElements = $liElement.children("ul, ol");
                if ($ulOlElements.length > 0) {
                    // should only hide the topmost lists?
                    if (opts.hideOnlyTopSubMenus) {
                        // if yes, then check if the given $liElement contains a topmost list
                        if ($topSubmenus.filter($liElement.children("ul, ol")).length > 0) {
                            subMenuManager.setHiddenAll($ulOlElements[0]);
                        }
                    } else {
                        subMenuManager.setHidden($ulOlElements[0]);
                    }
                }
            },

            onDestroy = function () {
                $("li:has(ul,ol)", $elem).
                    unbind('mouseenter.rsLiteMenu', onMouseEnter).
                    unbind('mouseleave.rsLiteMenu', onMouseLeave);
                $elem.unbind('destroy.rsLiteMenu', onDestroy);
            };

        init();
    };
    $.fn.rsLiteMenu = function (options) { 
        var destroy = function () {
            this.trigger('destroy.rsLiteMenu');
        };
        if (typeof options === 'string') {
            var otherArgs = Array.prototype.slice.call(arguments, 1);
            switch (options) {
                case 'destroy': return destroy.call(this);
                default: return this;
            }
        }

        var opts = $.extend({}, $.fn.rsLiteMenu.defaults, options);
        return this.each(function () {
            new LiteMenuClass($(this), opts);
        });
    };

    // public access to the default input parameters
    $.fn.rsLiteMenu.defaults = {

        // invoked when a UL or OL elements needs to become visible (when the mouse enters the area)
        onShowSubmenu: function ($element) {
            $element.show();
        },

        // invoked when a UL or OL elements needs to become hidden (when the mouse leaves the area)
        onHideSubmenu: function ($element) {
            $element.hide();
        },

        // If true, only the 1st level submenus are hidden when the mouse leaves their submenu area.
        // If false, all submenus are hidden (regardeless of their deepness level) when the mouse leaves their submenu area.
        hideOnlyTopSubMenus: false
    };

})(jQuery);
