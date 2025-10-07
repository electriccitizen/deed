<?php

/**
 * @file
 * Includes all preprocess and alter hooks related to breadcrumbs.
 */

/**
 * Implements template_preprocess_breadcrumb().
 */
function citizen_dart_preprocess_breadcrumb(&$variables) {
  $node = \Drupal::routeMatch()->getParameter('node');
  $node_revision = \Drupal::routeMatch()->getParameter('node_revision');

  // Find node for custom breadcrumbs and pass as varaible to be used in Twig.
  if ($node_revision) {
    $vid = $node_revision->getRevisionId();
  }
  if ($node) {
    if ((!$node instanceof NodeInterface) && (isset($vid))) {
      $node = \Drupal::entityTypeManager()->getStorage('node')->loadRevision($vid);
    }
    $variables['currentNode'] = $node;
  }
}

/**
 * Implements hook_theme_suggestions_breadcrumb_alter().
 */
function citizen_dart_theme_suggestions_breadcrumb_alter(array &$suggestions, array $variables) {
  $node = \Drupal::routeMatch()->getParameter('node');
  $node_revision = \Drupal::routeMatch()->getParameter('node_revision');
  if ($node_revision) {
    $vid = $node_revision->getRevisionId();
  }
  if ((!$node instanceof NodeInterface) && (isset($vid))) {
    $node = \Drupal::entityTypeManager()->getStorage('node')->loadRevision($vid);
  }
  if ($node) {
    array_push($suggestions, 'breadcrumb__' . $node->getType());
  }
}
