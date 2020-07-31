var modCss = function() {
          if (appendToBody && self.dropdownMenu) {
              var pos = $position.positionElements(self.$element, self.dropdownMenu, 'bottom-left', true);
              var css = {
                      top: pos.top + 'px',
                      display: isOpen ? 'block' : 'none'
              };

              var rightalign = self.dropdownMenu.hasClass('dropdown-menu-right');
              if (!rightalign) {
                  css.left = pos.left + 'px';
                  css.right = 'auto';
              } else {
                  css.left = 'auto';
                  css.right = (window.innerWidth - (pos.left + self.$element.prop('offsetWidth'))) + 'px';
              }

              self.dropdownMenu.css(css);
          }
      };
      if (isOpen) {
          if (self.dropdownMenuTemplateUrl) {
              $templateRequest(self.dropdownMenuTemplateUrl).then(function(tplContent) {
                  templateScope = scope.$new();
                  $compile(tplContent.trim())(templateScope, function(dropdownElement) {
                      var newEl = dropdownElement;
                      self.dropdownMenu.replaceWith(newEl);
                      self.dropdownMenu = newEl;
                      modCss();
                  });
              });
          } else {
              modCss();
          }
          scope.focusToggleElement();
          dropdownService.open(scope);
      } else {
          if (self.dropdownMenuTemplateUrl) {
              if (templateScope) {
                  templateScope.$destroy();
              }
              var newEl = angular.element('<ul class="dropdown-menu"></ul>');
              self.dropdownMenu.replaceWith(newEl);
              self.dropdownMenu = newEl;
          }

          dropdownService.close(scope);
          self.selectedOption = null;
          modCss();
      }














      angular.module('clientApp')
  .directive('searchField', function () {
    return {
        restrict: 'E',
        replace: true,
        scope: {asyncselected: '='},
        compile: function (element, $scope) {
            // Typeahead
            var x = '<input type="text" \
                class="form-control" \
                placeholder="Search..." \
                ng-model="Ctrl.asyncSelected" \
                typeahead="s for s in Ctrl.suggestions" \
                typeahead-min-length="3" \
                typeahead-loading="loadingSuggestions" \
                typeahead-on-select="Ctrl.doSearch($item, $model, $label)" \
            />';
            element.append(x);

            // Little trick to have a working scroll on key press
            element.bind('keydown', function (evt) {
                if(evt.which===40){
                    $('ul.dropdown-menu')[0].scrollTop = ($('ul.dropdown-menu li.active').index() + 1) * 26;
                }
            });
            element.bind('keyup', function (evt) {
                if(evt.which===38){
                    $('ul.dropdown-menu')[0].scrollTop = ($('ul.dropdown-menu li.active').index()) * 26;
                }
            });
        }
    };
});










      if (angular.isDefined($attrs.dropdownAppendTo)) {
        var appendToEl = $parse($attrs.dropdownAppendTo)(scope);
        if (appendToEl) {
            appendTo = angular.element(appendToEl);
        }
    }

    if (angular.isDefined($attrs.dropdownAppendToBody)) {
        var appendToBodyValue = $parse($attrs.dropdownAppendToBody)(scope);
        if (appendToBodyValue !== false) {
            appendToBody = true;
        }
    }

    if (appendToBody && !appendTo) {
        appendTo = body;
    }

    if (appendTo && self.dropdownMenu) {
        if (isOpen) {
            appendTo.append(self.dropdownMenu);
            $element.on('$destroy', removeDropdownMenu);
        } else {
            $element.off('$destroy', removeDropdownMenu);
            removeDropdownMenu();
        }
    }

    if (appendTo && self.dropdownMenu) {
        var pos = $position.positionElements($element, self.dropdownMenu, 'bottom-left', true),
          css,
          rightalign,
          scrollbarPadding,
          scrollbarWidth = 0;

        css = {
            top: pos.top + 'px',
            display: isOpen ? 'block' : 'none'
        };

        rightalign = self.dropdownMenu.hasClass('dropdown-menu-right');
        if (!rightalign) {
            css.left = pos.left + 'px';
            css.right = 'auto';
        } else {
            css.left = 'auto';
            scrollbarPadding = $position.scrollbarPadding(appendTo);

            if (scrollbarPadding.heightOverflow && scrollbarPadding.scrollbarWidth) {
                scrollbarWidth = scrollbarPadding.scrollbarWidth;
            }

            css.right = window.innerWidth - scrollbarWidth -
              (pos.left + $element.prop('offsetWidth')) + 'px';
        }

        // Need to adjust our positioning to be relative to the appendTo container
        // if it's not the body element
        if (!appendToBody) {
            var appendOffset = $position.offset(appendTo);

            css.top = pos.top - appendOffset.top + 'px';

            if (!rightalign) {
                css.left = pos.left - appendOffset.left + 'px';
            } else {
                css.right = window.innerWidth -
                  (pos.left - appendOffset.left + $element.prop('offsetWidth')) + 'px';
            }
        }

        var dropdownContainer = $element[0];
        var position = dropdownContainer.getBoundingClientRect().top;
        var buttonHeight = dropdownContainer.getBoundingClientRect().height;
        var dropdownMenu = $(self.dropdownMenu);
        var menuHeight = dropdownMenu.outerHeight();
        if (position > menuHeight && $($window).height() - position < buttonHeight + menuHeight) {
            css.top = pos.top - (buttonHeight + menuHeight) + 'px';
        }
        self.dropdownMenu.css(css);
    }

    var openContainer = appendTo ? appendTo : $element;
    var dropdownOpenClass = appendTo ? appendToOpenClass : openClass;
    var hasOpenClass = openContainer.hasClass(dropdownOpenClass);
    var isOnlyOpen = uibDropdownService.isOnlyOpen($scope, appendTo);

    if (hasOpenClass === !isOpen) {
        var toggleClass;
        if (appendTo) {
            toggleClass = !isOnlyOpen ? 'addClass' : 'removeClass';
        } else {
            toggleClass = isOpen ? 'addClass' : 'removeClass';
        }
        $animate[toggleClass](openContainer, dropdownOpenClass).then(function () {
            if (angular.isDefined(isOpen) && isOpen !== wasOpen) {
                toggleInvoker($scope, { open: !!isOpen });
            }
        });
    }

    if (isOpen) {
        if (self.dropdownMenuTemplateUrl) {
            $templateRequest(self.dropdownMenuTemplateUrl).then(function (tplContent) {
                templateScope = scope.$new();
                $compile(tplContent.trim())(templateScope, function (dropdownElement) {
                    var newEl = dropdownElement;
                    self.dropdownMenu.replaceWith(newEl);
                    self.dropdownMenu = newEl;
                    $document.on('keydown', uibDropdownService.keybindFilter);
                });
            });
        } else {
            $document.on('keydown', uibDropdownService.keybindFilter);
        }

        scope.focusToggleElement();
        uibDropdownService.open(scope, $element, appendTo);
    } else {
        uibDropdownService.close(scope, $element, appendTo);
        if (self.dropdownMenuTemplateUrl) {
            if (templateScope) {
                templateScope.$destroy();
            }
            var newEl = angular.element('<ul class="dropdown-menu"></ul>');
            self.dropdownMenu.replaceWith(newEl);
            self.dropdownMenu = newEl;
        }

        self.selectedOption = null;
    }

    if (angular.isFunction(setIsOpen)) {
        setIsOpen($scope, isOpen);
    }
});`