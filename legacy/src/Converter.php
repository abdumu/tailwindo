<?php

namespace Awssat\Tailwindo;

class Converter
{
    protected $givenContent = '';

    protected $isCssClassesOnly = false;

    protected $changes = 0;

    protected $lastSearches = [];

    /** @var \Awssat\Tailwindo\Framework\Framework */
    protected $framework;

    protected $generateComponents = false;

    protected $components = [];

    /** @var string|null */
    protected $prefix;

    public function __construct(?string $content = null)
    {
        if (!empty($content)) {
            $this->setContent($content);
        }
    }

    public function setContent(string $content): self
    {
        $this->givenContent = $content;
        $this->lastSearches = [];
        $this->components = [];

        return $this;
    }

    public function setFramework(string $framework): self
    {
        $framework = 'Awssat\\Tailwindo\\Framework\\'.ucfirst($framework).'Framework';

        $this->framework = new $framework();

        return $this;
    }

    public function getFramework(): \Awssat\Tailwindo\Framework\Framework
    {
        return $this->framework;
    }

    /**
     * Is the given content a CSS content or HTML content.
     */
    public function classesOnly(bool $value): self
    {
        $this->isCssClassesOnly = $value;

        return $this;
    }

    /**
     * Is the given content a CSS content or HTML content.
     */
    public function setGenerateComponents(bool $value): self
    {
        $this->generateComponents = $value;

        return $this;
    }

    /**
     * The prefix option allows you to add a custom prefix to all of Tailwind's generated utility classes. This can be really useful when layering Tailwind on top of existing CSS where there might be naming conflicts.
     *
     * @param string $prefix
     *
     * @return Converter
     */
    public function setPrefix(string $prefix): self
    {
        $prefix = trim($prefix);
        if (!empty($prefix)) {
            $this->prefix = $prefix;
        }

        return $this;
    }

    public function convert(): self
    {
        foreach ($this->getFramework()->get() as $item) {
            foreach ($item as $search => $replace) {
                $this->searchAndReplace($search, $replace);
            }
        }

        return $this;
    }

    /**
     * Get the converted content.
     */
    public function get($getComponents = false): string
    {
        if ($getComponents) {
            return $this->getComponents();
        }

        $this->givenContent = preg_replace('/\{tailwindo\|([^\}]+)\}/', '$1', $this->givenContent);

        return $this->givenContent;
    }

    public function getComponents(): string
    {
        if (!$this->generateComponents) {
            return '';
        }

        $result = '';
        foreach ($this->components as $selector => $classes) {
            if ($selector == $classes) {
                continue;
            }

            $result .= ".{$selector} {\n\t@apply {$classes};\n}\n";
        }

        return $result;
    }

    /**
     * Get the number of committed changes.
     */
    public function changes(): int
    {
        return $this->changes;
    }

    /**
     * search for a word in the last searches.
     */
    protected function isInLastSearches(string $searchFor, int $limit = 0): bool
    {
        $i = 0;

        foreach ($this->lastSearches as $search) {
            if (strpos($search, $searchFor) !== false) {
                return true;
            }

            if ($i++ >= $limit && $limit > 0) {
                return false;
            }
        }

        return false;
    }

    protected function addToLastSearches($search)
    {
        $this->changes++;

        $search = stripslashes($search);

        if ($this->isInLastSearches($search)) {
            return;
        }

        $this->lastSearches[] = $search;

        if (count($this->lastSearches) >= 50) {
            array_shift($this->lastSearches);
        }
    }

    /**
     * Search the given content and replace.
     *
     * @param string          $search
     * @param string|\Closure $replace
     */
    protected function searchAndReplace($search, $replace): void
    {
        if ($replace instanceof \Closure) {
            $callableReplace = \Closure::bind($replace, $this, self::class);
            $replace = $callableReplace();
        }

        $regexStart = !$this->isCssClassesOnly ? '(?<start>class(?:Name)?\s*=\s*(?<quotation>["\'])((?!\k<quotation>).)*)' : '(?<start>\s*)';
        $regexEnd = !$this->isCssClassesOnly ? '(?<end>((?!\k<quotation>).)*\k<quotation>)' : '(?<end>\s*)';

        $search = preg_quote($search);

        $currentSubstitute = 0;

        while (true) {
            if (strpos($search, '\{regex_string\}') !== false || strpos($search, '\{regex_number\}') !== false) {
                $currentSubstitute++;
                foreach (['regex_string'=> '[a-zA-Z0-9]+', 'regex_number' => '[0-9]+'] as $regeName => $regexValue) {
                    $regexMatchCount = preg_match_all('/\\\\?\{'.$regeName.'\\\\?\}/', $search);
                    $search = preg_replace('/\\\\?\{'.$regeName.'\\\\?\}/', '(?<'.$regeName.'_'.$currentSubstitute.'>'.$regexValue.')', $search, 1);
                    $replace = preg_replace('/\\\\?\{'.$regeName.'\\\\?\}/', '${'.$regeName.'_'.$currentSubstitute.'}', $replace, $regexMatchCount > 1 ? 1 : -1);
                }

                continue;
            }

            break;
        }

        if (!preg_match_all('/'.$regexStart.'(?<given>(?<![\-_.\w\d])'.$search.'(?![\-_.\w\d]))'.$regexEnd.'/i', $this->givenContent, $matches, PREG_SET_ORDER)) {
            return;
        }

        foreach ($matches as $match) {
            $result = preg_replace_callback(
                '/(?<given>(?<![\-_.\w\d])'.$search.'(?![\-_.\w\d]))/',
                function ($match) use ($replace) {
                    $replace = preg_replace_callback('/\$\{regex_(string|number)_(\d+)\}/', function ($m) use ($match) {
                        return $match['regex_'.$m[1].'_'.$m[2]];
                    }, $replace);

                    if ($this->generateComponents && !in_array($match['given'], $this->components)) {
                        $this->components[$match['given']] = preg_replace('/\{tailwindo\|([^\}]+)\}/', '$1', $replace);
                    }

                    if ($this->prefix) {
                        $arr = explode(' ', $replace);
                        $arr = array_map(function ($class) {
                            $responsiveOrStatePrefix = substr($class, 0, strpos($class, ':'));
                            if ($responsiveOrStatePrefix) {
                                $utilityName = str_replace($responsiveOrStatePrefix.':', '', $class);

                                return "{$responsiveOrStatePrefix}:{$this->prefix}{$utilityName}";
                            } elseif ($class) {
                                return "{$this->prefix}{$class}";
                            }

                            return $class;
                        }, $arr);
                        $arr = array_filter($arr);

                        return trim(implode(' ', $arr));
                    }

                    return $replace;
                },
                $match[0]
            );

            if (strcmp($match[0], $result) !== 0) {
                if ($count = preg_match_all('/\{tailwindo\|.*?\}/', $result)) {
                    if ($count > 1) {
                        $result = preg_replace('/\{tailwindo\|.*?\}/', '', $result, $count - 1);
                    }
                }

                $this->givenContent = str_replace($match[0], $result, $this->givenContent);
                $this->addToLastSearches($search);
            }
        }
    }
}
