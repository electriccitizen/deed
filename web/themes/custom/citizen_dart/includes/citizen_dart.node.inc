<?php

/**
 * @file
 * Includes all preprocess and alter hooks related to nodes.
 */

/**
 * Implements hook_preprocess_node().
 */
function citizen_dart_preprocess_node(&$variables) {
  if (isset($variables['elements']['#date_delta'])) {
    // Pass on stored date delta from views_view_unformatted.
    $variables['content']['field_dates']['#date_delta'] = $variables['elements']['#date_delta'];
  }
}
