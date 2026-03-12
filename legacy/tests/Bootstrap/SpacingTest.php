<?php

namespace Awssat\Tailwindo\Test;

use Awssat\Tailwindo\Converter;
use PHPUnit\Framework\TestCase;

class SpacingTest extends TestCase
{
    /** @var Awssat\Tailwindo\Converter */
    protected $converter;

    protected function setUp(): void
    {
        $this->converter = (new Converter())->setFramework('bootstrap');
    }

    // https://getbootstrap.com/docs/4.0/utilities/spacing/
    // https://tailwindcss.com/docs/padding/

    /**
     * @group Padding
     */

    /** @test */
    public function padding_it_converts_on_all_sides()
    {
        $this->assertEquals(
            'p-1',
            $this->converter->classesOnly(true)->setContent('p-1')->convert()->get()
        );

        $this->assertEquals(
            'sm:p-1',
            $this->converter->classesOnly(true)->setContent('p-sm-1')->convert()->get()
        );

        $this->assertEquals(
            'md:p-2',
            $this->converter->classesOnly(true)->setContent('p-md-2')->convert()->get()
        );

        $this->assertEquals(
            'lg:p-4',
            $this->converter->classesOnly(true)->setContent('p-lg-3')->convert()->get()
        );

        $this->assertEquals(
            'xl:p-6',
            $this->converter->classesOnly(true)->setContent('p-xl-4')->convert()->get()
        );

        $this->assertEquals(
            'xl:p-12',
            $this->converter->classesOnly(true)->setContent('p-xl-5')->convert()->get()
        );
    }

    /** @test */
    public function padding_it_converts_on_y()
    {
        $this->assertEquals(
            'py-1',
            $this->converter->classesOnly(true)->setContent('py-1')->convert()->get()
        );

        $this->assertEquals(
            'sm:py-1',
            $this->converter->classesOnly(true)->setContent('py-sm-1')->convert()->get()
        );

        $this->assertEquals(
            'md:py-2',
            $this->converter->classesOnly(true)->setContent('py-md-2')->convert()->get()
        );

        $this->assertEquals(
            'lg:py-4',
            $this->converter->classesOnly(true)->setContent('py-lg-3')->convert()->get()
        );

        $this->assertEquals(
            'xl:py-6',
            $this->converter->classesOnly(true)->setContent('py-xl-4')->convert()->get()
        );

        $this->assertEquals(
            'xl:py-12',
            $this->converter->classesOnly(true)->setContent('py-xl-5')->convert()->get()
        );
    }

    /** @test */
    public function padding_it_converts_on_x()
    {
        $this->assertEquals(
            'px-1',
            $this->converter->classesOnly(true)->setContent('px-1')->convert()->get()
        );

        $this->assertEquals(
            'sm:px-1',
            $this->converter->classesOnly(true)->setContent('px-sm-1')->convert()->get()
        );

        $this->assertEquals(
            'md:px-2',
            $this->converter->classesOnly(true)->setContent('px-md-2')->convert()->get()
        );

        $this->assertEquals(
            'lg:px-4',
            $this->converter->classesOnly(true)->setContent('px-lg-3')->convert()->get()
        );

        $this->assertEquals(
            'xl:px-6',
            $this->converter->classesOnly(true)->setContent('px-xl-4')->convert()->get()
        );

        $this->assertEquals(
            'xl:px-12',
            $this->converter->classesOnly(true)->setContent('px-xl-5')->convert()->get()
        );
    }

    /** @test */
    public function padding_it_converts_0_on_all_sides()
    {
        $this->assertEquals(
            'p-0',
            $this->converter->classesOnly(true)->setContent('p-0')->convert()->get()
        );

        $this->assertEquals(
            'lg:py-0',
            $this->converter->classesOnly(true)->setContent('py-lg-0')->convert()->get()
        );
    }

    /**
     * @group Margin
     */

    /** @test */
    public function margin_it_converts_on_all_sides()
    {
        $this->assertEquals(
            'm-1',
            $this->converter->classesOnly(true)->setContent('m-1')->convert()->get()
        );

        $this->assertEquals(
            'sm:m-1',
            $this->converter->classesOnly(true)->setContent('m-sm-1')->convert()->get()
        );

        $this->assertEquals(
            'md:m-2',
            $this->converter->classesOnly(true)->setContent('m-md-2')->convert()->get()
        );

        $this->assertEquals(
            'lg:m-4',
            $this->converter->classesOnly(true)->setContent('m-lg-3')->convert()->get()
        );

        $this->assertEquals(
            'xl:m-6',
            $this->converter->classesOnly(true)->setContent('m-xl-4')->convert()->get()
        );

        $this->assertEquals(
            'xl:m-12',
            $this->converter->classesOnly(true)->setContent('m-xl-5')->convert()->get()
        );
    }

    /** @test */
    public function margin_it_converts_on_y()
    {
        $this->assertEquals(
            'my-1',
            $this->converter->classesOnly(true)->setContent('my-1')->convert()->get()
        );

        $this->assertEquals(
            'sm:my-1',
            $this->converter->classesOnly(true)->setContent('my-sm-1')->convert()->get()
        );

        $this->assertEquals(
            'md:my-2',
            $this->converter->classesOnly(true)->setContent('my-md-2')->convert()->get()
        );

        $this->assertEquals(
            'lg:my-4',
            $this->converter->classesOnly(true)->setContent('my-lg-3')->convert()->get()
        );

        $this->assertEquals(
            'xl:my-6',
            $this->converter->classesOnly(true)->setContent('my-xl-4')->convert()->get()
        );

        $this->assertEquals(
            'xl:my-12',
            $this->converter->classesOnly(true)->setContent('my-xl-5')->convert()->get()
        );
    }

    /** @test */
    public function margin_it_converts_on_x()
    {
        $this->assertEquals(
            'mx-1',
            $this->converter->classesOnly(true)->setContent('mx-1')->convert()->get()
        );

        $this->assertEquals(
            'sm:mx-1',
            $this->converter->classesOnly(true)->setContent('mx-sm-1')->convert()->get()
        );

        $this->assertEquals(
            'md:mx-2',
            $this->converter->classesOnly(true)->setContent('mx-md-2')->convert()->get()
        );

        $this->assertEquals(
            'lg:mx-4',
            $this->converter->classesOnly(true)->setContent('mx-lg-3')->convert()->get()
        );

        $this->assertEquals(
            'xl:mx-6',
            $this->converter->classesOnly(true)->setContent('mx-xl-4')->convert()->get()
        );

        $this->assertEquals(
            'xl:mx-12',
            $this->converter->classesOnly(true)->setContent('mx-xl-5')->convert()->get()
        );
    }

    /** @test */
    public function margin_it_converts_0_on_all_sides()
    {
        $this->assertEquals(
            'm-0',
            $this->converter->classesOnly(true)->setContent('m-0')->convert()->get()
        );

        $this->assertEquals(
            'lg:my-0',
            $this->converter->classesOnly(true)->setContent('my-lg-0')->convert()->get()
        );
    }
}
