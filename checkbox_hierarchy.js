/*
 * Copyright (c) 2009 Hiroshi Kuwabara <philography@gmail.com>
 *
 * Permission to use, copy, modify, and distribute this software for any
 * purpose with or without fee is hereby granted, provided that the above
 * copyright notice and this permission notice appear in all copies.
 *
 * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
 * WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
 * ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
 * WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
 * ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
 * OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
 */
(function($) {
       $.fn.checkboxHierarchy = function () {
               var checkboxes = $(this).find('input[type="checkbox"]');

               checkboxes.each(function (index, checkbox) {
                       var id = $(checkbox).attr('id');
                       $(checkbox).data('parents', findParents($(checkbox)));
                       $(checkbox).data('children', findChildren($(checkbox)));
                       $(checkbox).click(function () {
                               $.each($(checkbox).data('children'), function (index, child) {
                                       child.attr('checked', $(checkbox).attr('checked'));
                               });
                               $.each($(checkbox).data('parents'), function (index, parent) {
                                       parent.data('notify')();
                               })
                       });
               });

               function findParents(node) {
                       var found = arguments.callee.found || [];
                       var parent = $('#' + (node && node.attr && node.attr('rel') && node.attr('rel').replace(/ |(parent *:)/g, '')));
                       if (!parent.length) return found;

                       parent.data('notify', function () {
                               var all_children_checked = true;
                               $.each(parent.data('children'), function (index, child) {
                                       all_children_checked = all_children_checked && child.attr('checked');
                               });
                               parent.attr('checked', all_children_checked);
                       });

                       found.push(parent);
                       found = found.concat(arguments.callee(parent));
                       return found;
               }

               function findChildren(node) {
                       var found = arguments.callee.found || [];
                       var children = $('input[rel*="' + (node && node.attr && node.attr('id')) + '"]');
                       if (!children.length) return found;
                       for (var i = 0, j = children.length; i < j; i++) {
                               found.push($(children.get(i)));
                               found = found.concat(arguments.callee($(children.get(i))));
                       }
                       return found;
               }
       };
})(jQuery);
