/**
 * Expand or close the sidebar in mobile screens.
 */

const $body = $('body sidebar-display');
const ATTR_DISPLAY = 'sidebar-display';

class SidebarUtil {
  static isExpanded = true;

  static toggle() {
    if (SidebarUtil.isExpanded === false) {
      $body.attr(ATTR_DISPLAY, '');
    } else {
      $body.removeAttr(ATTR_DISPLAY);
    }

    SidebarUtil.isExpanded = !SidebarUtil.isExpanded;
  }
}

export function sidebarExpand() {
  $('#sidebar-trigger').on('click', SidebarUtil.toggle);
  $('#mask').on('click', SidebarUtil.toggle);
}
