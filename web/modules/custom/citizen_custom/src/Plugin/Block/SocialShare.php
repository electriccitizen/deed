<?php

namespace Drupal\citizen_custom\Plugin\Block;

use Drupal\Core\Block\BlockBase;
use Drupal\Core\Plugin\ContainerFactoryPluginInterface;
use Drupal\Core\Routing\CurrentRouteMatch;
use Drupal\node\NodeInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;

/**
 * Provides a 'Social Share' block.
 *
 * @Block(
 *   id = "social_share",
 *   admin_label = @Translation("Social Share"),
 *   category = @Translation("Social Share"),
 * )
 */
class SocialShare extends BlockBase implements ContainerFactoryPluginInterface {

  /**
   * The node from the routematch.
   *
   * @var node \Drupal\node\NodeInterface
   */
  protected $node;

  /**
   * {@inheritdoc}
   */
  public static function create(ContainerInterface $container, array $configuration, $plugin_id, $plugin_definition) {
    return new static(
      $configuration,
      $plugin_id,
      $plugin_definition,
      $container->get('current_route_match')
    );
  }

  /**
   * {@inheritdoc}
   */
  public function __construct(array $configuration, $plugin_id, $plugin_definition, CurrentRouteMatch $route) {
    parent::__construct($configuration, $plugin_id, $plugin_definition);
    $this->node = $route->getParameter('node');
  }

  /**
   * {@inheritdoc}
   */
  public function build() {

    // Set defaults. If $node is not set, this block is either improperly placed
    // or is being previewed.
    $data = [
      'url' => 'example_url',
      'title' => $this->t("Example Node Title"),
      'base_url' => $GLOBALS['base_url'],
    ];

    if ($this->node instanceof NodeInterface) {
      // Get the variables we need to pass to twig.
      $data['url'] = $this->node->toUrl()->toString();
      $data['title'] = $this->node->getTitle();
    }

    return [
      '#theme' => 'social_share_block',
      '#data' => $data,
    ];
  }

}
