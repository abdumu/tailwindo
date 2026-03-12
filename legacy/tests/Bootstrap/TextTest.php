<?php

namespace Awssat\Tailwindo\Test;

use Awssat\Tailwindo\Converter;
use PHPUnit\Framework\TestCase;

class TextTest extends TestCase
{
    /** @var Awssat\Tailwindo\Converter */
    protected $converter;

    protected function setUp(): void
    {
        $this->converter = (new Converter())->setFramework('bootstrap');
    }

    /** @test */
    public function it_converts_text_with_breakpoint()
    {
        $this->assertEquals(
            'sm:text-left',
            $this->converter->classesOnly(true)->setContent('text-xs-left')->convert()->get()
        );
        $this->assertEquals(
            'lg:text-justify',
            $this->converter->classesOnly(true)->setContent('text-lg-justify')->convert()->get()
        );
    }
}
