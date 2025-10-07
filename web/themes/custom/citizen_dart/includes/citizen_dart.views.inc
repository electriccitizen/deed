<?php

/**
 * @file
 * Includes all preprocess and alter hooks related to views.
 */

/**
 * Implements hook_preprocess_views_view_unformatted().
 */
function citizen_dart_preprocess_views_view_unformatted(&$variables) {
  $view = $variables['view'];
  if (($view->id() == 'events') || ($view->id() == 'content_list')) {
    foreach ($view->result as $index => $row) {
      if (isset($row->node__field_dates_delta)) {
        // Store which date in the multivalue date field this views row refers
        // to, for rendering in the results.
        $variables['rows'][$index]['content']['#date_delta'] = $row->node__field_dates_delta;
        // Add a key to the cache so that each rendered version of this node is
        // rendered separately.
        $variables['rows'][$index]['content']['#cache']['keys'][] = $row->node__field_dates_delta;
      }
    }
  }
}
