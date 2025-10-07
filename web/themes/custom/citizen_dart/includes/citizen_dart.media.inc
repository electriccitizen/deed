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
    case 'banner':
      $img_width = 1000;
      $img_height = 400;
      // Get the url for each image style being preloaded.
      $deskURL = ImageStyle::load('banner_desk')->buildUrl($variables['uri']);
      $midDeskURL = ImageStyle::load('banner_middesk')->buildUrl($variables['uri']);
      $bigDeskURL = ImageStyle::load('banner_big_desk')->buildUrl($variables['uri']);
      // Construct links for each image style being preloaded.
      $deskLinkTag = [
        '#tag' => 'link',
        '#attributes' => [
          'rel' => 'preload',
          'as' => 'image',
          'href' => $deskURL,
          'media' => '(min-width:896px) and (max-width:1143.9px)',
        ],
      ];
      $midDeskLinkTag = [
        '#tag' => 'link',
        '#attributes' => [
          'rel' => 'preload',
          'as' => 'image',
          'href' => $midDeskURL,
          'media' => '(min-width:1144px) and (max-width:1319.9px)',
        ],
      ];
      $bigDeskLinkTag = [
        '#tag' => 'link',
        '#attributes' => [
          'rel' => 'preload',
          'as' => 'image',
          'href' => $bigDeskURL,
          'media' => '(min-width:1320px)',
        ],
      ];
      // Attach links for each image style being preloaded.
      $variables['#attached']['html_head'][] = [$deskLinkTag, 'preloadBannerImageDesk'];
      $variables['#attached']['html_head'][] = [$midDeskLinkTag, 'preloadBannerImageMidDesk'];
      $variables['#attached']['html_head'][] = [$bigDeskLinkTag, 'preloadBannerImageBigDesk'];
      break;

    case 'full':
      $img_width = 1200;
      $img_height = 800;
      break;

    case 'large':
      $img_width = 800;
      $img_height = 533;
      break;

    case 'large_thumb':
      $img_width = 240;
      $img_height = 200;
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

    case 'views_card':
      $img_width = 400;
      $img_height = 300;
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
