<?php

/**
 * @file
 * Includes all preprocess and alter hooks related to blocks.
 */

use Drupal\block\Entity\Block;

/**
 * Implements hook_theme_suggestions_block_alter().
 */
function citizen_dart_theme_suggestions_block_alter(array &$suggestions, array $variables) {
  // Block suggestions for custom block bundles.
  if (isset($variables['elements']['content']['#block_content'])) {
    $block_name = str_replace(' ', '_', strtolower($variables['elements']['content']['#block_content']->label()));
    array_splice($suggestions, 1, 0, 'block__' . $variables['elements']['content']['#block_content']->bundle());
    array_splice($suggestions, 2, 0, 'block__' . $block_name);
    array_splice($suggestions, 3, 0, 'block__' . $variables['elements']['content']['#block_content']->id());
  }
}

/**
 * Implements hook_preprocess_block().
 */
function citizen_dart_preprocess_block(&$variables) {
  // Remove contextual links from header blocks.
  if (isset($variables['elements']['#id'])) {
    $block_id = $variables['elements']['#id'];
    $block = Block::load($block_id);
    $region = $block->getRegion();
    if ($region == 'header') {
      if (isset($variables['elements']['#contextual_links'])) {
        unset($variables['elements']['#contextual_links']);
      }
      if (isset($variables['attributes']['class'][0])) {
        unset($variables['attributes']['class'][0]);
      }
    }
  }
}
