<?php

/**
 * @file
 * Includes all preprocess and alter hooks related to paragraphs.
 */

/**
 * Implements hook_preprocess_paragraph__PARAGRAPH_ID().
 */
function citizen_dart_preprocess_paragraph__form_placer(&$variables) {
  $paragraph = $variables['paragraph'] ?? '';
  if (isset($paragraph->field_form_title->value)) {
    $form_title = $paragraph->field_form_title->value;
    $webform = $variables['elements']['field_form'][0]['#webform'];
    $webform->set('webform_placer', TRUE);
    $webform->set('show_placer_title', $form_title);
  }
}

/**
 * Implements hook_theme_suggestions_paragraph_alter().
 */
function citizen_dart_theme_suggestions_paragraph_alter(array &$suggestions, array $variables) {
  $paragraph = $variables['elements']['#paragraph'];
  $id = $paragraph->id();
  array_push($suggestions, 'paragraph__' . $paragraph->getType() . '__' . $id);
}
