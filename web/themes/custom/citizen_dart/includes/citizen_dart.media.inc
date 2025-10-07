<?php

/**
 * @file
 * Includes all preprocess and alter hooks related to media entities.
 */

use Drupal\image\Entity\ImageStyle;

/**
 * Implements template_preprocess_responsive_image().
 *
 * Provide width and height dimensions for use in the responsive image template
 * to prevent layout shifts.
 */
function citizen_dart_preprocess_responsive_image(&$variables) {
  // Get responsive image style in order to map hard-coded dimension values.
  $style_id = $variables['responsive_image_style_id'];

  switch ($style_id) {

    case '460x460':
      $img_width = 460;
      $img_height = 460;
      break;
    
    case '551x500':
      $img_width = 551;
      $img_height = 500;
      break;

    case '731x500':
      $img_width = 731;
      $img_height = 500;
      break;

    case 'full':
      $img_width = 1200;
      $img_height = 800;
      break;

    case 'large':
      $img_width = 800;
      $img_height = 533;
      break;

    case 'medium':
      $img_width = 480;
      $img_height = 320;
      break;

    case 'small':
      $img_width = 280;
      $img_height = 187;
      break;

    case 'square':
      $img_width = 360;
      $img_height = 360;
      break;

    case 'thumbnail_cropped':
      $img_width = 96;
      $img_height = 96;
      break;

    default:
      $img_width = 'default';
      $img_height = 'default';
      break;

  }

  // Set responsive fallback image attributes for width, height, fetchpriority.
  if (!($img_width == 'default' || $img_height == 'default')) {
    $variables['img_element']['#attributes']['width'] = $img_width;
    $variables['img_element']['#attributes']['height'] = $img_height;
    if ($style_id == 'banner') {
      $variables['img_element']['#attributes']['fetchpriority'] = 'high';
    }
  }
}
