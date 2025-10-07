<?php

/**
 * @file
 * Includes all preprocess and alter hooks related to forms.
 */

use Drupal\Core\Form\FormStateInterface;
use Drupal\webform\Entity\Webform;

/**
 * Implements hook_preprocess_webform().
 *
 * Adds form titles as twig variables.
 */
function citizen_dart_preprocess_webform(&$variables) {
  $webform_id = $variables["element"]["#webform_id"];
  $webform = Webform::load($webform_id);
  if ($webform->get('webform_placer')) {
    $variables['webform_placer'] = TRUE;
  }
  if ($webform->get('show_placer_title')) {
    $variables['show_placer_title'] = TRUE;
  }
  $variables['title'] = $webform->label();
}

/**
 * Implements hook_form_alter().
 */
function citizen_dart_form_alter(&$form, FormStateInterface $form_state, $form_id) {
  if ($form['#id'] == 'site-search-form') {
    $form['actions']['submit']['#suffix'] = '<span class="material-icons">&#xE8b6;</span>';
  }
  if (strpos($form_id, 'views_exposed_form') === 0) {
    if (isset($form['actions']['submit'])) {
      $form['actions']['submit']['#attributes']['class'][] = 'views-submit';
    }
    if (isset($form['actions']['reset'])) {
      $form['actions']['reset']['#attributes']['class'][] = 'views-reset';
    }
  }
}

/**
 * Implements hook_theme_suggestions_HOOK_alter().
 */
function citizen_dart_theme_suggestions_form_alter(array &$suggestions, array $variables) {
  if (!empty($variables['element']['#form_id'])) {
    $suggestions[] = 'form__' . $variables['element']['#form_id'];
  }
}
