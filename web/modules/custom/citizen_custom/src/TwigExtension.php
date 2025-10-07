<?php

namespace Drupal\citizen_custom;

use Twig\Extension\AbstractExtension;
use Twig\TwigFilter;

/**
 * Custom twig functions.
 */
class TwigExtension extends AbstractExtension {

  /**
   * {@inheritdoc}
   */
  public function getName() {
    return 'citizen_custom.twig_extension';
  }

  /**
   * {@inheritdoc}
   */
  public function getFilters() {
    return [
      new TwigFilter('shuffle', [$this, 'shuffleArray']),
    ];
  }

  /**
   * Randomly arranges elements of an array.
   *
   * @param array $list
   *   An array of elements to be shuffled.
   *
   * @return array
   *   The elements shuffled.
   */
  public function shuffleArray($list) {
    if (!is_array($list)) {
      return $list;
    }
    $keys = array_keys($list);
    shuffle($keys);
    $random = [];
    foreach ($keys as $key) {
      $random[$key] = $list[$key];
    }
    return $random;
  }

}
