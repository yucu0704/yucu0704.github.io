/**
 * Neon Vault — Hexo Theme Script
 * Ensures theme assets are properly copied during generation
 */
hexo.extend.generator.register('theme_assets', function(locals) {
  return {
    path: 'js/main.js',
    data: function() {
      return hexo.route.get('js/main.js');
    }
  };
});
