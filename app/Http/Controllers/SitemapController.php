<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Category;
use Illuminate\Support\Facades\Cache;
use Illuminate\Http\Response;

class SitemapController extends Controller
{
    public function index(): Response
    {
        // Mis en cache 1h : évite de reconstruire le XML à chaque requête de robot
        $xml = Cache::remember('sitemap.xml', 3600, function () {
            return $this->generateXml();
        });

        return response($xml, 200)->header('Content-Type', 'application/xml');
    }

    protected function generateXml(): string
    {
        $baseUrl = rtrim(config('app.url'), '/');

        $xml = '<?xml version="1.0" encoding="UTF-8"?>' . "\n";
        $xml .= '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' . "\n";

        // --- Pages statiques ---
        $staticPages = [
            ['url' => '/', 'priority' => '1.0', 'changefreq' => 'daily'],
            ['url' => '/shop', 'priority' => '0.9', 'changefreq' => 'daily'],
            ['url' => '/contact', 'priority' => '0.5', 'changefreq' => 'monthly'],
        ];
        foreach ($staticPages as $page) {
            $xml .= $this->urlTag($baseUrl . $page['url'], now(), $page['changefreq'], $page['priority']);
        }

        // --- Catégories (pages de filtre /shop?category=id) ---
        Category::select('id', 'updated_at')->chunk(100, function ($categories) use (&$xml, $baseUrl) {
            foreach ($categories as $category) {
                $xml .= $this->urlTag(
                    "{$baseUrl}/shop?category={$category->id}",
                    $category->updated_at,
                    'weekly',
                    '0.7'
                );
            }
        });

        // --- Produits ---
        Product::select('slug', 'updated_at')->chunk(100, function ($products) use (&$xml, $baseUrl) {
            foreach ($products as $product) {
                $xml .= $this->urlTag(
                    "{$baseUrl}/product/{$product->slug}",
                    $product->updated_at,
                    'weekly',
                    '0.8'
                );
            }
        });

        $xml .= '</urlset>';

        return $xml;
    }

    protected function urlTag(string $url, $lastmod, string $changefreq, string $priority): string
    {
        $lastmodStr = $lastmod instanceof \DateTimeInterface ? $lastmod->toAtomString() : now()->toAtomString();

        return "  <url>\n"
            . "    <loc>" . htmlspecialchars($url, ENT_XML1) . "</loc>\n"
            . "    <lastmod>{$lastmodStr}</lastmod>\n"
            . "    <changefreq>{$changefreq}</changefreq>\n"
            . "    <priority>{$priority}</priority>\n"
            . "  </url>\n";
    }
}
