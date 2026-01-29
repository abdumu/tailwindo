<?php

namespace Awssat\Tailwindo\Test;

use Awssat\Tailwindo\Converter;
use PHPUnit\Framework\TestCase;

class ConverterTest extends TestCase
{
    /** @var Awssat\Tailwindo\Converter */
    protected $converter;

    protected function setUp(): void
    {
        $this->converter = (new Converter())->setFramework('bootstrap');
    }

    /** @test */
    public function it_returns_output()
    {
        $this->assertEquals(
            'sm:flex',
            $this->converter->classesOnly(true)->setContent('d-sm-flex')->convert()->get()
        );
        $this->assertEquals(
            '<a class="text-gray-700">love</a>',
            $this->converter->setContent('<a class="text-muted">love</a>')->convert()->get()
        );
    }

    /** @test */
    public function it_returns_output_with_prefix()
    {
        $this->converter->setPrefix('tw-');
        $this->assertEquals(
            'sm:tw-flex',
            $this->converter->classesOnly(true)->setContent('d-sm-flex')->convert()->get()
        );
        $this->assertEquals(
            '<a class="tw-text-gray-700">love</a>',
            $this->converter->setContent('<a class="text-muted">love</a>')->convert()->get()
        );
    }

    /** @test */
    public function it_handles_jsx_class_name()
    {
        $this->assertEquals(
            '<a className="sm:flex text-gray-700">love</a>',
            $this->converter->setContent('<a className="d-sm-flex text-muted">love</a>')->convert()->get()
        );
    }

    /** @test */
    public function it_converts_utilities_correctly()
    {
        $this->assertEquals(
            'whitespace-nowrap',
            $this->converter->classesOnly(true)->setContent('text-nowrap')->convert()->get()
        );
        $this->assertEquals(
            'flex-nowrap',
            $this->converter->classesOnly(true)->setContent('flex-nowrap')->convert()->get()
        );
         $this->assertEquals(
            'focus:not-sr-only',
            $this->converter->classesOnly(true)->setContent('sr-only-focusable')->convert()->get()
        );
    }

    /** @test */
    public function it_converts_container_fluid()
    {
        $this->assertEquals(
            '<div class="w-full mx-auto sm:px-4"></div>',
            $this->converter->setContent('<div class="container-fluid"></div>')->convert()->get()
        );
    }

    /** @test */
    public function it_converts_buttons()
    {
        $result = $this->converter->setContent('<button class="btn btn-primary"></button>')->convert()->get();
        $this->assertStringContainsString('bg-blue-600', $result);
        $this->assertStringContainsString('hover:bg-blue-700', $result);
        $this->assertStringContainsString('focus:ring-4', $result);
        $this->assertStringContainsString('py-2 px-4', $result);
    }

    /** @test */
    public function it_converts_outline_buttons()
    {
        $result = $this->converter->setContent('<button class="btn btn-outline-danger"></button>')->convert()->get();
        $this->assertStringContainsString('border-red-600', $result);
        $this->assertStringContainsString('text-red-600', $result);
        $this->assertStringContainsString('hover:bg-red-600', $result);
        // Ensure no conflicting hover state
        $this->assertStringNotContainsString('hover:bg-red-700', $result);
    }

    /** @test */
    public function it_converts_grid()
    {
        $result = $this->converter->setContent('<div class="row"><div class="col-md-6"></div></div>')->convert()->get();
        $this->assertStringContainsString('flex flex-wrap -mx-4', $result);
        $this->assertStringContainsString('md:w-1/2 px-4', $result);
    }
}
