<?php

namespace Awssat\Tailwindo\Test;

use Awssat\Tailwindo\Converter;
use Awssat\Tailwindo\Framework\BootstrapFramework;
use PHPUnit\Framework\TestCase;

class BootstrapFrameworkTest extends TestCase
{
    /** @var Awssat\Tailwindo\Converter */
    protected $bootstrap;
    protected $converter;

    protected function setUp(): void
    {
        $this->bootstrap = (new BootstrapFramework())->get();
        $this->converter = (new Converter())->setFramework('bootstrap');
    }

    /** @test */
    public function it_searches_for_no_classes_containing_double_dashes()
    {
        $match_array = [];

        foreach ($this->bootstrap as $item) {
            foreach ($item as $search => $replace) {
                if (strpos($search, '--') !== false) {
                    array_push($match_array, $search);
                }
            }
        }

        print_r($match_array);
        $this->assertEmpty($match_array);
    }

    /** @test */
    public function it_replaces_with_no_classes_containing_double_dashes()
    {
        $match_array = [];

        foreach ($this->bootstrap as $item) {
            foreach ($item as $search => $replace) {
                if ($replace instanceof \Closure) {
                    $callableReplace = \Closure::bind($replace, $this->converter, Converter::class);
                    $replace = $callableReplace();
                }

                if (strpos($replace, '--') !== false) {
                    array_push($match_array, [$search => $replace]);
                }
            }
        }

        // print_r($match_array);
        $this->assertEmpty($match_array);
    }
}
