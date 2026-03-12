<?php

namespace Awssat\Tailwindo\Framework;

interface Framework
{
    public function defaultCSS(): array;

    public function frameworkName(): string;

    public function supportedVersion(): array;

    public function get(): \Generator;
}
