<?php

/**
 * @file
 * Includes all preprocess and alter hooks related to menus.
 */

/**
 * Implements template_preprocess_menu().
 */
function citizen_dart_preprocess_menu(&$variables) {
  switch ($variables['menu_name']) {
    case 'main':
      _menu_item_classes_recursive($variables['items']);
    case 'support-book':
      _menu_item_classes_recursive($variables['items']);

      break;
  }
}

/**
 * Recursively looks through menu tree and distributes identifying classes.
 *
 * @param array $items
 *   A Drupal array of menu items.
 */
function _menu_item_classes_recursive(array &$items) {
  foreach ($items as &$item) {
    $item['link_classes'] = [];
    if (!$item['url']->isExternal() && $item['url']->isRouted() && $item['url']->getRouteName() === '<nolink>') {
      $item['link_classes'][] = 'nolink';
    }
    if (!empty($item['below'])) {
      $item['link_classes'][] = 'menuparent';
      _menu_item_classes_recursive($item['below']);
    }
    if ($item['url']->toString() === \Drupal::request()->getRequestUri()) {
      $item['link_classes'][] = 'is-active';
    }
  }
}
